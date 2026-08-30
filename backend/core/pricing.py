"""
backend/core/pricing.py

Versioned pricing configuration for all external AI, search, and compute providers.
Guarantees full traceability: every recorded cost traces back to a defined pricing version.
"""

from typing import Dict, Any

# Versioned provider pricing rate cards (USD)
PRICING_CATALOG: Dict[str, Dict[str, Any]] = {
    "2026-v1": {
        "description": "Standard 2026 Q3 Provider Pricing Card",
        # Google Gemini 3.5 Flash Lite Rates (per million tokens)
        "gemini_input_per_million": 0.075,
        "gemini_output_per_million": 0.300,
        # DataForSEO Google Trends Live Task (flat per task)
        "dataforseo_trends_per_task": 0.0110,
        # Amortized VPS Compute & Memory (per second of wall-clock processing)
        "compute_cost_per_second": 0.0001,
        # Amortized storage and database persistence per analysis
        "storage_cost_per_analysis": 0.0005,
    }
}

CURRENT_PRICING_VERSION = "2026-v1"


def get_pricing_card(version: str = CURRENT_PRICING_VERSION) -> Dict[str, Any]:
    """Resolves provider pricing for a specific version."""
    if version not in PRICING_CATALOG:
        return PRICING_CATALOG[CURRENT_PRICING_VERSION]
    return PRICING_CATALOG[version]
