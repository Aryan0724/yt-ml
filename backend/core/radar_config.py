"""
backend/core/radar_config.py

Centralized configuration, taxonomies, and versioned classification thresholds
for the PreYT Creator Radar.
"""

from typing import Dict, List, Any

# Current model version for radar classification and opportunity scoring
RADAR_MODEL_VERSION = "2026-v1"

# Supported regions: configuration-driven rather than hardcoded in UI
SUPPORTED_REGIONS: List[Dict[str, str]] = [
    {"code": "IN", "name": "India", "flag": "🇮🇳", "default": True},
    {"code": "US", "name": "United States", "flag": "🇺🇸", "default": False},
    {"code": "GB", "name": "United Kingdom", "flag": "🇬🇧", "default": False},
    {"code": "CA", "name": "Canada", "flag": "🇨🇦", "default": False},
    {"code": "AU", "name": "Australia", "flag": "🇦🇺", "default": False},
    {"code": "AE", "name": "United Arab Emirates", "flag": "🇦🇪", "default": False},
    {"code": "GLOBAL", "name": "Worldwide", "flag": "🌎", "default": False},
]

# Supported topic categories
SUPPORTED_CATEGORIES: List[str] = [
    "All",
    "Technology",
    "AI",
    "Gaming",
    "Entertainment",
    "Education",
    "Business",
    "Finance",
    "Lifestyle",
    "Sports",
    "Travel",
    "Health",
    "Science",
]

# Primary topic classifications
CLASSIFICATIONS = [
    "BREAKING",
    "RISING",
    "TRENDING",
    "OPPORTUNITY",
    "SATURATING",
    "COOLING",
    "STABLE",
]

# Versioned classification thresholds ("2026-v1")
THRESHOLDS = {
    # Breaking: sudden massive surge in recent points
    "BREAKING_SHORT_TERM_MOMENTUM": 0.70,     # +70% short term vs baseline
    "BREAKING_MIN_VALUE": 40,                 # minimum search interest level
    
    # Rising: healthy positive acceleration
    "RISING_MIN_MOMENTUM": 0.15,              # +15% momentum
    "RISING_MAX_MOMENTUM": 0.70,
    
    # Trending: high sustained interest over time
    "TRENDING_MIN_CURRENT": 60,               # current level >= 60
    "TRENDING_MIN_BASELINE": 45,              # baseline level >= 45
    
    # Opportunity: high score with relatively low creator saturation
    "OPPORTUNITY_MIN_SCORE": 70.0,
    "OPPORTUNITY_MAX_SATURATION": 55.0,
    
    # Saturating: high interest but plateaued/peaked with high competition
    "SATURATING_MIN_CURRENT": 55,
    "SATURATING_MIN_SATURATION": 65.0,
    
    # Cooling: declining momentum
    "COOLING_MAX_MOMENTUM": -0.15,            # -15% momentum
    
    # Stable: low volatility and minimal growth
    "STABLE_MAX_VOLATILITY": 15.0,
    "STABLE_MAX_GROWTH_ABS": 0.12,
}

# Versioned opportunity score weights ("2026-v1")
# Opportunity Score = (w_demand * Demand + w_momentum * Momentum + w_freshness * Freshness) * (1 - penalty * Saturation)
OPPORTUNITY_WEIGHTS = {
    "demand": 0.40,
    "momentum": 0.35,
    "freshness": 0.25,
    "saturation_penalty": 0.30,  # Max 30% discount if 100% saturated
}
