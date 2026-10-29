import sys
import os
import json

# Add backend directory to sys.path
backend_dir = r"C:\Users\gaurav kumar pandey\.gemini\antigravity\scratch\yt-ml\backend"
sys.path.insert(0, backend_dir)

print("=== 1. TESTING ARCHETYPES ===")
from core.archetypes import (
    PackagingArchetype,
    detect_archetype_from_metadata,
    ArchetypeEvaluator
)

# Test detection
doc_arch = detect_archetype_from_metadata("Documentary", "The Rise and Fall of Enron", {})
print(f"Detected: {doc_arch.value} (Expected: FACELESS_DOCUMENTARY)")
assert doc_arch == PackagingArchetype.FACELESS_DOCUMENTARY

cook_arch = detect_archetype_from_metadata("Cooking", "How to make ramen", {})
print(f"Detected: {cook_arch.value} (Expected: COOKING_CULINARY)")
assert cook_arch == PackagingArchetype.COOKING_CULINARY

# Test evaluation for faceless channel with 0 faces (should NOT be penalized!)
faceless_input = {
    "face_count": 0,
    "contrast_score": 75.0,
    "clutter_level_rating": 4.0,
    "title": "The Secret Behind the Global Chip Shortage"
}
adj, strn, weak, recs = ArchetypeEvaluator.evaluate(PackagingArchetype.FACELESS_DOCUMENTARY, faceless_input)
print(f"Faceless Score Adj: {adj} (Expected: positive boost)")
print(f"Faceless Strengths: {strn}")
assert adj > 0

# Test evaluation for cooking channel with warm colors
cooking_input = {
    "face_count": 0,
    "warmth_score": 18.0,
    "text_density": 5.0,
    "title": "Crispiest Japanese Fried Chicken"
}
adj_c, strn_c, weak_c, recs_c = ArchetypeEvaluator.evaluate(PackagingArchetype.COOKING_CULINARY, cooking_input)
print(f"Cooking Score Adj: {adj_c} (Expected: positive boost)")
assert adj_c > 0

print("\n=== 2. TESTING CLOSED-LOOP FEEDBACK ENGINE ===")
from core.feedback_loop import feedback_engine

# Scenario 1: Exact Calibration (Predicted 84, Actual 48h views 140k vs 85k baseline)
eval1 = feedback_engine.evaluate_outcome(
    predicted_score=84.0,
    predicted_tier="A",
    actual_views_48h=140000,
    channel_baseline_views=85000,
    actual_ctr_pct=8.4
)
print("Scenario 1 Outcome:")
print(f"  Predicted: {eval1['predicted_score']} ({eval1['predicted_tier']})")
print(f"  Actual: {eval1['actual_score']} ({eval1['actual_tier']})")
print(f"  Delta: {eval1['delta']}")
print(f"  Status: {eval1['accuracy_status']}")
print(f"  New Calibration Factor: {eval1['updated_calibration_factor']}")
assert eval1['accuracy_status'] == "EXACT_CALIBRATION"

# Scenario 2: Overpredicted Flop (Early retention drop)
eval2 = feedback_engine.evaluate_outcome(
    predicted_score=85.0,
    predicted_tier="S",
    actual_views_48h=25000,
    channel_baseline_views=80000,
    actual_ctr_pct=3.2,
    retention_30s_pct=34.0
)
print("Scenario 2 Outcome (Early Retention Flop):")
print(f"  Predicted: {eval2['predicted_score']} -> Actual: {eval2['actual_score']}")
print(f"  Delta: {eval2['delta']}")
print(f"  Diagnosis: {eval2['causal_diagnosis']}")
print(f"  Adjusted Multiplier: {eval2['updated_calibration_factor']} (Expected < 1.0)")
assert eval2['updated_calibration_factor'] < 1.0

print("\n=== 3. TESTING CREATOR INTELLIGENCE ENGINE ===")
from creator_intelligence_engine import CreatorIntelligenceEngine
engine = CreatorIntelligenceEngine()

test_payload = {
    "title": "The Secret Formula That Created Apple",
    "category": "Documentary",
    "channel_title": "Visual Economics",
    "archetype": "FACELESS_DOCUMENTARY",
    "face_count": 0,
    "face_boxes": [],
    "brightness": 125,
    "contrast": "high",
    "contrast_score": 80,
    "saturation": "medium",
    "saturation_score": 60,
    "warmth_score": 5.0,
    "clutter_level_rating": 3.5,
    "text_density": 8,
    "mobile_readability": 85,
    "video_length": 900,
    "upload_hour": 16,
    "is_weekend": 0
}

res = engine.analyze_single(test_payload)
print(f"Engine Version: {res['engine_version']}")
print(f"Score: {res['score']}/100 (Tier: {res['tier']})")
print(f"Archetype Detected: {res['archetype']['name']}")
print(f"Strengths: {len(res['strengths'])} items")
print(f"Weaknesses: {len(res['weaknesses'])} items")

print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
