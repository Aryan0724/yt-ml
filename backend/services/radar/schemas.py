"""
backend/services/radar/schemas.py

Typed Pydantic schemas for the Creator Radar subsystem.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class RadarTopicMetrics(BaseModel):
    demand: float = Field(..., description="Normalized search interest 0-100")
    momentum: float = Field(..., description="Momentum percentage (e.g. +42.0)")
    freshness: float = Field(..., description="Freshness index 0-100 based on recent peak proximity")
    saturation: float = Field(..., description="Saturation/competition index 0-100")
    volatility: float = Field(..., description="Standard deviation / volatility 0-100")
    current_value: int = Field(..., description="Latest observed search interest value 0-100")
    baseline_value: float = Field(..., description="Average search interest across time range")


class RadarOpportunityEvidence(BaseModel):
    demand_component: float
    momentum_component: float
    freshness_component: float
    saturation_discount: float
    weights: Dict[str, float]


class RadarOpportunity(BaseModel):
    score: float = Field(..., description="Overall Opportunity Score 0-100")
    tier: str = Field(..., description="HIGH (>=75), MODERATE (50-74), EMERGING (<50)")
    model_version: str = Field(default="2026-v1")
    evidence: RadarOpportunityEvidence


class RadarTopicItem(BaseModel):
    id: str
    slug: str
    canonical_name: str
    category: str
    region: str
    classification: str = Field(..., description="BREAKING, RISING, TRENDING, OPPORTUNITY, SATURATING, COOLING, STABLE")
    metrics: RadarTopicMetrics
    opportunity: RadarOpportunity
    confidence: str = Field(..., description="HIGH, MEDIUM, LOW")
    why_this_matters: str
    creator_opportunity: str
    sparkline: List[int] = Field(default_factory=list)
    data_source: str
    captured_at: str


class RadarSummary(BaseModel):
    region: str
    total_tracked: int
    breaking_count: int
    rising_count: int
    trending_count: int
    opportunity_count: int
    saturating_count: int
    captured_at: str
    model_version: str = "2026-v1"


class RadarFeedResponse(BaseModel):
    region: str
    category: str
    classification: str
    topics: List[RadarTopicItem]
    total: int
    next_cursor: Optional[str] = None
    data_available: bool = True
    reason: Optional[str] = None
