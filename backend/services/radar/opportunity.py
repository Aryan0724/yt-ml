"""
backend/services/radar/opportunity.py

Deterministic opportunity score calculator and classification engine for Creator Radar.
Every calculation retains a traceable, explainable evidence trail according to model version 2026-v1.
"""

from typing import Dict, Any, List, Tuple
import numpy as np

from core.radar_config import (
    RADAR_MODEL_VERSION,
    THRESHOLDS,
    OPPORTUNITY_WEIGHTS
)
from services.radar.schemas import (
    RadarTopicMetrics,
    RadarOpportunity,
    RadarOpportunityEvidence
)


class OpportunityCalculator:
    """
    Computes deterministic demand, momentum, freshness, saturation,
    and opportunity scores with full evidence trails.
    """

    @staticmethod
    def calculate_metrics_and_opportunity(
        time_series: List[Dict[str, Any]]
    ) -> Tuple[RadarTopicMetrics, RadarOpportunity, str, str, str]:
        """
        Parses time series points and calculates:
          (metrics, opportunity, classification, why_this_matters, creator_opportunity)
        """
        if not time_series:
            # Empty / no data fallback
            metrics = RadarTopicMetrics(
                demand=0.0,
                momentum=0.0,
                freshness=0.0,
                saturation=0.0,
                volatility=0.0,
                current_value=0,
                baseline_value=0.0
            )
            opportunity = RadarOpportunity(
                score=0.0,
                tier="EMERGING",
                model_version=RADAR_MODEL_VERSION,
                evidence=RadarOpportunityEvidence(
                    demand_component=0.0,
                    momentum_component=0.0,
                    freshness_component=0.0,
                    saturation_discount=0.0,
                    weights=OPPORTUNITY_WEIGHTS
                )
            )
            return (
                metrics,
                opportunity,
                "STABLE",
                "Insufficient historical search volume to determine trend trajectory.",
                "Explore niche long-tail keywords before publishing."
            )

        values = [max(0, min(100, int(p.get("value", 0)))) for p in time_series]
        n_points = len(values)
        current = values[-1]
        baseline = float(np.mean(values))
        peak_idx = int(np.argmax(values))
        peak_val = max(values)
        volatility = float(np.std(values))

        # 1. Demand Score (0-100): Blend of current level and baseline volume
        demand_score = min(100.0, max(0.0, (0.65 * current) + (0.35 * baseline)))

        # 2. Momentum Calculation
        # Compare last 4 points with prior baseline
        if n_points >= 8:
            prior_base = float(np.mean(values[-8:-4]))
        elif n_points > 1:
            prior_base = float(np.mean(values[:-1]))
        else:
            prior_base = max(1.0, baseline)
        
        safe_prior = max(1.0, prior_base)
        short_term_momentum = (current - prior_base) / safe_prior
        momentum_pct = round(short_term_momentum * 100.0, 1)

        # Normalize momentum score for opportunity model (0 to 100)
        # Momentum of +50% maps to ~75, +100% maps to ~95, -30% maps to ~30
        norm_momentum = min(100.0, max(0.0, 50.0 + (short_term_momentum * 50.0)))

        # 3. Freshness Score (0-100): Proximity of peak or breakout to recent timeline
        recency_ratio = (peak_idx + 1) / max(1, n_points)
        if recency_ratio >= 0.85:
            freshness_score = 90.0 + (10.0 * (current / max(1, peak_val)))
        elif recency_ratio >= 0.60:
            freshness_score = 65.0 + (25.0 * recency_ratio)
        else:
            freshness_score = max(15.0, recency_ratio * 70.0)
        freshness_score = min(100.0, round(freshness_score, 1))

        # 4. Saturation Score (0-100): Plateauing high baseline with low growth
        growth_rate = (current - baseline) / max(1.0, baseline)
        if baseline >= 60 and abs(growth_rate) < 0.15:
            saturation_score = min(95.0, 65.0 + (baseline * 0.3))
        elif growth_rate < -0.2:
            saturation_score = min(90.0, 50.0 + (baseline * 0.4))
        else:
            # Low historical baseline with strong surge = low saturation
            saturation_score = max(10.0, min(60.0, (baseline * 0.5) - (growth_rate * 15.0)))
        saturation_score = min(100.0, max(0.0, round(saturation_score, 1)))

        # 5. Opportunity Score Formula ("2026-v1")
        w = OPPORTUNITY_WEIGHTS
        raw_weighted = (
            (w["demand"] * demand_score) +
            (w["momentum"] * norm_momentum) +
            (w["freshness"] * freshness_score)
        )
        saturation_discount = 1.0 - (w["saturation_penalty"] * (saturation_score / 100.0))
        final_score = round(max(0.0, min(100.0, raw_weighted * saturation_discount)), 1)

        # Opportunity Tier
        if final_score >= 75.0:
            tier = "HIGH"
        elif final_score >= 50.0:
            tier = "MODERATE"
        else:
            tier = "EMERGING"

        # 6. Classification Assignment using centralized config thresholds
        if short_term_momentum >= THRESHOLDS["BREAKING_SHORT_TERM_MOMENTUM"] and current >= THRESHOLDS["BREAKING_MIN_VALUE"]:
            classification = "BREAKING"
        elif final_score >= THRESHOLDS["OPPORTUNITY_MIN_SCORE"] and saturation_score <= THRESHOLDS["OPPORTUNITY_MAX_SATURATION"]:
            classification = "OPPORTUNITY"
        elif current >= THRESHOLDS["SATURATING_MIN_CURRENT"] and saturation_score >= THRESHOLDS["SATURATING_MIN_SATURATION"]:
            classification = "SATURATING"
        elif short_term_momentum >= THRESHOLDS["RISING_MIN_MOMENTUM"]:
            classification = "RISING"
        elif current >= THRESHOLDS["TRENDING_MIN_CURRENT"] and baseline >= THRESHOLDS["TRENDING_MIN_BASELINE"]:
            classification = "TRENDING"
        elif short_term_momentum <= THRESHOLDS["COOLING_MAX_MOMENTUM"]:
            classification = "COOLING"
        else:
            classification = "STABLE"

        # 7. Actionable deterministic narrative
        if classification == "BREAKING":
            why_this_matters = f"Search interest experienced a sudden surge of {momentum_pct:+.1f}% in recent weeks, reaching {current}/100."
            creator_opportunity = "Audience curiosity is peaking right now. High potential for fast-turnaround explainer or reaction content."
        elif classification == "OPPORTUNITY":
            why_this_matters = f"Healthy demand ({round(demand_score)}/100) and strong momentum ({momentum_pct:+.1f}%) with low creator saturation ({round(saturation_score)}/100)."
            creator_opportunity = "Underserved audience demand. Specific case studies or tactical how-tos have a high discovery ceiling."
        elif classification == "RISING":
            why_this_matters = f"Search interest is steadily accelerating ({momentum_pct:+.1f}% momentum) with sustainable upward trajectory."
            creator_opportunity = "Build a dedicated series or pillar video while the topic gains mainstream viewer interest."
        elif classification == "SATURATING":
            why_this_matters = f"High viewer demand ({round(demand_score)}/100), but topic saturation is elevated ({round(saturation_score)}/100) with numerous established videos."
            creator_opportunity = "Avoid broad beginner overviews. Stand out with contrarian angles, extreme experiments, or hyper-specific sub-niches."
        elif classification == "TRENDING":
            why_this_matters = f"Consistently elevated viewer interest ({current}/100) with a proven baseline over time."
            creator_opportunity = "Steady discovery volume. Focus on top-tier visual packaging to win competitive click-through decisions."
        elif classification == "COOLING":
            why_this_matters = f"Search interest has declined {abs(momentum_pct):.1f}% from recent peak levels."
            creator_opportunity = "Audience fatigue may be setting in. Reframe around forward-looking implications rather than recap content."
        else:
            why_this_matters = f"Stable, consistent search demand with minimal weekly volatility ({round(volatility, 1)})."
            creator_opportunity = "Reliable evergreen topic. Focus on search-optimized titles and clear problem-solving value."

        metrics = RadarTopicMetrics(
            demand=round(demand_score, 1),
            momentum=momentum_pct,
            freshness=freshness_score,
            saturation=saturation_score,
            volatility=round(volatility, 1),
            current_value=current,
            baseline_value=round(baseline, 1)
        )

        opportunity = RadarOpportunity(
            score=final_score,
            tier=tier,
            model_version=RADAR_MODEL_VERSION,
            evidence=RadarOpportunityEvidence(
                demand_component=round(w["demand"] * demand_score, 2),
                momentum_component=round(w["momentum"] * norm_momentum, 2),
                freshness_component=round(w["freshness"] * freshness_score, 2),
                saturation_discount=round(saturation_discount, 3),
                weights=w
            )
        )

        return metrics, opportunity, classification, why_this_matters, creator_opportunity
