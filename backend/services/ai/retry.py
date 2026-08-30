import logging
from tenacity import retry, stop_after_attempt, wait_exponential_jitter, retry_if_exception, retry_if_exception_type

logger = logging.getLogger(__name__)

def is_transient_error(exception: Exception) -> bool:
    """
    Checks if the exception is a transient error (e.g. temporary 429 or 5xx).
    Hard quota limits should NOT be retried.
    """
    error_msg = str(exception).lower()
    
    # Fast fail if it's a permanent quota or billing issue
    if "quota" in error_msg or "billing" in error_msg:
        return False
        
    # Retry on temporary rate limits or server errors
    if "429" in error_msg or "500" in error_msg or "502" in error_msg or "503" in error_msg or "resource_exhausted" in error_msg:
        return True
        
    return False

# Retry configuration:
# - Retry only on transient errors.
# - Wait exponentially with jitter: e.g., 2s, 4s, 8s, up to 60s max.
# - Stop after 5 attempts.
ai_retry_decorator = retry(
    retry=retry_if_exception(is_transient_error),
    wait=wait_exponential_jitter(initial=2, max=60),
    stop=stop_after_attempt(5),
    reraise=True
)
