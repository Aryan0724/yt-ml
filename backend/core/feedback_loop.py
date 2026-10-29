"""
backend/core/feedback_loop.py

Closed-Loop Predictive Feedback & Self-Calibration Engine:
Compares pre-upload predictions against post-upload real YouTube performance,
diagnoses the root causes of prediction divergence, and updates channel calibration weights.
"""

import math
from typing import Dict, Any, Optional


class FeedbackCalibrationEngine:
    @staticmethod
    def calculate_actual_score(
        actual_views_48h: int,
        channel_baseline_views: int,
        actual_ctr_pct: Optional[float] = None
    ) -> float:
        """
        Derives an empirical performance score (0-100) from 48-hour post-upload performance
        relative to the channel's historic baseline.
        """
        baseline = max(10, channel_baseline_views)
        ratio = float(actual_views_48h) / float(baseline)

        # Baseline performance (ratio = 1.0) maps to 72 points (Standard B Tier)
        # Breakout performance (ratio >= 2.5) maps to 90-99 points (S Tier)
        # Flop performance (ratio <= 0.4) maps to 30-50 points (D Tier)
        if ratio >= 3.0:
            raw_score = 92.0 + min(7.0, (ratio - 3.0) * 2.0)
        elif ratio >= 1.8:
            raw_score = 82.0 + (ratio - 1.8) * 8.3
        elif ratio >= 1.0:
            raw_score = 70.0 + (ratio - 1.0) * 15.0
        elif ratio >= 0.5:
            raw_score = 52.0 + (ratio - 0.5) * 36.0
        else:
            raw_score = max(10.0, ratio * 104.0)

        # Adjust for CTR if reported
        if actual_ctr_pct is not None and actual_ctr_pct > 0:
            if actual_ctr_pct >= 9.0:
                raw_score += 5.0
            elif actual_ctr_pct <= 3.5:
                raw_score -= 8.0

        return round(min(99.0, max(1.0, raw_score)), 1)

    @classmethod
    def evaluate_outcome(
        cls,
        predicted_score: float,
        predicted_tier: str,
        actual_views_48h: int,
        channel_baseline_views: int,
        actual_ctr_pct: Optional[float] = None,
        retention_30s_pct: Optional[float] = None,
        current_calibration_factor: float = 1.0
    ) -> Dict[str, Any]:
        """
        Calculates prediction accuracy, residual delta, causal diagnosis, and new calibration factor.
        """
        actual_score = cls.calculate_actual_score(actual_views_48h, channel_baseline_views, actual_ctr_pct)
        delta = round(actual_score - predicted_score, 1)

        # Assign actual tier
        if actual_score >= 85: actual_tier = "S"
        elif actual_score >= 75: actual_tier = "A"
        elif actual_score >= 65: actual_tier = "B"
        elif actual_score >= 55: actual_tier = "C"
        else: actual_tier = "D"

        # Determine accuracy classification
        abs_delta = abs(delta)
        if abs_delta <= 8.0:
            accuracy_status = "EXACT_CALIBRATION"
            explanation = "Prediction matched actual outcome within nominal margin of error. Model calibration confirmed."
        elif abs_delta <= 16.0:
            accuracy_status = "DIRECTIONALLY_ACCURATE"
            explanation = "Predicted tier aligned with creator trajectory; minor variance within standard niche volatility."
        elif delta > 16.0:
            accuracy_status = "UNDERPREDICTED_BREAKOUT"
            if actual_ctr_pct and actual_ctr_pct > 8.0:
                explanation = "Video outperformed prediction due to explosive CTR in browse features that exceeded historic niche baseline."
            else:
                explanation = "Video outperformed prediction. Likely driven by external social traffic, Reddit/X feature, or sudden trend breakout."
        else: # delta < -16.0
            accuracy_status = "OVERPREDICTED_DROP"
            if retention_30s_pct and retention_30s_pct < 45.0:
                explanation = "Video underperformed prediction due to severe early retention drop-off (<45% at 0:30). High clickbait expectations were not met by video pacing."
            else:
                explanation = "Packaging underperformed predicted velocity. Possible causes: intense competitor video publish clash at upload hour or mobile feed title truncation."

        # Compute next calibration factor for the channel:
        # beta_new = beta_old * (1 + 0.08 * tanh(delta / 30))
        # Bounded between 0.70 and 1.35 to prevent destabilizing oscillation
        calibration_shift = 0.08 * math.tanh(delta / 30.0)
        updated_calibration_factor = round(max(0.70, min(1.35, current_calibration_factor * (1.0 + calibration_shift))), 3)

        return {
            "predicted_score": round(predicted_score, 1),
            "predicted_tier": predicted_tier,
            "actual_score": actual_score,
            "actual_tier": actual_tier,
            "delta": delta,
            "abs_error": abs_delta,
            "accuracy_status": accuracy_status,
            "causal_diagnosis": explanation,
            "previous_calibration_factor": current_calibration_factor,
            "updated_calibration_factor": updated_calibration_factor,
            "actual_views_48h": actual_views_48h,
            "channel_baseline_views": channel_baseline_views,
            "actual_ctr_pct": actual_ctr_pct,
            "retention_30s_pct": retention_30s_pct
        }


feedback_engine = FeedbackCalibrationEngine()
