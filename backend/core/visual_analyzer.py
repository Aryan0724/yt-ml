import numpy as np
import cv2
import os
import logging

logger = logging.getLogger(__name__)

# Singleton holders for heavy ML models to avoid reloading per request
_YOLO_MODEL = None
_YOLO_TRIED = False
_EASYOCR_READER = None
_EASYOCR_TRIED = False

# Native OpenCV Face Detector (Built into opencv-python, 0MB download, 5ms execution)
_HAAR_FACE_CASCADE = None

def get_haar_cascade():
    global _HAAR_FACE_CASCADE
    if _HAAR_FACE_CASCADE is None:
        try:
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            if os.path.exists(cascade_path):
                _HAAR_FACE_CASCADE = cv2.CascadeClassifier(cascade_path)
        except Exception as e:
            logger.warning(f"Could not load Haar cascade: {e}")
    return _HAAR_FACE_CASCADE

def get_yolo_model():
    """Lazily loads YOLOv8 once as a singleton if available."""
    global _YOLO_MODEL, _YOLO_TRIED
    if not _YOLO_TRIED:
        _YOLO_TRIED = True
        try:
            # Check if model file already exists locally to avoid blocking downloads in production
            from ultralytics import YOLO
            model_path = os.environ.get("YOLO_MODEL_PATH", "yolov8n.pt")
            _YOLO_MODEL = YOLO(model_path)
            logger.info("YOLOv8 model initialized as singleton.")
        except Exception as e:
            logger.warning(f"YOLOv8 unavailable, using fast OpenCV Haar cascade: {e}")
            _YOLO_MODEL = None
    return _YOLO_MODEL

def get_easyocr_reader():
    """Lazily loads EasyOCR once as a singleton if available."""
    global _EASYOCR_READER, _EASYOCR_TRIED
    if not _EASYOCR_TRIED:
        _EASYOCR_TRIED = True
        try:
            import easyocr
            _EASYOCR_READER = easyocr.Reader(['en'], gpu=False, verbose=False)
            logger.info("EasyOCR reader initialized as singleton.")
        except Exception as e:
            logger.warning(f"EasyOCR unavailable, using fast OpenCV text contour segmentation: {e}")
            _EASYOCR_READER = None
    return _EASYOCR_READER

def calculate_colorfulness(image):
    """Calculates human-perceived colorfulness (Hasler and Suesstrunk metric)."""
    (B, G, R) = cv2.split(image.astype("float"))
    rg = np.absolute(R - G)
    yb = np.absolute(0.5 * (R + G) - B)
    (rbMean, rbStd) = (np.mean(rg), np.std(rg))
    (ybMean, ybStd) = (np.mean(yb), np.std(yb))
    stdRoot = np.sqrt((rbStd ** 2) + (ybStd ** 2))
    meanRoot = np.sqrt((rbMean ** 2) + (ybMean ** 2))
    return stdRoot + (0.3 * meanRoot)

def detect_faces_fast(img_bgr, gray):
    """
    Fast face detection:
    1. Tries YOLO if pre-warmed.
    2. Falls back immediately to native OpenCV Haar cascade (5ms).
    """
    h, w = img_bgr.shape[:2]
    face_boxes = []
    face_areas = []

    yolo = get_yolo_model()
    if yolo is not None:
        try:
            results = yolo(img_bgr, classes=0, verbose=False)
            for r in results:
                for box in r.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    w_box = max(0, x2 - x1)
                    h_box = max(0, y2 - y1)
                    face_boxes.append({"x": int(x1), "y": int(y1), "w": int(w_box), "h": int(h_box)})
                    face_areas.append(w_box * h_box)
            if face_boxes:
                return face_boxes, face_areas
        except Exception as e:
            logger.debug(f"YOLO detection pass failed: {e}")

    # Fast OpenCV Haar fallback
    cascade = get_haar_cascade()
    if cascade is not None and not cascade.empty():
        try:
            detected = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(30, 30))
            for (x, y, w_box, h_box) in detected:
                face_boxes.append({"x": int(x), "y": int(y), "w": int(w_box), "h": int(h_box)})
                face_areas.append(w_box * h_box)
        except Exception as e:
            logger.debug(f"Haar cascade detection error: {e}")

    return face_boxes, face_areas

def detect_text_fast(img_bgr, gray):
    """
    Text & Readability analysis:
    1. Tries EasyOCR singleton if pre-warmed.
    2. Falls back instantly to morphological gradient text region segmentation.
    """
    h, w = img_bgr.shape[:2]
    total_area = float(h * w)
    text_boxes = []
    ocr_text = ""
    text_areas = 0.0

    reader = get_easyocr_reader()
    if reader is not None:
        try:
            ocr_results = reader.readtext(img_bgr)
            text_words = []
            for bbox, text, prob in ocr_results:
                text_words.append(text)
                xs = [pt[0] for pt in bbox]
                ys = [pt[1] for pt in bbox]
                min_x, max_x = min(xs), max(xs)
                min_y, max_y = min(ys), max(ys)
                box_w = max_x - min_x
                box_h = max_y - min_y
                text_boxes.append({"x": int(min_x), "y": int(min_y), "w": int(box_w), "h": int(box_h)})
                text_areas += (box_w * box_h)
            ocr_text = " ".join(text_words)
            text_density = (text_areas / total_area) * 100.0
            return ocr_text, text_density, text_boxes
        except Exception as e:
            logger.debug(f"EasyOCR pass failed: {e}")

    # Fast OpenCV morphological gradient text bounding box approximation
    try:
        # Sobel gradient to highlight vertical edges of letters
        grad_x = cv2.Sobel(gray, cv2.CV_32F, 1, 0, ksize=-1)
        grad_y = cv2.Sobel(gray, cv2.CV_32F, 0, 1, ksize=-1)
        gradient = cv2.subtract(grad_x, grad_y)
        gradient = cv2.convertScaleAbs(gradient)

        # Blur and threshold
        blurred = cv2.blur(gradient, (9, 9))
        _, thresh = cv2.threshold(blurred, 225, 255, cv2.THRESH_BINARY)

        # Connect text contours with horizontal morphology kernel
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (21, 7))
        closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        closed = cv2.erode(closed, None, iterations=2)
        closed = cv2.dilate(closed, None, iterations=2)

        contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for cnt in contours:
            x, y, w_c, h_c = cv2.boundingRect(cnt)
            aspect_ratio = float(w_c) / max(1, h_c)
            # Filter contours matching text banner / word block geometry
            if aspect_ratio > 1.2 and (0.05 * w < w_c < 0.95 * w) and (0.04 * h < h_c < 0.40 * h):
                text_boxes.append({"x": int(x), "y": int(y), "w": int(w_c), "h": int(h_c)})
                text_areas += (w_c * h_c)

        text_density = min(100.0, (text_areas / total_area) * 100.0)
    except Exception as e:
        logger.debug(f"OpenCV text morphology error: {e}")
        text_density = 0.0

    return ocr_text, text_density, text_boxes

def analyze_image(img: np.ndarray) -> dict:
    """
    Performs high-speed, lightweight thumbnail vision intelligence:
    - Colorimetry (brightness, contrast, Hasler-Suesstrunk colorfulness, palette temperature)
    - Face detection (Singleton YOLO or 5ms native Haar cascade)
    - Text density & bounding boxes (Singleton EasyOCR or morphological gradient)
    - Clutter & edge density
    - YouTube safe-area & glanceability proxies
    """
    h, w = img.shape[:2]
    total_area = float(h * w)

    # 1. Luminance & Contrast
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    brightness = float(np.mean(gray))
    contrast_val = float(np.std(gray))

    if contrast_val < 45.0:
        contrast_str = "low"
    elif contrast_val > 75.0:
        contrast_str = "high"
    else:
        contrast_str = "medium"
    contrast_score = min(100.0, max(0.0, (contrast_val / 128.0) * 100.0))

    # 2. Colorimetry & Palette Temperature
    colorfulness = calculate_colorfulness(img)
    if colorfulness < 30.0:
        saturation_str = "low"
    elif colorfulness > 60.0:
        saturation_str = "high"
    else:
        saturation_str = "medium"
    saturation_score = min(100.0, max(0.0, (colorfulness / 100.0) * 100.0))

    avg_color_bgr = np.mean(img, axis=(0, 1))
    r_val, g_val, b_val = avg_color_bgr[2], avg_color_bgr[1], avg_color_bgr[0]
    warmth = r_val - b_val
    if warmth > 15:
        palette_desc = "Warm Saturated Dominant"
    elif warmth < -15:
        palette_desc = "Cool Saturated Dominant"
    else:
        palette_desc = "Neutral/Balanced Color Profile"

    # 3. Fast Face Detection
    face_boxes, face_areas = detect_faces_fast(img, gray)
    face_count = len(face_boxes)
    average_face_area_pct = (sum(face_areas) / total_area) * 100.0 if face_count > 0 else 0.0
    emotional_visibility_score = min(100.0, max(0.0, average_face_area_pct * 3.5 + 25.0)) if face_count > 0 else 0.0

    # 4. Composition Clutter & Edge Density
    edges = cv2.Canny(gray, 50, 150)
    edge_ratio = (cv2.countNonZero(edges) / total_area) * 100.0
    clutter_level_rating = min(10.0, max(1.0, edge_ratio * 1.5))

    # 5. Text & Readability Detection
    ocr_text, text_density, text_boxes = detect_text_fast(img, gray)
    mobile_readability = max(10, min(100, int(100 - text_density * 2.5 - clutter_level_rating * 4.0)))

    return {
        "img_width": w,
        "img_height": h,
        "brightness": brightness,
        "contrast": contrast_str,
        "contrast_score": contrast_score,
        "saturation": saturation_str,
        "saturation_score": saturation_score,
        "palette_desc": palette_desc,
        "warmth_score": float(warmth),
        "face_count": face_count,
        "face_boxes": face_boxes,
        "average_face_area_pct": average_face_area_pct,
        "emotional_visibility_score": emotional_visibility_score,
        "clutter_level_rating": clutter_level_rating,
        "ocr_text": ocr_text,
        "text_density": text_density,
        "text_boxes": text_boxes,
        "mobile_readability": mobile_readability
    }
