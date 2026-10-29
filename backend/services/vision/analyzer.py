import io
import logging
from typing import Dict, Any, Optional
import numpy as np
import cv2
from PIL import Image

# Import existing core vision logic
from core.visual_analyzer import analyze_image
from core.archetype_feature_extractor import ArchetypeFeatureExtractor
from services.outlier.similarity import ThumbnailSimilarityChecker

logger = logging.getLogger(__name__)


class VisionAnalyzerError(Exception):
    """Exception raised for errors during vision analysis (e.g. bad image)."""
    pass


class VisionAnalyzer:
    """
    Encapsulates all image decoding, Pillow/OpenCV operations,
    and runs format-native archetype CV pipelines + thumbnail originality pHash checks.
    """

    def __init__(self):
        self.similarity_checker = ThumbnailSimilarityChecker()

    def analyze(
        self,
        image_bytes: bytes,
        archetype: Optional[str] = None,
        niche: str = "General"
    ) -> Dict[str, Any]:
        """
        Decodes image bytes and extracts:
        1. Base visual metrics (colorimetry, Haar/YOLO face, text density)
        2. Format-native archetype features via OpenCV
        3. Thumbnail originality & formula saturation analysis via pHash
        """
        if not image_bytes:
            raise VisionAnalyzerError("Empty image file provided.")

        try:
            # Decode using Pillow which supports multiple formats (WebP, PNG, JPEG)
            pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            img = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        except Exception as e:
            # Fallback to OpenCV native decode if Pillow fails
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                raise VisionAnalyzerError(f"Failed to decode image format. Decode error: {str(e)}")

        # 1. Base visual analysis
        base_metrics = analyze_image(img)

        # 2. Format-native Archetype OpenCV Extraction
        arch_data = ArchetypeFeatureExtractor.extract(
            archetype=archetype or "GENERAL_HYBRID",
            img_bgr=img,
            base_features=base_metrics
        )

        # 3. Perceptual Similarity & Originality Check
        originality_data = self.similarity_checker.check_originality(
            image_bytes=image_bytes,
            niche=niche,
            archetype=archetype
        )

        base_metrics["archetype_extracted"] = arch_data
        base_metrics["originality"] = originality_data

        return base_metrics
