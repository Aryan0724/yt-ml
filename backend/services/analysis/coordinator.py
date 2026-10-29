"""
coordinator.py

AnalysisCoordinator coordinates the entire analysis pipeline:
  HTTP Request -> Vision Decoding -> Topic Intelligence (if enabled) -> Engine Scoring -> Unified AI Packaging -> Telemetry Persistence -> Typed Response.
"""
import os
import hashlib
import logging
from typing import Dict, Any, Optional

from services.vision.analyzer import VisionAnalyzer, VisionAnalyzerError
from services.engine.facade import EngineFacade
from repositories.base import AnalysisRepositoryABC
from repositories.postgres import PostgresRepository
from services.topic.service import TopicService
from services.topic.schemas import TopicResult

logger = logging.getLogger(__name__)


class AnalysisCoordinator:
    """
    Orchestrates the analysis pipeline:
    HTTP request data -> Vision (if image present) -> Topic Intelligence -> Engine -> Persistence -> Response
    """

    def __init__(
        self,
        vision: Optional[VisionAnalyzer] = None,
        engine: Optional[EngineFacade] = None,
        repo: Optional[AnalysisRepositoryABC] = None,
        topic_service: Optional[TopicService] = None
    ):
        self.vision = vision or VisionAnalyzer()
        self.engine = engine or EngineFacade()
        self.repo = repo or PostgresRepository()
        self.topic_service = topic_service or TopicService()

    def analyze_single(
        self,
        raw_input: Dict[str, Any],
        image_bytes: Optional[bytes],
        analysis_id: str,
        include_topic: bool = True,
        region: Optional[str] = None,
        workspace_id: Optional[str] = None,
        project_id: Optional[str] = None,
        thumbnail_storage_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Coordinates a single thumbnail/metadata analysis with format-native CV & originality.
        """
        # 1. Vision Analysis (if thumbnail provided)
        if image_bytes:
            vision_metrics = self.vision.analyze(
                image_bytes=image_bytes,
                archetype=raw_input.get("archetype"),
                niche=raw_input.get("category", "General")
            )
            raw_input.update(vision_metrics)
        else:
            if "face_count" not in raw_input:
                raw_input["face_count"] = 0
            if "brightness" not in raw_input:
                raw_input["brightness"] = 120.0

        # 2. Topic Intelligence (if enabled and title/topic provided)
        topic_result_dict = None
        if include_topic:
            topic_query = raw_input.get("topic") or raw_input.get("title") or raw_input.get("category", "")
            try:
                topic_res: TopicResult = self.topic_service.get_topic_intelligence(
                    raw_topic=topic_query,
                    region=region
                )
                topic_result_dict = topic_res.model_dump()
                raw_input["topic_data"] = topic_result_dict
            except Exception as e:
                logger.error(f"Topic intelligence error: {e}")
                raw_input["topic_data"] = {
                    "status": "error",
                    "reason": str(e),
                    "topic": topic_query,
                    "region": region or "IN",
                    "time_series": []
                }
        else:
            raw_input["topic_data"] = None

        # 3. Engine Analysis (computes ML score, heuristics, DNA, title forensics, and unified Gemini AI packaging)
        result = self.engine.analyze(raw_input, analysis_id)

        # Attach topic intelligence to final response
        if topic_result_dict:
            result["topic_intelligence"] = topic_result_dict
        else:
            result["topic_intelligence"] = raw_input.get("topic_data")

        # 4. Telemetry Persistence
        self._persist_telemetry(
            analysis_id=analysis_id,
            raw_input=raw_input,
            final_result=result,
            image_bytes=image_bytes,
            region=region,
            workspace_id=workspace_id,
            project_id=project_id,
            thumbnail_storage_key=thumbnail_storage_key
        )

        return result

    def get_topic_only(
        self,
        topic: str,
        region: Optional[str] = None,
        period: str = "12m"
    ) -> Dict[str, Any]:
        """
        Standalone endpoint for exploring topic trend intelligence.
        """
        topic_res = self.topic_service.get_topic_intelligence(
            raw_topic=topic,
            region=region,
            period=period
        )
        return topic_res.model_dump()

    def _persist_telemetry(
        self,
        analysis_id: str,
        raw_input: Dict[str, Any],
        final_result: Dict[str, Any],
        image_bytes: Optional[bytes],
        region: Optional[str] = None,
        workspace_id: Optional[str] = None,
        project_id: Optional[str] = None,
        thumbnail_storage_key: Optional[str] = None
    ):
        """Persists the analysis and AI requests to Postgres repository."""
        input_hash = ""
        if image_bytes:
            input_hash = hashlib.sha256(image_bytes).hexdigest()

        ai_data = final_result.get("ai", {})

        analysis_payload = {
            "analysis_id": analysis_id,
            "status": "success" if final_result else "error",
            "engine_version": final_result.get("engine_version", "unknown"),
            "schema_version": "v2",
            "input_hash": input_hash,
            "image_dimensions": "",
            "input_metadata": {
                k: v for k, v in raw_input.items()
                if k not in [
                    "face_count", "brightness", "contrast", "saturation",
                    "clutter_level_rating", "text_density", "mobile_readability",
                    "face_detected", "face_boxes", "ocr_text", "topic_data"
                ]
            },
            "engine_result": {k: v for k, v in final_result.items() if k != "ai"},
            "topic_intelligence": final_result.get("topic_intelligence"),
            "final_result": final_result,
            "latency_ms": 0,
            "title": raw_input.get("title", "Untitled"),
            "niche": raw_input.get("category", "General"),
            "region": region or "IN",
            "score": final_result.get("score", 0.0),
            "tier": final_result.get("tier", "C"),
            "confidence": final_result.get("confidence", "MEDIUM"),
            "factors": final_result.get("factors", {}),
            "master_report": final_result.get("master_report", {}),
            "raw_metrics": final_result.get("raw_metrics", {}),
            "thumbnail_storage_key": thumbnail_storage_key
        }
        self.repo.save_analysis(analysis_payload, workspace_id=workspace_id, project_id=project_id)

        if ai_data:
            ai_req_payload = {
                "analysis_id": analysis_id,
                "source": ai_data.get("metadata", {}).get("source", "engine"),
                "provider": ai_data.get("metadata", {}).get("provider", "unknown"),
                "model": ai_data.get("model", "unknown"),
                "prompt_version": ai_data.get("prompt_version", "unknown"),
                "status": ai_data.get("status", "unknown"),
                "latency_ms": ai_data.get("latency_ms", 0),
                "retry_count": ai_data.get("retry_count", 0),
                "input_tokens": ai_data.get("input_tokens", 0),
                "output_tokens": ai_data.get("output_tokens", 0),
                "error_type": ai_data.get("error_type"),
                "error_message": ai_data.get("error_message")
            }
            ai_request_id = self.repo.save_ai_request(ai_req_payload)

            if ai_data.get("status") != "success" and ai_request_id:
                ai_err_payload = {
                    "analysis_id": analysis_id,
                    "ai_request_id": ai_request_id,
                    "error_type": ai_data.get("error_type", "unknown"),
                    "source": ai_data.get("metadata", {}).get("source", "engine"),
                    "provider": ai_data.get("metadata", {}).get("provider", "unknown"),
                    "model": ai_data.get("model", "unknown"),
                    "message": ai_data.get("error_message", "unknown error occurred")
                }
                self.repo.save_ai_error(ai_err_payload)

    def analyze_metadata_only(
        self,
        title: str,
        niche: str,
        channel_title: str,
        video_length: float,
        region: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Coordinates metadata-only analysis with topic intelligence.
        """
        raw_input = {
            "title": title,
            "category": niche,
            "channel_title": channel_title,
            "video_length": video_length
        }

        dna_profile = self.engine.analyze_channel(channel_title, raw_input)
        competitor_profile = self.engine.analyze_competitors(channel_title, title, niche, raw_input)
        topic_intel = self.get_topic_only(topic=title, region=region)

        return {
            "dna_profile": dna_profile,
            "competitor_profile": competitor_profile,
            "topic_intelligence": topic_intel
        }
