"""
llm_report_generator.py

Bridges the legacy engine output to the unified AIService.
Extracts the full packaging evidence (thumbnail, title, topic, channel)
and produces a consolidated diagnosis, bottleneck analysis, and action plan.
"""
import os
import uuid
import logging
from dotenv import load_dotenv

from services.ai.gemini import GeminiProvider
from services.ai.service import AIService
from services.ai.prompts import generate_unified_evidence_prompt

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env.local'))
logger = logging.getLogger(__name__)


class LLMReportGenerator:
    def __init__(self):
        self.enabled = bool(os.environ.get("GEMINI_API_KEY"))
        if self.enabled:
            provider = GeminiProvider()
            self.ai_service = AIService(provider)

    def generate_master_report(
        self,
        raw_input: dict,
        score: int,
        tier: str,
        strengths: list,
        weaknesses: list,
        analysis_id: str = None,
        dna_profile: dict = None
    ):
        """
        Builds the unified evidence package and executes one consolidated Gemini call.
        Returns: (master_report_dict, ai_result_dict)
        """
        ui_fallback = {
            "summary": "AI enhancement was unavailable or fell back to deterministic rules.",
            "primary_bottleneck": "Analysis based strictly on deterministic visual and metadata heuristics.",
            "packaging_verdict": {
                "topic_status": "Unknown",
                "title_status": "Moderate",
                "thumbnail_status": "Strong" if score >= 75 else "Moderate",
                "overall_packaging": "Moderate"
            },
            "diagnosis": {
                "root_cause": "Deterministic engine analyzed image contrast, faces, and title heuristics.",
                "severity": "Medium",
                "evidence": "Heuristic and ML scoring completed; AI interpretation offline.",
                "expected_consequence": "Follow the heuristic visual severity checklist below."
            },
            "optimization_plan": [
                {
                    "priority": 1,
                    "action": "Follow the prioritized visual severity fixes in the checklist below",
                    "rationale": "Directly resolves the top detected visual and formatting bottlenecks."
                }
            ],
            "recommended_angles": [],
            "warnings": ["AI enhancement offline — displaying deterministic metrics only."]
        }

        if not self.enabled:
            return ui_fallback, {
                "status": "fallback",
                "reason": "api_key_missing",
                "model": "none",
                "prompt_version": "none"
            }

        title = raw_input.get("title", "Untitled Concept")
        category = raw_input.get("category", "General")

        # 1. Thumbnail Vision Evidence
        thumbnail_evidence = {
            "brightness": raw_input.get("brightness", 128),
            "contrast": raw_input.get("contrast", 50.0),
            "saturation": raw_input.get("saturation", 50.0),
            "face_count": raw_input.get("face_count", 0),
            "mobile_readability": raw_input.get("mobile_readability", 75.0),
            "clutter_rating": raw_input.get("clutter_level_rating", 5.0)
        }

        # 2. Title Forensics Evidence
        title_evidence = {
            "title_length": len(title),
            "curiosity_score": raw_input.get("curiosity_score", 50),
            "category": category
        }

        # 3. Topic Evidence (from Topic Intelligence)
        topic_evidence = raw_input.get("topic_data")

        # 4. Channel DNA Evidence
        channel_dna_evidence = None
        if dna_profile:
            channel_dna_evidence = {
                "channel_title": dna_profile.get("channel_title"),
                "behavior_profile": dna_profile.get("channel_behavior_profile"),
                "style_match_pct": dna_profile.get("style_match_percentage")
            }

        prompt = generate_unified_evidence_prompt(
            title=title,
            category=category,
            tier=tier,
            score=score,
            thumbnail_evidence=thumbnail_evidence,
            title_evidence=title_evidence,
            topic_evidence=topic_evidence,
            channel_dna_evidence=channel_dna_evidence,
            strengths=strengths,
            weaknesses=weaknesses
        )

        if not analysis_id:
            analysis_id = str(uuid.uuid4())

        ai_result = self.ai_service.enhance_analysis(analysis_id, prompt)

        if ai_result.status == "success" and ai_result.enhancement:
            report_dict = ai_result.enhancement.model_dump()
            return report_dict, ai_result.model_dump()
        else:
            return ui_fallback, ai_result.model_dump()
