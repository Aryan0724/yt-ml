"""
cache.py

Thread-safe caching layer for Topic Intelligence.
Provides in-memory TTL caching (24h default) with easy extensibility to Redis.
"""
import time
import logging
import threading
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)


class TopicCache(ABC):
    """Abstract interface for Topic Intelligence caching."""

    @abstractmethod
    def get(self, key: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def set(self, key: str, value: Dict[str, Any], ttl_seconds: int = 86400) -> None:
        pass


class MemoryTTLCache(TopicCache):
    """
    Thread-safe in-memory cache with configurable TTL (default 24 hours).
    Suitable for single-process instances and local development.
    """

    def __init__(self, default_ttl_seconds: int = 86400):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._lock = threading.Lock()
        self._default_ttl = default_ttl_seconds

    def get(self, key: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            entry = self._cache.get(key)
            if not entry:
                return None

            if time.time() < entry["expires_at"]:
                logger.info(f"TopicCache HIT: {key}")
                return entry["data"]
            else:
                logger.info(f"TopicCache EXPIRED: {key}")
                del self._cache[key]
                return None

    def set(self, key: str, value: Dict[str, Any], ttl_seconds: Optional[int] = None) -> None:
        ttl = ttl_seconds if ttl_seconds is not None else self._default_ttl
        with self._lock:
            self._cache[key] = {
                "data": value,
                "expires_at": time.time() + ttl,
                "stored_at": time.time()
            }
            logger.info(f"TopicCache SET: {key} (TTL: {ttl}s)")

    def clear(self) -> None:
        with self._lock:
            self._cache.clear()
