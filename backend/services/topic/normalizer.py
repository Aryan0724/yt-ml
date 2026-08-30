"""
normalizer.py

Deterministic topic extraction and normalization.
Extracts clean, normalized search topics from noisy video titles or raw keywords.
Ensures cache keys are consistent across minor variations (case, whitespace, punctuation).
"""
import re
from typing import Tuple

# Common filler phrases in YouTube titles that obscure the core topic
_TITLE_STOP_PATTERNS = [
    r"^i\s+(tried|built|made|tested|spent|bought|asked|hired|interviewed)\s+(to\s+|a\s+|an\s+|the\s+)?",
    r"^how\s+(to|i|we)\s+(learn\s+|make\s+|build\s+|start\s+)?",
    r"^why\s+(you|i|we|everyone|nobody)\s+(is\s+|are\s+|should\s+|would\s+)?",
    r"^the\s+truth\s+about\s+",
    r"^the\s+secret\s+of\s+",
    r"^everything\s+you\s+need\s+to\s+know\s+about\s+",
    r"^what\s+happened\s+when\s+",
    r"^stop\s+doing\s+",
    r"^don'?t\s+(do|buy|use)\s+",
    r"^is\s+(this|it)\s+the\s+end\s+of\s+",
    r"\s+in\s+202[0-9](\s+edition)?$",
    r"\s+in\s+[0-9]+\s+(hours|days|minutes)$",
    r"\s+in\s+[0-9]+\s+hour$",
    r"\s*\(.*?free.*?\)",
    r"\s*\[.*?202[0-9].*?\]",
    r"\s*\|\s*.*$",  # Strip channel branding after pipe: "Title | ChannelName"
    r"\s*-\s*.*$",  # Strip subtitle after hyphen if long
]


def normalize_topic_for_cache(topic: str, region: str = "IN", period: str = "12m") -> str:
    """
    Generates a deterministic, normalized cache key for (topic, region, period).
    Example: '  AI Agents!  ', 'IN', '12m' -> 'topic:dataforseo:ai agents:in:12m'
    """
    cleaned = re.sub(r"[^\w\s-]", "", topic.strip().lower())
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    reg = region.strip().upper()
    per = period.strip().lower()
    return f"topic:dataforseo:{cleaned}:{reg}:{per}"


def extract_core_topic(raw_text: str) -> str:
    """
    Extracts the core search topic from a raw keyword or video title.
    Examples:
      - 'AI Agents' -> 'AI Agents'
      - 'I Built an AI Agent That Runs My Business in 24 Hours' -> 'AI Agent That Runs My Business'
      - 'How to Learn Python Fast in 2026' -> 'Python Fast'
      - 'Double Dhamaal (HD) | Sanjay Dutt' -> 'Double Dhamaal (HD)'
    """
    if not raw_text or not raw_text.strip():
        return ""

    text = raw_text.strip()
    
    # Remove leading/trailing quote characters
    text = text.strip("\"'“”‘’")
    
    # If the text is already short (<= 3 words), just return cleaned version
    words = text.split()
    if len(words) <= 3:
        cleaned = re.sub(r"[^\w\s-]", "", text)
        return re.sub(r"\s+", " ", cleaned).strip()

    # Step 1: Remove common YouTube title wrapper patterns
    processed = text
    for pattern in _TITLE_STOP_PATTERNS:
        processed = re.sub(pattern, "", processed, flags=re.IGNORECASE).strip()

    # Step 2: Strip leading articles (a, an, the)
    processed = re.sub(r"^(a|an|the)\s+", "", processed, flags=re.IGNORECASE).strip()

    # Step 3: Strip trailing punctuation / exclamation
    processed = re.sub(r"[!?.#*]+$", "", processed).strip()

    # Step 4: If string was excessively stripped or left empty, fall back to first 3-4 significant words
    if not processed or len(processed) < 2:
        clean_words = [w for w in re.sub(r"[^\w\s]", "", text).split() if len(w) > 1]
        processed = " ".join(clean_words[:3])

    # Clean whitespace and return
    processed = re.sub(r"\s+", " ", processed).strip()
    return processed
