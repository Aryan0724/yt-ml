"""
schemas.py

Pydantic schemas for the Topic Intelligence system.
PRODUCT RULE:
  All numbers and classifications in TopicResult must be traceable to
  real external time-series data (e.g., DataForSEO / Google Trends).
  If provider is unavailable or unconfigured, status is explicitly marked
  and NO simulated or hardcoded trend metrics are fabricated.
"""
from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field


class TopicTimeSeriesPoint(BaseModel):
    date: str = Field(..., description="Timestamp or date string (e.g. '2025-01-05' or 'Week 1')")
    value: int = Field(..., description="Normalized relative search interest 0-100")


class TopicMetrics(BaseModel):
    baseline_interest: float = Field(..., description="Mean search interest across the time range (0-100)")
    current_interest: int = Field(..., description="Most recent interest score (0-100)")
    peak_interest: int = Field(..., description="Highest interest score recorded in period (0-100)")
    trough_interest: int = Field(..., description="Lowest interest score recorded in period (0-100)")
    growth_rate: float = Field(..., description="Relative interest shift (current - baseline) / baseline")
    short_term_momentum: float = Field(..., description="Velocity over the last 4 data points")
    long_term_momentum: float = Field(..., description="Velocity over the full measured period")
    momentum_label: Literal["Rising", "Falling", "Stable", "Unknown"] = Field(..., description="Categorical trend direction")
    volatility: float = Field(..., description="Coefficient of variation (std_dev / baseline)")
    volatility_label: Literal["Low", "Medium", "High"] = Field(..., description="Relative volatility category")
    seasonality: Literal["Low", "Moderate", "High", "Unknown"] = Field(..., description="Detected annual periodic pattern")
    demand_level: Literal["High", "Moderate", "Low", "Unknown"] = Field(..., description="Relative demand baseline level")
    confidence: Literal["HIGH", "MEDIUM", "LOW"] = Field(..., description="Confidence rating based on data density & coverage")


class TopicAngle(BaseModel):
    angle: str = Field(..., description="Specific content framing angle or hook for this topic")
    reason: str = Field(..., description="Strategic reasoning based on demand and momentum evidence")


class TopicInterpretationResult(BaseModel):
    summary: str = Field(..., description="1-2 sentence executive synthesis of topic momentum and creator opportunity")
    verdict: Literal["worth_exploring", "proceed_with_caution", "avoid", "insufficient_data"] = Field(
        ..., description="Actionable decision recommendation"
    )
    reasoning: str = Field(..., description="Why this verdict was reached given the evidence")
    recommended_angles: List[TopicAngle] = Field(default_factory=list, description="Concrete angles to test")
    warnings: List[str] = Field(default_factory=list, description="Any cautions or known data limitations")


class TopicResult(BaseModel):
    """
    Complete Topic Intelligence response object.
    Includes explicit provider status and reasons so failures are transparent.
    """
    status: Literal["success", "unavailable", "error"] = Field(..., description="Execution status")
    reason: Optional[str] = Field(None, description="Detailed reason if status is not success (e.g. 'provider_not_configured')")
    data_source: Optional[str] = Field(None, description="External data source identifier (e.g. 'dataforseo_google_trends')")
    topic: str = Field(..., description="Normalized topic queried")
    raw_topic: Optional[str] = Field(None, description="Original unnormalized input string or title")
    region: str = Field("IN", description="Geographic region code (e.g. 'IN', 'US')")
    time_range: str = Field("12m", description="Lookback period (e.g. '12m')")
    time_series: List[TopicTimeSeriesPoint] = Field(default_factory=list, description="Historical data points")
    metrics: Optional[TopicMetrics] = Field(None, description="Deterministic metrics derived from time series")
    interpretation: Optional[TopicInterpretationResult] = Field(None, description="LLM-interpreted action plan")
    cached: bool = Field(False, description="True if served from the 24h topic cache")
    metadata: Dict[str, Any] = Field(default_factory=dict)
