import os
import logging
from typing import Optional, Dict, Any
from supabase import create_client, Client
from pydantic import BaseModel
from datetime import datetime

logger = logging.getLogger(__name__)

class SupabaseRepository:
    """
    Handles persisting analysis lifecycle events into Supabase Telemetry tables.
    """
    def __init__(self):
        url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
        key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        
        self.client: Optional[Client] = None
        
        if not url or not key:
            logger.warning("Supabase URL or Service Role Key is missing. Operating in in-memory Mock mode for Telemetry.")
        else:
            try:
                self.client = create_client(url, key)
                logger.info("Supabase Telemetry Repository initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {str(e)}")

    def save_analysis(self, payload: Dict[str, Any]) -> bool:
        """
        Save the entire analysis lifecycle including core engine results and AI metadata.
        payload represents the unified data we want to persist into the `analyses` table.
        """
        if not self.client:
            logger.debug(f"Mock Save Analysis: {payload.get('analysis_id')}")
            return True

        try:
            # We are inserting into the `analyses` table defined in Phase 3
            # Ensure payload keys match exactly with the SQL schema
            response = self.client.table("analyses").insert(payload).execute()
            return len(response.data) > 0
        except Exception as e:
            logger.error(f"Error saving analysis telemetry: {str(e)}")
            return False

    def save_ai_request(self, payload: Dict[str, Any]) -> Optional[str]:
        """
        Save the generative AI request telemetry into `ai_requests`.
        Returns the generated ID of the ai_request.
        """
        if not self.client:
            logger.debug(f"Mock Save AI Request for analysis: {payload.get('analysis_id')}")
            return "mock-ai-request-id"

        try:
            response = self.client.table("ai_requests").insert(payload).execute()
            if response.data and len(response.data) > 0:
                return response.data[0].get("id")
            return None
        except Exception as e:
            logger.error(f"Error saving ai_requests telemetry: {str(e)}")
            return None

    def save_ai_error(self, payload: Dict[str, Any]) -> bool:
        """
        Save deep debugging trace into `ai_errors`.
        """
        if not self.client:
            logger.debug(f"Mock Save AI Error: {payload.get('error_type')}")
            return True

        try:
            response = self.client.table("ai_errors").insert(payload).execute()
            return len(response.data) > 0
        except Exception as e:
            logger.error(f"Error saving ai_errors telemetry: {str(e)}")
            return False
