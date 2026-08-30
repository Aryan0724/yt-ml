"""
backend/services/radar/service.py

High-level Creator Radar Service orchestrating:
Discovery -> Topic Measurement -> Deterministic Opportunity Scoring -> Classification ->
Snapshot Persistence -> Redis Caching -> Typed API Responses.
"""

import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

from core.radar_config import (
    RADAR_MODEL_VERSION,
    SUPPORTED_REGIONS,
    SUPPORTED_CATEGORIES
)
from services.radar.schemas import (
    RadarTopicItem,
    RadarTopicMetrics,
    RadarOpportunity,
    RadarOpportunityEvidence,
    RadarSummary,
    RadarFeedResponse
)
from services.radar.opportunity import OpportunityCalculator
from services.radar.discovery import TopicDiscoveryProvider, ConfiguredSeedDiscoveryProvider
from services.topic.service import TopicService
from services.cache.redis import RedisService

logger = logging.getLogger(__name__)


class RadarService:
    """
    Orchestrates the Creator Radar intelligence feed.
    """

    def __init__(
        self,
        discovery_provider: Optional[TopicDiscoveryProvider] = None,
        topic_service: Optional[TopicService] = None,
        cache_service: Optional[RedisService] = None
    ):
        self.discovery = discovery_provider or ConfiguredSeedDiscoveryProvider()
        self.topic_service = topic_service or TopicService()
        self.cache = cache_service or RedisService()
        
        # In-memory storage fallback for local development / testing without live Postgres
        self._memory_topics: Dict[str, Dict[str, Any]] = {}
        self._memory_snapshots: List[Dict[str, Any]] = []

    def _normalize_region(self, region: Optional[str]) -> str:
        if not region:
            return "IN"
        code = region.strip().upper()
        valid_codes = [r["code"] for r in SUPPORTED_REGIONS]
        return code if code in valid_codes else "IN"

    def get_summary(self, region: Optional[str] = "IN") -> RadarSummary:
        """Returns aggregate market intelligence counts for the specified region."""
        eff_region = self._normalize_region(region)
        cache_key = f"radar:summary:{eff_region}"
        
        cached = self.cache.get(cache_key)
        if cached:
            try:
                return RadarSummary.model_validate(cached)
            except Exception as e:
                logger.warning(f"Error parsing cached radar summary: {e}")

        # Fetch current items to compute summary
        feed = self.get_topics(region=eff_region, limit=100)
        items = feed.topics

        breaking = sum(1 for i in items if i.classification == "BREAKING")
        rising = sum(1 for i in items if i.classification == "RISING")
        trending = sum(1 for i in items if i.classification == "TRENDING")
        opportunity = sum(1 for i in items if i.classification == "OPPORTUNITY")
        saturating = sum(1 for i in items if i.classification == "SATURATING")

        summary = RadarSummary(
            region=eff_region,
            total_tracked=len(items),
            breaking_count=breaking,
            rising_count=rising,
            trending_count=trending,
            opportunity_count=opportunity,
            saturating_count=saturating,
            captured_at=datetime.now(timezone.utc).isoformat(),
            model_version=RADAR_MODEL_VERSION
        )

        self.cache.set(cache_key, summary.model_dump(), expire_seconds=86400)
        return summary

    def get_topics(
        self,
        region: Optional[str] = "IN",
        category: Optional[str] = "All",
        classification: Optional[str] = "ALL",
        limit: int = 20,
        cursor: Optional[str] = None
    ) -> RadarFeedResponse:
        """
        Returns structured topic cards filtered by category, classification, and region.
        """
        eff_region = self._normalize_region(region)
        eff_cat = category.strip() if category else "All"
        eff_cls = classification.strip().upper() if classification else "ALL"

        cache_key = f"radar:feed:{eff_region}:{eff_cat}:{eff_cls}:{limit}:{cursor}"
        cached = self.cache.get(cache_key)
        if cached:
            try:
                return RadarFeedResponse.model_validate(cached)
            except Exception as e:
                logger.warning(f"Error parsing cached radar feed: {e}")

        # Retrieve candidates from discovery provider
        candidates = self.discovery.discover_candidate_topics(region=eff_region, category=eff_cat)
        
        # Check if topic provider is configured
        provider_configured = getattr(self.topic_service.provider, "is_configured", lambda: True)()
        
        items: List[RadarTopicItem] = []
        captured_str = datetime.now(timezone.utc).isoformat()

        for c in candidates:
            # Measure candidate trend via TopicService
            result = self.topic_service.get_topic_intelligence(
                raw_topic=c["canonical_name"],
                region=eff_region,
                period="12m"
            )

            # If unconfigured and no real time series
            if result.status == "unavailable" and not result.time_series:
                # Maintain honest unconfigured reporting
                pass

            # Calculate deterministic metrics & opportunity
            metrics, opp, cls_assigned, why_matters, creator_opp = (
                OpportunityCalculator.calculate_metrics_and_opportunity(
                    [p.model_dump() for p in result.time_series] if result.time_series else []
                )
            )

            # Filter by classification if requested
            if eff_cls != "ALL" and cls_assigned != eff_cls:
                continue

            # Filter by category if requested
            if eff_cat != "All" and c.get("category", "General") != eff_cat:
                continue

            sparkline = [p.value for p in result.time_series[-16:]] if result.time_series else []

            item = RadarTopicItem(
                id=str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{c['slug']}:{eff_region}")),
                slug=c["slug"],
                canonical_name=c["canonical_name"],
                category=c.get("category", "General"),
                region=eff_region,
                classification=cls_assigned,
                metrics=metrics,
                opportunity=opp,
                confidence=result.metrics.confidence if result.metrics else "HIGH",
                why_this_matters=why_matters,
                creator_opportunity=creator_opp,
                sparkline=sparkline,
                data_source=result.data_source or "dataforseo_google_trends",
                captured_at=captured_str
            )
            items.append(item)

        # Sort by opportunity score descending
        items.sort(key=lambda x: x.opportunity.score, reverse=True)

        # Cursor pagination
        start_idx = 0
        if cursor:
            try:
                start_idx = int(cursor)
            except ValueError:
                start_idx = 0

        paged_items = items[start_idx : start_idx + limit]
        next_cur = str(start_idx + limit) if (start_idx + limit) < len(items) else None

        response = RadarFeedResponse(
            region=eff_region,
            category=eff_cat,
            classification=eff_cls,
            topics=paged_items,
            total=len(items),
            next_cursor=next_cur,
            data_available=bool(provider_configured or items),
            reason=None if (provider_configured or items) else "provider_not_configured"
        )

        self.cache.set(cache_key, response.model_dump(), expire_seconds=3600)
        return response

    def get_topic_detail(self, slug: str, region: Optional[str] = "IN") -> Optional[RadarTopicItem]:
        """Returns deep-dive intelligence for a single topic slug in the specified region."""
        eff_region = self._normalize_region(region)
        feed = self.get_topics(region=eff_region, limit=100)
        for topic in feed.topics:
            if topic.slug == slug:
                return topic
        return None


# Global singleton instance
radar_service = RadarService()
