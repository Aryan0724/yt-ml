import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from core.retention_predictor import RetentionPredictor
from core.competitor_clash_engine import CompetitorClashEngine
from creator_intelligence_engine import CreatorIntelligenceEngine
import json

def test_retention():
    print("--- TESTING RETENTION PREDICTOR ---")
    predictor = RetentionPredictor()
    
    # Test 1: High Clickbait (Insane title, flat visual)
    title1 = "I survived 100 days of INSANE SECRETS in Minecraft!"
    vis1 = {"emotional_visibility_score": 10.0, "saturation_score": 20.0} # Flat
    res1 = predictor.analyze_retention_risk(title1, vis1)
    print("Test 1 (High Clickbait Risk):")
    print(json.dumps(res1, indent=2))
    
    # Test 2: Solid Match
    title2 = "Building a simple house"
    vis2 = {"emotional_visibility_score": 20.0, "saturation_score": 40.0}
    res2 = predictor.analyze_retention_risk(title2, vis2)
    print("\nTest 2 (Solid Match):")
    print(json.dumps(res2, indent=2))
    print()

def test_clash():
    print("--- TESTING COMPETITOR CLASH ENGINE ---")
    clash_engine = CompetitorClashEngine()
    
    # Test 1: Clashing with Gaming (Gaming default is Blue/Red)
    res1 = clash_engine.analyze_feed_clash("Gaming", "Warm Saturated Dominant", 80.0)
    print("Test 1 (Clash with Gaming Meta - expected True due to saturation):")
    print(json.dumps(res1, indent=2))
    
    # Test 2: Blending with Vlog (Vlog default is Warm/Yellow)
    res2 = clash_engine.analyze_feed_clash("Vlog", "Warm Saturated Dominant", 60.0)
    print("\nTest 2 (Blending with Vlog Meta - expected True due to color):")
    print(json.dumps(res2, indent=2))
    
    # Test 3: Popping Out (Tech, Cool colors vs Tech default Black/Neon)
    res3 = clash_engine.analyze_feed_clash("Tech", "Cool Saturated Dominant", 50.0)
    print("\nTest 3 (Popping out in Tech Meta - expected False):")
    print(json.dumps(res3, indent=2))
    print()

def test_full_engine():
    print("--- TESTING FULL ENGINE INTEGRATION ---")
    engine = CreatorIntelligenceEngine()
    
    raw_input = {
        "title": "INSANE CRAZY SECRET HACK EXPLOSION",
        "category": "Vlog",
        "channel_title": "Test Channel",
        "face_count": 1,
        "face_boxes": [[0.85, 0.05, 0.95, 0.15]], # Top right (clashes with Watch Later)
        "average_face_area_pct": 0,
        "emotional_visibility_score": 0.0,
        "clutter_level_rating": 5.0,
        "ocr_text": "CRAZY TEXT",
        "text_boxes": [[0.80, 0.80, 0.95, 0.95]], # Bottom right (clashes with timestamp)
        "text_density": 3,
        "mobile_readability": 40,
        "brightness": 80, # Dark
        "contrast": "low",
        "contrast_score": 40, # Low contrast
        "saturation": "high",
        "saturation_score": 90,
        "palette_desc": "Warm Saturated Dominant",
        "video_length": 600,
        "upload_hour": 15,
        "is_weekend": 0
    }
    
    result = engine.analyze_single(raw_input)
    print("Engine Score:", result["score"])
    print("Engine Tier:", result["tier"])
    print("Weaknesses Detected:")
    for w in result["weaknesses"]:
        print(f" - {w}")
    print("\n--- LLM MASTER REPORT ---")
    print(json.dumps(result.get("master_report", {}), indent=2))

if __name__ == "__main__":
    test_retention()
    test_clash()
    test_full_engine()
