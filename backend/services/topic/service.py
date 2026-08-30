"""
service.py

High-level Topic Intelligence Service orchestrating:
Normalization -> Cache Lookup -> Live Provider -> Deterministic Analysis -> 24h Cache -> Typed Result
"""
import os
import logging
from typing import Optional, Dict, Any

from services.topic.schemas import TopicResult
from services.topic.provider import (
    TopicDataProvider,
    DataForSEOProvider,
    ProviderNotConfiguredError,
    ProviderTimeoutError,
    ProviderAPIError
)
from services.topic.analyzer import TopicAnalyzer
from services.topic.normalizer import extract_core_topic, normalize_topic_for_cache
from services.topic.cache import TopicCache, MemoryTTLCache

logger = logging.getLogger(__name__)


class TopicService:
    """
    Orchestrates Topic Intelligence requests with caching, provider querying,
    and deterministic metrics computation.
    """

    def __init__(
        self,
        provider: Optional[TopicDataProvider] = None,
        cache: Optional[TopicCache] = None,
        analyzer: Optional[TopicAnalyzer] = None
    ):
        self.provider = provider or DataForSEOProvider()
        self.cache = cache or MemoryTTLCache(default_ttl_seconds=86400)
        self.analyzer = analyzer or TopicAnalyzer()
        self.default_region = os.environ.get("DEFAULT_TOPIC_REGION", "IN")

    def get_topic_intelligence(
        self,
        raw_topic: str,
        region: Optional[str] = None,
        period: str = "12m"
    ) -> TopicResult:
        """
        Retrieves real trend intelligence for a topic string or video title.
        """
        effective_region = (region or self.default_region).upper()
        normalized_topic = extract_core_topic(raw_topic)

        if not normalized_topic:
            return TopicResult(
                status="unavailable",
                reason="empty_topic",
                topic="",
                raw_topic=raw_topic,
                region=effective_region,
                time_range=period,
                time_series=[],
                metrics=None
            )

        # 1. Check 24-hour cache
        cache_key = normalize_topic_for_cache(normalized_topic, effective_region, period)
        cached_dict = self.cache.get(cache_key)
        if cached_dict:
            try:
                cached_result = TopicResult.model_validate(cached_dict)
                cached_result.cached = True
                return cached_result
            except Exception as e:
                logger.warning(f"Failed to parse cached topic result for {cache_key}: {e}")

        # 2. Query Live Provider
        try:
            raw_data = self.provider.get_topic_data(
                keyword=normalized_topic,
                region=effective_region,
                period=period
            )
        except ProviderNotConfiguredError as e:
            logger.info(f"Topic provider not configured: {e}")
            return TopicResult(
                status="unavailable",
                reason="provider_not_configured",
                data_source=self.provider.provider_name,
                topic=normalized_topic,
                raw_topic=raw_topic,
                region=effective_region,
                time_range=period,
                time_series=[],
                metrics=None
            )
        except ProviderTimeoutError as e:
            logger.error(f"Topic provider timeout for {normalized_topic}: {e}")
            return TopicResult(
                status="unavailable",
                reason="provider_timeout",
                data_source=self.provider.provider_name,
                topic=normalized_topic,
                raw_topic=raw_topic,
                region=effective_region,
                time_range=period,
                time_series=[],
                metrics=None
            )
        except ProviderAPIError as e:
            logger.error(f"Topic provider API error for {normalized_topic}: {e}")
            return TopicResult(
                status="error",
                reason="provider_api_error",
                data_source=self.provider.provider_name,
                topic=normalized_topic,
                raw_topic=raw_topic,
                region=effective_region,
                time_range=period,
                time_series=[],
                metrics=None
            )
        except Exception as e:
            logger.error(f"Unexpected error fetching topic data for {normalized_topic}: {e}")
            return TopicResult(
                status="error",
                reason="unknown_error",
                data_source=self.provider.provider_name,
                topic=normalized_topic,
                raw_topic=raw_topic,
                region=effective_region,
                time_range=period,
                time_series=[],
                metrics=None
            )

        # 3. Analyze time-series
        data_points = raw_data.get("data_points", [])
        if not data_points:
            return TopicResult(
                status="unavailable",
                reason="insufficient_data",
                data_source=self.provider.provider_name,
                topic=normalized_topic,
                raw_topic=raw_topic,
                region=effective_region,
                time_range=period,
                time_series=[],
                metrics=None
            )

        points, metrics = self.analyzer.analyze(data_points)

        result = TopicResult(
            status="success",
            data_source=self.provider.provider_name,
            topic=normalized_topic,
            raw_topic=raw_topic,
            region=effective_region,
            time_range=period,
            time_series=points,
            metrics=metrics,
            cached=False,
            metadata=raw_data.get("metadata", {})
        )

        # 4. Cache successful result (24h)
        try:
            self.cache.set(cache_key, result.model_dump(), ttl_seconds=86400)
        except Exception as e:
            logger.warning(f"Failed to cache topic result for {cache_key}: {e}")

        return result
