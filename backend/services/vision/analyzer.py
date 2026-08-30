import io
from typing import Dict, Any
import numpy as np
import cv2
from PIL import Image

# Import existing core vision logic
from core.visual_analyzer import analyze_image

class VisionAnalyzerError(Exception):
    """Exception raised for errors during vision analysis (e.g. bad image)."""
    pass

class VisionAnalyzer:
    """
    Encapsulates all image decoding, Pillow/OpenCV operations,
    and forwards to the core visual_analyzer.
    """
    
    def analyze(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Decodes image bytes and extracts visual metrics.
        Raises VisionAnalyzerError if the image cannot be decoded.
        """
        if not image_bytes:
            raise VisionAnalyzerError("Empty image file provided.")

        try:
            # Decode using Pillow which supports many more formats (WebP, etc.)
            pil_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            # Convert RGB to BGR for OpenCV
            img = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        except Exception as e:
            # Fallback to OpenCV native decode if Pillow fails
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                raise VisionAnalyzerError(f"Failed to decode image format. Decode error: {str(e)}")

        return analyze_image(img)
