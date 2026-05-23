from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
import time

# Import our engine modules
from creator_intelligence_engine import CreatorIntelligenceEngine

app = FastAPI(
    title="Diamond Intelligence API",
    description="Professional Creator Decision Intelligence Engine",
    version="1.1.0"
)

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = CreatorIntelligenceEngine()

class AnalysisRequest(BaseModel):
    title: str
    niche: str
    sensitivity: Optional[str] = "Balanced"

@app.get("/")
async def health_check():
    return {"status": "operational", "engine": "V4.1-ENSEMBLE", "timestamp": time.time()}

@app.post("/analyze")
async def analyze_metadata(
    title: str = Form(...),
    niche: str = Form(...),
    sensitivity: str = Form("Balanced"),
    channel_title: str = Form("Unknown"),
    face_count: int = Form(0),
    brightness: float = Form(120.0),
    video_length: float = Form(600.0),
    upload_hour: int = Form(15),
    is_weekend: int = Form(0),
    thumbnail: Optional[UploadFile] = File(None)
):
    try:
        if thumbnail is None:
            raise HTTPException(status_code=400, detail="No thumbnail file uploaded.")
        
        contents = await thumbnail.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Uploaded thumbnail file is empty.")
            
        import numpy as np
        import cv2
        from PIL import Image
        import io
        from core.visual_analyzer import analyze_image
        
        try:
            # Decode using Pillow which supports many more formats (WebP, etc.)
            pil_image = Image.open(io.BytesIO(contents)).convert('RGB')
            # Convert RGB to BGR for OpenCV
            img = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        except Exception as e:
            # Fallback to OpenCV native decode if Pillow fails
            nparr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                raise HTTPException(status_code=400, detail=f"Failed to decode image format. Ensure it's a valid JPG, PNG, or WEBP. File size: {len(contents)} bytes. Decode error: {str(e)}")
            
        visual_metrics = analyze_image(img)
        
        # Construct raw inputs for the ensemble engine using real metrics
        raw_input = {
            "title": title,
            "category": niche,
            "channel_title": channel_title,
            "face_count": visual_metrics["face_count"],
            "face_boxes": visual_metrics["face_boxes"],
            "average_face_area_pct": visual_metrics["average_face_area_pct"],
            "emotional_visibility_score": visual_metrics["emotional_visibility_score"],
            "clutter_level_rating": visual_metrics["clutter_level_rating"],
            "ocr_text": visual_metrics["ocr_text"],
            "text_density": visual_metrics["text_density"],
            "mobile_readability": visual_metrics["mobile_readability"],
            "brightness": visual_metrics["brightness"],
            "contrast": visual_metrics["contrast"],
            "contrast_score": visual_metrics["contrast_score"],
            "saturation": visual_metrics["saturation"],
            "saturation_score": visual_metrics["saturation_score"],
            "palette_desc": visual_metrics["palette_desc"],
            "video_length": video_length,
            "upload_hour": upload_hour,
            "is_weekend": is_weekend
        }
        results = engine.analyze_single(raw_input)
        
        # Include raw debug metrics in response if needed
        return {
            "status": "success",
            "data": results,
            "metadata": {
                "processing_time": 0.8,
                "engine_version": results.get("engine_version", "1.1.0")
            }
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare")
async def compare_variants(
    variants: List[AnalysisRequest]
):
    try:
        # Simplified comparison logic for the SaaS API
        comparison_results = []
        for v in variants:
            raw_input = {
                "title": v.title,
                "category": v.niche,
                "face_count": 0,
                "brightness": 120
            }
            res = engine.analyze_single(raw_input)
            comparison_results.append({
                "title": v.title,
                "score": res["score"],
                "tier": res["tier"]
            })
        
        # Identify the winner
        winner = max(comparison_results, key=lambda x: x["score"])
        
        return {
            "status": "success",
            "winner": winner,
            "all_variants": comparison_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
