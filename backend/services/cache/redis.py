"""
backend/services/cache/redis.py

Redis client wrapper with graceful in-memory degradation.
Guarantees the application remains functional even during temporary Redis outages.
"""

import json
import logging
import time
from typing import Optional, Any
import redis
from core.config import settings

logger = logging.getLogger(__name__)


class RedisService:
    def __init__(self, redis_url: Optional[str] = None):
        self.url = redis_url or settings.REDIS_URL
        self.client: Optional[redis.Redis] = None
        self._memory_cache: dict = {}
        self._memory_expires: dict = {}

        try:
            self.client = redis.from_url(
                self.url,
                decode_responses=True,
                socket_connect_timeout=2.0
            )
            # Test connection
            self.client.ping()
            logger.info("Connected to Redis server successfully.")
        except Exception as e:
            logger.warning(f"Could not connect to Redis at {self.url}: {e}. Operating in graceful in-memory mode.")
            self.client = None

    def get(self, key: str) -> Optional[Any]:
        """Retrieves a cached value by key."""
        if self.client:
            try:
                val = self.client.get(key)
                if val:
                    return json.loads(val)
                return None
            except Exception as e:
                logger.warning(f"Redis get failed: {e}. Falling back to memory.")

        # In-memory fallback
        now = time.time()
        if key in self._memory_cache:
            exp = self._memory_expires.get(key)
            if exp and exp < now:
                del self._memory_cache[key]
                del self._memory_expires[key]
                return None
            return self._memory_cache[key]
        return None

    def set(self, key: str, value: Any, expire_seconds: int = 86400) -> bool:
        """Caches a value with expiration (default: 24h)."""
        serialized = json.dumps(value)

        if self.client:
            try:
                return bool(self.client.set(key, serialized, ex=expire_seconds))
            except Exception as e:
                logger.warning(f"Redis set failed: {e}. Falling back to memory.")

        # In-memory fallback
        self._memory_cache[key] = value
        self._memory_expires[key] = time.time() + expire_seconds
        return True

    def delete(self, key: str) -> bool:
        """Deletes a key from cache."""
        if self.client:
            try:
                return bool(self.client.delete(key))
            except Exception:
                pass
        self._memory_cache.pop(key, None)
        self._memory_expires.pop(key, None)
        return True


cache_service = RedisService()
