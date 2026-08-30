import time
import os
from fastapi import APIRouter, HTTPException

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
    In production, if Supabase is missing, fail loudly.
    """
    env = os.environ.get("ENVIRONMENT", "development").lower()
    if env == "production":
        supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        if not supabase_url or not supabase_key:
            raise HTTPException(status_code=503, detail="Service Unavailable: Missing required production Supabase credentials.")
            
    return {
        "status": "ready",
        "engine": "V4.0-DEEP-LOGIC-AMPLIFIED",
        "timestamp": time.time()
    }
