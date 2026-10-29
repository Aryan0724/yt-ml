"""
analyze.py

FastAPI router for creator analysis endpoints:
  - POST /analyze (Full multimodal packaging analysis with ML + Vision + Topic + Gemini)
  - POST /analyze-metadata (Metadata-only fast check)
  - POST /analyze-visual (Vision decoding test)
  - POST /topic and GET /topic (Standalone Topic Intelligence)
  - POST /compare (A/B testing multiple variants)
"""
import time
import uuid
import traceback
from typing import List, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query, Header

from schemas.analyze import (
    AnalysisResponse,
    MetadataOnlyResponse,
    CompareResponse,
    TopicResponse
)
from services.analysis.coordinator import AnalysisCoordinator
from services.vision.analyzer import VisionAnalyzerError

router = APIRouter()
coordinator = AnalysisCoordinator()


from core.idempotency import idempotency_manager
from services.storage.local import storage_provider
from services.usage.calculator import usage_calculator


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_endpoint(
    title: str = Form(...),
    niche: str = Form(...),
    sensitivity: str = Form("Balanced"),
    channel_title: str = Form("Unknown"),
    face_count: int = Form(0),
    brightness: float = Form(120.0),
    video_length: float = Form(600.0),
    upload_hour: int = Form(15),
    is_weekend: int = Form(0),
    region: Optional[str] = Form(None),
    include_topic: bool = Form(True),
    archetype: Optional[str] = Form(None),
    thumbnail: Optional[UploadFile] = File(None),
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key"),
    x_workspace_id: Optional[str] = Header(None, alias="X-Workspace-Id")
):
    """
    Primary endpoint for full thumbnail and metadata analysis.
    Protected by idempotency and usage accounting.
    """
    if idempotency_key:
        cached = idempotency_manager.get_cached_response(idempotency_key)
        if cached:
            return cached

    analysis_id = str(uuid.uuid4())
    start_time = time.time()
    workspace_id = x_workspace_id or str(uuid.uuid5(uuid.NAMESPACE_DNS, "preyt.workspace.default"))

    try:
        if thumbnail is None:
            raise HTTPException(status_code=400, detail="No thumbnail file uploaded.")

        image_bytes = await thumbnail.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Uploaded thumbnail file is empty.")

        storage_key = storage_provider.generate_thumbnail_key(workspace_id, extension="webp")
        storage_provider.save_file(image_bytes, storage_key)

        raw_input = {
            "title": title,
            "category": niche,
            "channel_title": channel_title,
            "video_length": video_length,
            "upload_hour": upload_hour,
            "is_weekend": is_weekend,
            "sensitivity": sensitivity,
            "archetype": archetype
        }

        try:
            result_data = coordinator.analyze_single(
                raw_input=raw_input,
                image_bytes=image_bytes,
                analysis_id=analysis_id,
                include_topic=include_topic,
                region=region,
                workspace_id=workspace_id,
                thumbnail_storage_key=storage_key
            )
        except VisionAnalyzerError as ve:
            raise HTTPException(status_code=400, detail=str(ve))

        processing_time = time.time() - start_time
        compute_ms = int(processing_time * 1000)

        ai_data = result_data.get("ai", {})
        topic_intel = result_data.get("topic_intelligence")
        has_trends_task = 1 if (topic_intel and topic_intel.get("status") == "success" and not topic_intel.get("cached")) else 0

        cost_breakdown = usage_calculator.calculate_analysis_cost(
            gemini_input_tokens=ai_data.get("input_tokens", 350),
            gemini_output_tokens=ai_data.get("output_tokens", 280),
            dataforseo_tasks=has_trends_task,
            compute_ms=compute_ms
        )

        usage_event = {
            "workspace_id": workspace_id,
            "analysis_id": analysis_id,
            "event_type": "analysis_package",
            **cost_breakdown
        }
        coordinator.repo.record_usage_event(usage_event)

        response_payload = {
            "status": "success",
            "data": result_data,
            "metadata": {
                "analysis_id": analysis_id,
                "processing_time": round(processing_time, 3),
                "engine_version": result_data.get("engine_version", "5.0.0")
            }
        }

        if idempotency_key:
            idempotency_manager.store_response(idempotency_key, response_payload)

        return response_payload
    except HTTPException as he:
        raise he
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An internal server error occurred during analysis.")


@router.post("/topic", response_model=TopicResponse)
async def get_topic_post(
    topic: str = Form(...),
    region: Optional[str] = Form(None),
    period: str = Form("12m")
):
    try:
        data = coordinator.get_topic_only(topic=topic, region=region, period=period)
        return {"status": "success", "data": data}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch topic intelligence: {e}")


@router.get("/topic", response_model=TopicResponse)
async def get_topic_get(
    q: str = Query(..., description="Topic keyword or title"),
    region: Optional[str] = Query(None, description="Country code (e.g. IN, US)"),
    period: str = Query("12m", description="Lookback window (e.g. 12m, 3m, 30d)")
):
    try:
        data = coordinator.get_topic_only(topic=q, region=region, period=period)
        return {"status": "success", "data": data}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch topic intelligence: {e}")


@router.post("/analyze-metadata", response_model=MetadataOnlyResponse)
async def analyze_metadata_only(
    title: str = Form(...),
    niche: str = Form(...),
    channel_title: str = Form("Unknown"),
    video_length: float = Form(600.0),
    region: Optional[str] = Form(None)
):
    try:
        result_data = coordinator.analyze_metadata_only(
            title=title,
            niche=niche,
            channel_title=channel_title,
            video_length=video_length,
            region=region
        )
        return {
            "status": "success",
            "data": result_data
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error analyzing metadata.")


@router.post("/analyze-visual")
async def analyze_visual_only(
    file: UploadFile = File(...)
):
    try:
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty file")

        try:
            visual_metrics = coordinator.vision.analyze(image_bytes)
        except VisionAnalyzerError as ve:
            raise HTTPException(status_code=400, detail=str(ve))

        return {
            "status": "success",
            "data": visual_metrics
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error during visual analysis.")


@router.post("/compare")
async def compare_variants(
    titles: List[str] = Form(...),
    files: List[UploadFile] = File(...)
):
    try:
        comparison_results = []
        for i, (title, file) in enumerate(zip(titles, files)):
            image_bytes = await file.read()
            if not image_bytes:
                continue

            analysis_id = str(uuid.uuid4())
            raw_input = {
                "title": title,
                "category": "Gaming",
                "channel_title": "Unknown",
                "video_length": 600,
                "upload_hour": 15,
                "is_weekend": 0
            }

            try:
                res = coordinator.analyze_single(
                    raw_input=raw_input,
                    image_bytes=image_bytes,
                    analysis_id=analysis_id,
                    include_topic=False
                )
            except VisionAnalyzerError:
                continue

            strengths = res.get("strengths", [])
            weaknesses = res.get("weaknesses", [])

            comparison_results.append({
                "index": i,
                "name": title,
                "score": res["score"],
                "tier": res["tier"],
                "strengths": strengths,
                "weaknesses": weaknesses,
                "improvements": res.get("improvements", []),
                "master_report": res.get("master_report", {}),
                "data": {
                    "brightness": res.get("factors", {}).get("brightness", 120.0)
                },
                "rank": 0
            })

        if comparison_results:
            winner = max(comparison_results, key=lambda x: x["score"])
        else:
            winner = None

        comparison_results.sort(key=lambda x: x["score"], reverse=True)
        for rank, res in enumerate(comparison_results):
            res["rank"] = rank + 1

        return {
            "status": "success",
            "winner": winner,
            "all_variants": comparison_results
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error comparing variants.")
