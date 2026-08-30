"""
backend/core/rate_limit.py

Rate limiting module backed by Redis with thread-safe in-memory fallback.
Mitigates credential stuffing, brute-force attacks, and abusive scraping.
"""

import time
import logging
from typing import Optional, Dict, Tuple
from collections import defaultdict
import threading

logger = logging.getLogger(__name__)

# Thread-safe in-memory fallback store
_memory_store: Dict[str, list] = defaultdict(list)
_lock = threading.Lock()


class RateLimiter:
    def __init__(self, redis_client=None):
        self.redis = redis_client

    def is_allowed(
        self,
        key: str,
        limit: int,
        window_seconds: int
    ) -> Tuple[bool, int]:
        """
        Checks whether an operation identified by `key` is within `limit` over `window_seconds`.
        Returns (is_allowed: bool, remaining_attempts: int).
        """
        now = time.time()

        if self.redis:
            try:
                # Redis sliding window using sorted sets
                pipe = self.redis.pipeline()
                redis_key = f"ratelimit:{key}"
                clear_before = now - window_seconds
                pipe.zremrangebyscore(redis_key, 0, clear_before)
                pipe.zcard(redis_key)
                pipe.zadd(redis_key, {str(now): now})
                pipe.expire(redis_key, window_seconds + 1)
                results = pipe.execute()
                current_count = results[1]
                if current_count >= limit:
                    return False, 0
                return True, max(0, limit - current_count - 1)
            except Exception as e:
                logger.warning(f"Redis rate limiter failed, falling back to memory: {e}")

        # In-memory sliding window fallback
        with _lock:
            timestamps = _memory_store[key]
            # Prune expired timestamps
            cutoff = now - window_seconds
            _memory_store[key] = [t for t in timestamps if t > cutoff]
            if len(_memory_store[key]) >= limit:
                return False, 0
            _memory_store[key].append(now)
            return True, max(0, limit - len(_memory_store[key]))

    def check_login_rate_limit(self, ip_address: str) -> bool:
        """Limits login attempts to 5 per 15 minutes per IP address."""
        allowed, _ = self.is_allowed(f"login:{ip_address}", limit=5, window_seconds=900)
        return allowed

    def check_register_rate_limit(self, ip_address: str) -> bool:
        """Limits account creation to 3 per hour per IP address."""
        allowed, _ = self.is_allowed(f"register:{ip_address}", limit=3, window_seconds=3600)
        return allowed


rate_limiter = RateLimiter()
