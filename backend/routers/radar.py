"""
backend/routers/radar.py

FastAPI router for Creator Radar:
- /radar/config
- /radar/summary
- /radar/topics
- /radar/topics/{slug}
"""

from typing import Optional
from fastapi import APIRouter, Query, HTTPException, status

from core.radar_config import (
    SUPPORTED_REGIONS,
    SUPPORTED_CATEGORIES,
    CLASSIFICATIONS,
    RADAR_MODEL_VERSION
)
from services.radar.schemas import (
    RadarSummary,
    RadarFeedResponse,
    RadarTopicItem
)
from services.radar.service import radar_service

router = APIRouter(prefix="/radar", tags=["Creator Radar"])


@router.get("/config")
async def get_radar_config():
    """Returns configuration-driven metadata for regions, categories, and model version."""
    return {
        "regions": SUPPORTED_REGIONS,
        "categories": SUPPORTED_CATEGORIES,
        "classifications": CLASSIFICATIONS,
        "model_version": RADAR_MODEL_VERSION
    }


@router.get("/summary", response_model=RadarSummary)
async def get_radar_summary(region: str = Query("IN", description="ISO country code or GLOBAL")):
    """Returns aggregate market intelligence summary for the selected region."""
    return radar_service.get_summary(region=region)


@router.get("/topics", response_model=RadarFeedResponse)
async def get_radar_topics(
    region: str = Query("IN", description="ISO country code or GLOBAL"),
    category: str = Query("All", description="Topic category filter"),
    classification: str = Query("ALL", description="Classification filter (BREAKING, RISING, etc.)"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    cursor: Optional[str] = Query(None, description="Cursor offset for pagination")
):
    """Returns structured topic feed matching criteria."""
    return radar_service.get_topics(
        region=region,
        category=category,
        classification=classification,
        limit=limit,
        cursor=cursor
    )


@router.get("/topics/{slug}", response_model=RadarTopicItem)
async def get_radar_topic_detail(
    slug: str,
    region: str = Query("IN", description="ISO country code or GLOBAL")
):
    """Returns deep-dive intelligence for a specific topic slug in the selected region."""
    item = radar_service.get_topic_detail(slug=slug, region=region)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Topic '{slug}' not found in region '{region}'."
        )
    return item
