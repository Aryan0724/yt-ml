import numpy as np
import cv2
import os

def analyze_image(img: np.ndarray) -> dict:
    """
    Performs real OpenCV and EasyOCR image analysis on an uploaded thumbnail.
    """
    h, w, c = img.shape
    total_area = h * w
    
    # 1. Grayscale conversion for brightness, contrast, edges
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Brightness (average pixel intensity)
    brightness = float(np.mean(gray))
    
    # Contrast (standard deviation of luminance)
    contrast_val = float(np.std(gray))
    if contrast_val < 45.0:
        contrast_str = "low"
    elif contrast_val > 75.0:
        contrast_str = "high"
    else:
        contrast_str = "medium"
    contrast_score = min(100.0, max(0.0, (contrast_val / 128.0) * 100.0))
        
    # Saturation (HSV mean)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    saturation_val = float(np.mean(hsv[:, :, 1]))
    if saturation_val < 60.0:
        saturation_str = "low"
    elif saturation_val > 150.0:
        saturation_str = "high"
    else:
        saturation_str = "medium"
    saturation_score = min(100.0, max(0.0, (saturation_val / 255.0) * 100.0))
    
    # Color palette description
    avg_color_bgr = np.mean(img, axis=(0, 1))
    r_val, g_val, b_val = avg_color_bgr[2], avg_color_bgr[1], avg_color_bgr[0]
    warmth = r_val - b_val
    if warmth > 15:
        palette_desc = "Warm Saturated Dominant"
    elif warmth < -15:
        palette_desc = "Cool Saturated Dominant"
    else:
        palette_desc = "Neutral/Balanced Color Profile"
        
    # Face detection using Haar Cascade
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(cascade_path)
    faces = []
    if not face_cascade.empty():
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(30, 30))
    
    face_count = len(faces)
    face_boxes = []
    face_areas = []
    for (x, y, w_box, h_box) in faces:
        face_boxes.append({"x": int(x), "y": int(y), "w": int(w_box), "h": int(h_box)})
        face_areas.append(w_box * h_box)
        
    average_face_area_pct = (sum(face_areas) / total_area) * 100.0 if face_count > 0 else 0.0
    emotional_visibility_score = min(100.0, max(0.0, average_face_area_pct * 3.5 + 25.0)) if face_count > 0 else 0.0
    
    # Clutter / Contour analysis
    edges = cv2.Canny(gray, 50, 150)
    edge_ratio = (cv2.countNonZero(edges) / total_area) * 100.0
    clutter_level_rating = min(10.0, max(1.0, edge_ratio * 1.5))
    
    # Text density via EasyOCR and/or MSER/Contour fallback
    ocr_text = ""
    text_density = 0.0
    
    try:
        # Load reader dynamically to avoid blocking startup if network fails
        import easyocr
        reader = easyocr.Reader(['en'], gpu=False, verbose=False)
        ocr_results = reader.readtext(img)
        text_areas = 0
        text_words = []
        for bbox, text, prob in ocr_results:
            text_words.append(text)
            xs = [pt[0] for pt in bbox]
            ys = [pt[1] for pt in bbox]
            min_x, max_x = min(xs), max(xs)
            min_y, max_y = min(ys), max(ys)
            text_areas += (max_x - min_x) * (max_y - min_y)
        ocr_text = " ".join(text_words)
        text_density = (text_areas / total_area) * 100.0
    except Exception as e:
        # Fallback to contour detection for high-contrast small bounding boxes (typical for text)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        text_area_approx = 0
        for cnt in contours:
            x, y, w_c, h_c = cv2.boundingRect(cnt)
            # Text boxes are typically small and wide or square
            if 5 < w_c < w * 0.4 and 5 < h_c < h * 0.15:
                text_area_approx += w_c * h_c
        text_density = (text_area_approx / total_area) * 100.0
        
    mobile_readability = max(10, min(100, int(100 - text_density * 2.5 - clutter_level_rating * 4.0)))
    
    return {
        "brightness": brightness,
        "contrast": contrast_str,
        "contrast_score": contrast_score,
        "saturation": saturation_str,
        "saturation_score": saturation_score,
        "palette_desc": palette_desc,
        "face_count": face_count,
        "face_boxes": face_boxes,
        "average_face_area_pct": average_face_area_pct,
        "emotional_visibility_score": emotional_visibility_score,
        "clutter_level_rating": clutter_level_rating,
        "ocr_text": ocr_text,
        "text_density": text_density,
        "mobile_readability": mobile_readability
    }
