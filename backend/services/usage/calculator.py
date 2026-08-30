"""
backend/services/usage/calculator.py

Calculates exact unit economics and resource costs based on versioned provider pricing cards.
"""

from typing import Dict, Any, Optional
from core.pricing import CURRENT_PRICING_VERSION, get_pricing_card


class UsageCalculator:
    @staticmethod
    def calculate_analysis_cost(
        gemini_input_tokens: int = 0,
        gemini_output_tokens: int = 0,
        dataforseo_tasks: int = 0,
        compute_ms: int = 0,
        pricing_version: str = CURRENT_PRICING_VERSION
    ) -> Dict[str, Any]:
        """
        Calculates the complete cost breakdown for an analysis.
        All calculations are fully traceable to the defined pricing version.
        """
        pricing = get_pricing_card(pricing_version)

        # Gemini token costs
        in_rate = pricing["gemini_input_per_million"] / 1_000_000.0
        out_rate = pricing["gemini_output_per_million"] / 1_000_000.0
        gemini_cost = (gemini_input_tokens * in_rate) + (gemini_output_tokens * out_rate)

        # DataForSEO Trends task cost
        dfs_rate = pricing["dataforseo_trends_per_task"]
        dataforseo_cost = dataforseo_tasks * dfs_rate

        # Compute and storage amortized costs
        compute_sec = max(0.0, compute_ms / 1000.0)
        compute_cost = compute_sec * pricing["compute_cost_per_second"]
        storage_cost = pricing["storage_cost_per_analysis"]

        total_cost = gemini_cost + dataforseo_cost + compute_cost + storage_cost

        return {
            "pricing_version": pricing_version,
            "gemini_input_tokens": gemini_input_tokens,
            "gemini_output_tokens": gemini_output_tokens,
            "gemini_cost_usd": round(gemini_cost, 6),
            "dataforseo_cost_usd": round(dataforseo_cost, 6),
            "compute_ms": compute_ms,
            "compute_cost_usd": round(compute_cost, 6),
            "storage_cost_usd": round(storage_cost, 6),
            "total_cost_usd": round(total_cost, 6)
        }


usage_calculator = UsageCalculator()
