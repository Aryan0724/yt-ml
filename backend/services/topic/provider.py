"""
provider.py

Topic data provider interface and implementations.
Integrates live Google Trends data from DataForSEO.

PRODUCT RULE:
  No fake or randomized trend curves in production.
  If credentials are missing or API fails, returns explicit status
  and reason ('provider_not_configured' / 'provider_timeout').
"""
import os
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import httpx
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type

logger = logging.getLogger(__name__)


class TopicProviderError(Exception):
    """Base exception for topic provider failures."""
    pass


class ProviderNotConfiguredError(TopicProviderError):
    """Raised when provider credentials (DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD) are absent."""
    pass


class ProviderTimeoutError(TopicProviderError):
    """Raised when provider network request exceeds timeout."""
    pass


class ProviderAPIError(TopicProviderError):
    """Raised when provider returns HTTP error or bad payload."""
    pass


class TopicDataProvider(ABC):
    """Abstract base class for topic trend data providers."""

    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @abstractmethod
    def get_topic_data(self, keyword: str, region: str = "IN", period: str = "past_12_months") -> Dict[str, Any]:
        """
        Fetches raw trend time-series for a keyword and region.
        Returns dict with:
          {
            "data_points": [{"date": "...", "value": 85}, ...],
            "metadata": {...}
          }
        """
        pass


class DataForSEOProvider(TopicDataProvider):
    """
    Live DataForSEO Google Trends (YouTube search) provider.
    """

    def __init__(self):
        self.login = os.environ.get("DATAFORSEO_LOGIN")
        self.password = os.environ.get("DATAFORSEO_PASSWORD")
        self.timeout = float(os.environ.get("DATAFORSEO_TIMEOUT", "15.0"))
        self.base_url = "https://api.dataforseo.com/v3"

    @property
    def provider_name(self) -> str:
        return "dataforseo_google_trends"

    def is_configured(self) -> bool:
        return bool(self.login and self.password)

    @retry(
        wait=wait_exponential(multiplier=1, min=2, max=8),
        stop=stop_after_attempt(2),
        retry=retry_if_exception_type((httpx.RequestError, ProviderTimeoutError)),
        reraise=True
    )
    def _fetch_from_api(self, keyword: str, region: str, period: str) -> Dict[str, Any]:
        if not self.is_configured():
            raise ProviderNotConfiguredError(
                "DataForSEO credentials (DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD) are not configured."
            )

        # Normalize region code to country name if needed
        # DataForSEO keywords_data/google_trends supports location_code or location_name
        region_map = {
            "IN": "India",
            "US": "United States",
            "GB": "United Kingdom",
            "CA": "Canada",
            "AU": "Australia",
            "GLOBAL": ""
        }
        location_name = region_map.get(region.upper(), region)

        # Time range mapping
        time_range = "past_12_months"
        if period in ["30d", "1m"]:
            time_range = "past_month"
        elif period in ["3m", "90d"]:
            time_range = "past_3_months"
        elif period in ["5y"]:
            time_range = "past_5_years"

        payload = [{
            "keywords": [keyword],
            "type": "youtube",  # Specifically YouTube search trends
            "time_range": time_range
        }]
        if location_name:
            payload[0]["location_name"] = location_name

        try:
            with httpx.Client(auth=(self.login, self.password), timeout=self.timeout) as client:
                response = client.post(
                    f"{self.base_url}/keywords_data/google_trends/explore/live",
                    json=payload
                )

                if response.status_code == 408 or response.status_code == 504:
                    raise ProviderTimeoutError(f"DataForSEO request timed out ({response.status_code})")

                if response.status_code != 200:
                    logger.error(f"DataForSEO error {response.status_code}: {response.text}")
                    raise ProviderAPIError(f"DataForSEO API error: HTTP {response.status_code}")

                data = response.json()
                if "tasks" not in data or not data["tasks"] or "result" not in data["tasks"][0] or not data["tasks"][0]["result"]:
                    # Check task status message
                    status_msg = data.get("status_message", "No tasks returned")
                    logger.warning(f"DataForSEO empty tasks: {status_msg}")
                    return {"data_points": [], "metadata": {"status_message": status_msg}}

                result = data["tasks"][0]["result"][0]
                if "items" not in result or not result["items"]:
                    return {"data_points": [], "metadata": {"items_count": 0}}

                items = result["items"]
                if len(items) > 0 and "data" in items[0]:
                    timeline = items[0]["data"]
                    data_points = []
                    for point in timeline:
                        if "values" in point and len(point["values"]) > 0:
                            val = point["values"][0] if point["values"][0] is not None else 0
                            data_points.append({
                                "date": point.get("date", ""),
                                "value": int(val)
                            })
                    return {
                        "data_points": data_points,
                        "metadata": {
                            "location_name": location_name,
                            "type": "youtube",
                            "time_range": time_range
                        }
                    }

                return {"data_points": [], "metadata": {"items_count": len(items)}}

        except httpx.TimeoutException as e:
            raise ProviderTimeoutError(f"DataForSEO request timed out after {self.timeout}s: {e}")
        except httpx.RequestError as e:
            raise ProviderAPIError(f"Network error connecting to DataForSEO: {e}")

    def get_topic_data(self, keyword: str, region: str = "IN", period: str = "past_12_months") -> Dict[str, Any]:
        return self._fetch_from_api(keyword, region, period)


class MockTopicDataProvider(TopicDataProvider):
    """
    Mock provider strictly for isolated unit testing.
    Never activated or selected in production environments.
    """

    def __init__(self, data_points: Optional[List[Dict[str, Any]]] = None):
        self._data_points = data_points

    @property
    def provider_name(self) -> str:
        return "mock_unit_test_provider"

    def get_topic_data(self, keyword: str, region: str = "IN", period: str = "past_12_months") -> Dict[str, Any]:
        if self._data_points is not None:
            return {"data_points": self._data_points, "metadata": {"is_mock": True}}

        # Default predictable deterministic curve for testing (rising trend)
        points = []
        for i in range(52):
            val = 20 + int(i * 1.2)
            points.append({
                "date": f"2025-W{i+1:02d}",
                "value": min(100, val)
            })
        return {"data_points": points, "metadata": {"is_mock": True}}
