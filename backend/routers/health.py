import time
import os
import logging
from fastapi import APIRouter, HTTPException

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Liveness probe: confirms the FastAPI process is alive.
    """
    return {
        "status": "alive",
        "timestamp": time.time()
    }

@router.get("/ready")
async def readiness_check():
    """
    Readiness probe: confirms the application is capable of serving traffic.
    """
    # Basic dependency checks
    db_ok = False
    try:
        from db.session import engine
        from sqlalchemy import text
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
            db_ok = True
    except Exception as e:
        logger.error(f"Database health check failed: {e}")

    redis_ok = False
    try:
        from core.cache import redis_client
        if redis_client:
            redis_ok = await redis_client.ping()
    except Exception as e:
        logger.error(f"Redis health check failed: {e}")

    return {
        "status": "healthy" if db_ok else "degraded",
        "version": "6.0.0",
        "dependencies": {
            "database": "up" if db_ok else "down",
            "redis": "up" if redis_ok else "in-memory-fallback"
        }
    }
