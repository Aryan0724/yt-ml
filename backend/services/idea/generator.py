import os
import uuid
import json
import logging
from typing import List
from google import genai
from google.genai import types
from services.radar.schemas import RadarTopicItem
from services.idea.schemas import IdeaOutput

logger = logging.getLogger(__name__)

class IdeaGenerator:
    """
    Connects Radar Intelligence to Gemini LLM to generate highly actionable,
    data-backed video angles based strictly on the provided evidence.
    """
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def generate_ideas(self, topic_data: RadarTopicItem) -> List[IdeaOutput]:
        if not self.client:
            logger.warning("Gemini API key not configured. Returning fallback ideas.")
            return self._fallback_ideas(topic_data)
        
        system_prompt = (
            "You are an elite YouTube strategist. Your job is to generate 3-5 highly differentiated, "
            "actionable video ideas based on real market intelligence.\n"
            "CRITICAL RULES:\n"
            "1. You must use ONLY the provided quantitative data for 'why_now' and 'evidence'. Do NOT invent metrics.\n"
            "2. Optimize for specificity. No generic 'Make a video about X'.\n"
            "3. Respect the classification. "
            "If SATURATING, provide contrarian/unusual angles. "
            "If BREAKING, provide fast explainers. "
            "If OPPORTUNITY/UNDERSERVED, target specific sub-niches.\n"
            "Respond ONLY in valid JSON matching the exact schema."
        )

        user_prompt = f"""
        Topic: {topic_data.canonical_name}
        Classification: {topic_data.classification}
        Demand (0-100): {topic_data.metrics.demand}
        Momentum: {topic_data.metrics.momentum}%
        Saturation (0-100): {topic_data.metrics.saturation}
        Why this matters: {topic_data.why_this_matters}
        Creator Opportunity: {topic_data.creator_opportunity}
        
        Generate 3 to 5 video ideas based on this evidence.
        """

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    response_mime_type="application/json",
                    temperature=0.7
                )
            )
            
            raw_text = response.text
            data = json.loads(raw_text)
            
            # Allow LLM to return a list directly or a dict with an 'ideas' key
            if isinstance(data, dict) and "ideas" in data:
                items = data["ideas"]
            elif isinstance(data, list):
                items = data
            else:
                items = []

            results = []
            for item in items:
                try:
                    # Enforce the IdeaOutput schema
                    idea = IdeaOutput(
                        idea_id=str(uuid.uuid4()),
                        topic=topic_data.canonical_name,
                        angle=item.get("angle", "Strategic overview"),
                        title_concept=item.get("title_concept", "Untitled"),
                        format=item.get("format", "Educational"),
                        audience=item.get("audience", "General"),
                        hook=item.get("hook", "Start with the problem."),
                        why_now=item.get("why_now", "Based on current demand."),
                        evidence=item.get("evidence", "Supported by radar metrics."),
                        difficulty=item.get("difficulty", "Medium")
                    )
                    results.append(idea)
                except Exception as parse_err:
                    logger.error(f"Error parsing idea item: {parse_err}")
            
            if not results:
                return self._fallback_ideas(topic_data)
            return results
            
        except Exception as e:
            logger.error(f"Gemini generation error: {e}")
            return self._fallback_ideas(topic_data)

    def _fallback_ideas(self, topic_data: RadarTopicItem) -> List[IdeaOutput]:
        """Provides a safe, honest fallback when AI is unreachable."""
        return [
            IdeaOutput(
                idea_id=str(uuid.uuid4()),
                topic=topic_data.canonical_name,
                angle="Foundational Explainer",
                title_concept=f"The Truth About {topic_data.canonical_name}",
                format="Direct to camera",
                audience="Beginners",
                hook="You've probably heard about this, but here is what actually matters.",
                why_now=topic_data.creator_opportunity,
                evidence=topic_data.why_this_matters,
                difficulty="Low"
            )
        ]
