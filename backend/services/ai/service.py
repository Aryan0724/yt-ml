import time
import logging
import uuid
from typing import Optional, Dict, Any
from .provider import AIProvider
from .schemas import AIResult, EnhancementResult
from .retry import ai_retry_decorator

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self, provider: AIProvider):
        self.provider = provider
        # Assuming we track prompt versions for observability
        self.prompt_version = "enhancement_v2.0"

    def enhance_analysis(self, analysis_id: str, prompt: str) -> AIResult:
        """
        Executes an AI enhancement with tracking, retries, and graceful fallback.
        """
        start_time = time.time()
        
        @ai_retry_decorator
        def _call_provider() -> EnhancementResult:
            return self.provider.generate_enhancement(prompt)

        try:
            # We attempt to get the structured result
            enhancement_result = _call_provider()
            latency = int((time.time() - start_time) * 1000)
            
            return AIResult(
                status="success",
                enhancement=enhancement_result,
                model=self.provider.model_name,
                prompt_version=self.prompt_version,
                latency_ms=latency,
                retry_count=0, # Need to actually grab this from the retry decorator or provider if possible, but keeping 0 for now unless we bubble it up
                input_tokens=0, # Same
                output_tokens=0,
                metadata={
                    "analysis_id": analysis_id,
                    "provider": self.provider.provider_name
                }
            )
            
        except Exception as e:
            # Fallback if quota is permanently exhausted or another unrecoverable error occurs
            latency = int((time.time() - start_time) * 1000)
            error_msg = str(e).lower()
            
            reason = "unknown_error"
            if "quota" in error_msg or "billing" in error_msg:
                reason = "quota_exhausted"
            elif "429" in error_msg or "resource_exhausted" in error_msg:
                reason = "rate_limited"
                
            logger.error(
                f"AI Provider {self.provider.provider_name} failed for analysis_id {analysis_id}. "
                f"Reason: {reason}. Error: {str(e)}"
            )
            
            return AIResult(
                status="fallback",
                reason=reason,
                enhancement=None,
                model=self.provider.model_name,
                prompt_version=self.prompt_version,
                latency_ms=latency,
                error_type=reason,
                error_message=str(e),
                metadata={
                    "analysis_id": analysis_id,
                    "provider": self.provider.provider_name,
                }
            )
