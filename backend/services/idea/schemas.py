from pydantic import BaseModel, Field
from typing import List, Optional

class IdeaGenerationRequest(BaseModel):
    topic_slug: str
    region: str = "IN"

class IdeaOutput(BaseModel):
    idea_id: str = Field(description="Unique identifier for the generated idea (UUID)")
    topic: str = Field(description="The canonical topic name")
    angle: str = Field(description="The specific creator angle or unique spin")
    title_concept: str = Field(description="A highly clickable, packaged video title")
    format: str = Field(description="Video format (e.g., Explainer, Case Study, Challenge, VLOG)")
    audience: str = Field(description="Target audience descriptor")
    hook: str = Field(description="The first 15 seconds hook concept")
    why_now: str = Field(description="Why this works right now, based STRICTLY on the data")
    evidence: str = Field(description="The mathematical evidence backing this idea")
    difficulty: str = Field(description="Production difficulty: Low, Medium, High")

class IdeaGenerationResponse(BaseModel):
    topic: str
    classification: str
    captured_at: str
    ideas: List[IdeaOutput]
