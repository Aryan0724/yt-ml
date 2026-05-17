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
    thumbnail: Optional[UploadFile] = File(None)
):
    try:
        # Construct raw inputs for the ensemble engine
        raw_input = {
            "title": title,
            "category": niche,
            "face_count": 0,
            "brightness": 120
        }
        results = engine.analyze_single(raw_input)
        
        return {
            "status": "success",
            "data": results,
            "metadata": {
                "processing_time": 0.8,
                "engine_version": results.get("engine_version", "1.1.0")
            }
        }
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
