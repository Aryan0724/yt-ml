"""
analyze.py

Pydantic schemas for the analysis endpoints.
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List


class AnalysisResponseData(BaseModel):
    engine_version: str
    master_report: Dict[str, Any]
    score: int
    tier: str
    confidence: str
    confidence_range: str
    reliability: str
    risk_level: str
    novelty_risk: str
    factors: Dict[str, Any]
    strengths: List[str]
    weaknesses: List[str]
    improvements: List[Dict[str, Any]]
    channel_dna: Dict[str, Any]
    competitor_analysis: Dict[str, Any]
    safe_vs_breakout: Dict[str, Any]
    ai: Dict[str, Any]
    topic_intelligence: Optional[Dict[str, Any]] = None
    raw_metrics: Dict[str, Any]
    debug: Dict[str, Any]
    possible_static_output_bug: bool


class AnalysisResponse(BaseModel):
    status: str
    data: AnalysisResponseData
    metadata: Dict[str, Any]


class MetadataOnlyResponseData(BaseModel):
    dna_profile: Dict[str, Any]
    competitor_profile: Dict[str, Any]
    topic_intelligence: Optional[Dict[str, Any]] = None


class MetadataOnlyResponse(BaseModel):
    status: str
    data: MetadataOnlyResponseData


class TopicResponse(BaseModel):
    status: str
    data: Dict[str, Any]


class CompareResponseVariant(BaseModel):
    index: int
    name: str
    score: int
    tier: str
    strengths: List[str]
    weaknesses: List[str]
    improvements: List[Dict[str, Any]]
    master_report: Dict[str, Any]
    data: Dict[str, Any]
    rank: int


class CompareResponse(BaseModel):
    status: str
    winner: Optional[CompareResponseVariant]
    all_variants: List[CompareResponseVariant]
