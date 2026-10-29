"""
backend/routers/outlier.py

Outlier Intelligence & Thumbnail Similarity Endpoints:
  - GET  /outlier/niche?niche=cooking&limit=10  → Niche outlier scan
  - POST /outlier/similarity                    → Thumbnail originality check vs niche
"""
import traceback
import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Query, Form

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/outlier", tags=["Outlier Intelligence"])


@router.get("/niche")
async def get_niche_outliers(
    niche: str = Query(..., description="Niche keyword e.g. 'cooking', 'finance', 'gaming'"),
    limit: int = Query(10, ge=3, le=25, description="Max outlier results to return"),
    min_ratio: float = Query(3.0, ge=1.5, le=10.0, description="Minimum outlier ratio threshold")
):
    """
    Scans YouTube for outlier videos in a niche (videos dramatically outperforming their channel average).
    Returns top outliers sorted by outlier_ratio and extracts niche packaging patterns.
    """
    try:
        from services.outlier.detector import OutlierDetector
        detector = OutlierDetector()
        result = await detector.scan_niche(niche=niche, limit=limit, min_outlier_ratio=min_ratio)
        return {"status": "success", "data": result}
    except Exception as e:
        traceback.print_exc()
        logger.error(f"Outlier scan error: {e}")
        raise HTTPException(status_code=500, detail=f"Outlier scan failed: {str(e)}")


@router.post("/similarity")
async def check_thumbnail_similarity(
    niche: str = Form(..., description="Niche category for comparison set"),
    archetype: Optional[str] = Form(None, description="PackagingArchetype enum value"),
    thumbnail: UploadFile = File(..., description="Thumbnail image to check for originality")
):
    """
    Computes thumbnail originality score against top-performing thumbnails in the niche.
    Uses perceptual hashing (pHash via DCT) to detect visual similarity/formula reuse.
    Returns: originality_score, similarity_risk, detected_formula, recommendations.
    """
    try:
        image_bytes = await thumbnail.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty image file.")

        from services.outlier.similarity import ThumbnailSimilarityChecker
        checker = ThumbnailSimilarityChecker()
        result = checker.check_originality(image_bytes=image_bytes, niche=niche, archetype=archetype)
        return {"status": "success", "data": result}
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        logger.error(f"Similarity check error: {e}")
        raise HTTPException(status_code=500, detail=f"Similarity check failed: {str(e)}")
