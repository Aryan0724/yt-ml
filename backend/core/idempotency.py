"""
backend/core/idempotency.py

Idempotency protection module.
Prevents duplicate expensive operations, AI inference calls, and accidental double-charges
from mobile retries or duplicate button clicks.
"""

from typing import Optional, Dict, Any
from fastapi import Header, HTTPException, status
from services.cache.redis import cache_service


class IdempotencyManager:
    @staticmethod
    def get_cached_response(idempotency_key: str) -> Optional[Dict[str, Any]]:
        """Returns previously computed response if an idempotency key matches."""
        if not idempotency_key:
            return None
        cache_key = f"idempotency:{idempotency_key}"
        return cache_service.get(cache_key)

    @staticmethod
    def store_response(
        idempotency_key: str,
        response_data: Dict[str, Any],
        expire_seconds: int = 86400
    ) -> None:
        """Stores the response payload under the idempotency key for 24 hours."""
        if not idempotency_key:
            return
        cache_key = f"idempotency:{idempotency_key}"
        cache_service.set(cache_key, response_data, expire_seconds=expire_seconds)


idempotency_manager = IdempotencyManager()
