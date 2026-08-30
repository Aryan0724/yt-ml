"""
analyzer.py

Deterministic time-series analyzer for Topic Intelligence.
Calculates growth, momentum, volatility, seasonality, and confidence
directly from observed trend data points without guessing or hallucinating.
"""
from typing import Dict, Any, List, Tuple, Optional
import numpy as np
from services.topic.schemas import TopicMetrics, TopicTimeSeriesPoint


class TopicAnalyzer:
    """
    Performs purely deterministic mathematical analysis on real time-series points.
    """

    def analyze(self, raw_points: List[Dict[str, Any]]) -> Tuple[List[TopicTimeSeriesPoint], Optional[TopicMetrics]]:
        """
        Parses time-series points and computes objective trend metrics.
        Returns: (time_series_points, metrics)
        """
        if not raw_points:
            return [], None

        # Build clean typed time series points
        points: List[TopicTimeSeriesPoint] = []
        values: List[int] = []
        for p in raw_points:
            val = max(0, min(100, int(p.get("value", 0))))
            date_str = str(p.get("date", ""))
            points.append(TopicTimeSeriesPoint(date=date_str, value=val))
            values.append(val)

        if len(values) < 4:
            # Insufficient points to compute momentum or volatility reliably
            return points, None

        # 1. Baseline & Level Metrics
        current = int(values[-1])
        baseline = float(np.mean(values))
        peak = int(max(values))
        trough = int(min(values))

        # 2. Growth Rate (Current vs Baseline)
        safe_baseline = max(1.0, baseline)
        growth_rate = float((current - baseline) / safe_baseline)

        # 3. Short-term Momentum (Last 4 points vs prior recent baseline)
        short_term_slice = values[-4:]
        if len(values) >= 8:
            prior_recent_baseline = float(np.mean(values[-8:-4]))
        else:
            prior_recent_baseline = float(np.mean(values[:-1])) if len(values) > 1 else safe_baseline
        
        safe_prior = max(1.0, prior_recent_baseline)
        short_term_momentum = float((current - prior_recent_baseline) / safe_prior)

        # 4. Long-term Momentum (Slope across the full period)
        x = np.arange(len(values))
        if len(values) > 1:
            slope, _ = np.polyfit(x, values, 1)
            # Normalize slope by period length and baseline
            long_term_momentum = float((slope * len(values)) / safe_baseline)
        else:
            long_term_momentum = 0.0

        # Categorical Direction Label
        if short_term_momentum > 0.15 or (growth_rate > 0.25 and long_term_momentum > 0.10):
            momentum_label = "Rising"
        elif short_term_momentum < -0.15 or (growth_rate < -0.25 and long_term_momentum < -0.10):
            momentum_label = "Falling"
        else:
            momentum_label = "Stable"

        # 5. Volatility (Coefficient of Variation)
        std_dev = float(np.std(values))
        volatility = float(std_dev / safe_baseline)
        if volatility < 0.25:
            volatility_label = "Low"
        elif volatility < 0.50:
            volatility_label = "Medium"
        else:
            volatility_label = "High"

        # 6. Seasonality Heuristic (High variance with flat long-term drift)
        if len(values) >= 40 and volatility > 0.40 and abs(long_term_momentum) < 0.20:
            seasonality = "High"
        elif len(values) >= 24 and volatility > 0.30:
            seasonality = "Moderate"
        else:
            seasonality = "Low"

        # 7. Demand Level (Volume index)
        if current >= 65 or baseline >= 50:
            demand_level = "High"
        elif current >= 25 or baseline >= 20:
            demand_level = "Moderate"
        else:
            demand_level = "Low"

        # 8. Confidence Rating (Explicit criteria)
        if len(values) >= 40:
            confidence = "HIGH"
        elif len(values) >= 12:
            confidence = "MEDIUM"
        else:
            confidence = "LOW"

        metrics = TopicMetrics(
            baseline_interest=round(baseline, 1),
            current_interest=current,
            peak_interest=peak,
            trough_interest=trough,
            growth_rate=round(growth_rate, 2),
            short_term_momentum=round(short_term_momentum, 2),
            long_term_momentum=round(long_term_momentum, 2),
            momentum_label=momentum_label,
            volatility=round(volatility, 2),
            volatility_label=volatility_label,
            seasonality=seasonality,
            demand_level=demand_level,
            confidence=confidence
        )

        return points, metrics
