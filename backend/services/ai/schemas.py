"""
schemas.py

Pydantic schemas for the AI (Gemini) enhancement and packaging evaluation layer.
Defines the structured output contract for unified evidence interpretation.
"""
from typing import List, Literal, Optional, Dict, Any
from pydantic import BaseModel, Field


class Diagnosis(BaseModel):
    root_cause: str = Field(..., description="Identify the fundamental psychological or visual issue, not just a symptom. 1 sentence.")
    severity: Literal["Critical", "High", "Medium", "Low"] = Field(..., description="The severity of the root cause.")
    evidence: str = Field(..., description="Explicitly state the exact system detected metrics that prove this root cause.")
    expected_consequence: str = Field(..., description="Explain how this will impact viewer decision-making in scroll feeds.")


class OptimizationStep(BaseModel):
    priority: int = Field(..., description="Priority order of the step (1 is highest).")
    action: str = Field(..., description="A highly specific step the creator must take to fix the root cause.")
    rationale: str = Field(..., description="Why this works in the provided niche/category.")


class PackagingVerdict(BaseModel):
    topic_status: Literal["Strong", "Moderate", "Weak", "Unknown"] = Field(..., description="Assessment of topic demand & momentum")
    title_status: Literal["Strong", "Moderate", "Weak"] = Field(..., description="Assessment of title clarity & curiosity")
    thumbnail_status: Literal["Strong", "Moderate", "Weak"] = Field(..., description="Assessment of thumbnail visual stopping power")
    overall_packaging: Literal["High Impact", "Moderate", "Weak", "Imbalanced"] = Field(..., description="Synthesis of all 3 packaging pillars")


class ContentAngle(BaseModel):
    angle: str = Field(..., description="Specific content framing angle or hook")
    reason: str = Field(..., description="Why this angle aligns with audience demand or fills a gap")


class EnhancementResult(BaseModel):
    summary: str = Field(..., description="1-2 sentence executive packaging synthesis")
    packaging_verdict: Optional[PackagingVerdict] = Field(None, description="Pillar status breakdown")
    primary_bottleneck: str = Field(..., description="The single primary bottleneck holding back this video idea")
    diagnosis: Diagnosis
    optimization_plan: List[OptimizationStep] = Field(default_factory=list, description="Actionable optimization steps")
    recommended_angles: List[ContentAngle] = Field(default_factory=list, description="Actionable framing angles for the creator")
    warnings: List[str] = Field(default_factory=list, description="Any data limitations or cautions")


class AIResult(BaseModel):
    """The final payload returned by the AI Service with complete observability."""
    status: Literal["success", "fallback"]
    reason: Optional[str] = None
    enhancement: Optional[EnhancementResult] = None
    model: str
    prompt_version: str
    latency_ms: int = 0
    retry_count: int = 0
    input_tokens: int = 0
    output_tokens: int = 0
    error_type: Optional[str] = None
    error_message: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
