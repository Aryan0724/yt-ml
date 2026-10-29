"""
scratch/test_format_native_intelligence.py

Verifies:
1. Format-Native OpenCV Archetype Pipelines
2. Perceptual Hashing (pHash) & Thumbnail Similarity Originality Engine
3. Outlier Detector Data Flow
"""
import sys
import os
import numpy as np
import cv2

# Add backend directory to sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
sys.path.append(backend_dir)

from core.archetype_feature_extractor import ArchetypeFeatureExtractor
from services.outlier.similarity import ThumbnailSimilarityChecker
from services.outlier.detector import OutlierDetector


def test_archetype_pipelines():
    print("\n--- 1. Testing Format-Native Archetype OpenCV Pipelines ---")
    
    # Create test image: 1280x720 dummy canvas
    img = np.zeros((720, 1280, 3), dtype=np.uint8)
    # Warm amber circle in center (cooking/food test)
    cv2.circle(img, (640, 360), 200, (30, 120, 220), -1)

    archetypes_to_test = [
        "FACELESS_DOCUMENTARY",
        "COOKING_CULINARY",
        "GAMING_ESPORTS",
        "TECH_PRODUCT_REVIEW",
        "CARTOON_ANIMATION",
        "FACE_DRIVEN_CREATOR",
        "GENERAL_HYBRID"
    ]

    base_features = {
        "contrast_score": 65.0,
        "saturation_score": 70.0,
        "face_count": 0,
        "text_density": 5.0
    }

    for arch in archetypes_to_test:
        result = ArchetypeFeatureExtractor.extract(arch, img, base_features)
        assert "archetype_features" in result, f"Missing features for {arch}"
        assert "archetype_score" in result, f"Missing score for {arch}"
        print(f"  [OK] {arch:<25} -> score_adj: {result['archetype_score']:+5.1f} | features: {list(result['archetype_features'].keys())[:2]}")


def test_similarity_and_phash():
    print("\n--- 2. Testing pHash & Thumbnail Similarity Checker ---")
    checker = ThumbnailSimilarityChecker()

    # Generate test image bytes
    img = np.zeros((720, 1280, 3), dtype=np.uint8)
    # Draw neon gaming style: dark BG + cyan/magenta bars
    img[:, :] = (15, 10, 10)
    cv2.rectangle(img, (200, 100), (500, 600), (255, 0, 200), -1) # Magenta
    cv2.rectangle(img, (700, 100), (1000, 600), (255, 255, 0), -1) # Cyan
    _, enc = cv2.imencode(".png", img)
    image_bytes = enc.tobytes()

    phash = checker.compute_phash(img)
    assert len(phash) == 64, f"Expected 64-bit hash, got {len(phash)}"
    print(f"  [OK] Computed 64-bit pHash: {phash[:16]}... (length={len(phash)})")

    result = checker.check_originality(image_bytes, niche="gaming", archetype="GAMING_ESPORTS")
    assert "originality_score" in result
    assert "similarity_risk" in result
    print(f"  [OK] Originality Score: {result['originality_score']}/100")
    print(f"  [OK] Risk Rating:       {result['similarity_risk']}")
    print(f"  [OK] Detected Formula:  {result['detected_formula']}")


def test_outlier_benchmark_detector():
    print("\n--- 3. Testing Outlier Detector Benchmark Flow ---")
    detector = OutlierDetector(api_key="") # Demo / benchmark mode
    import asyncio

    async def run_scan():
        data = await detector.scan_niche("cooking", limit=5)
        assert data["niche"] == "cooking"
        assert len(data["outliers"]) > 0
        top = data["outliers"][0]
        print(f"  [OK] Top Outlier in Cooking: '{top['title']}' ({top['outlier_ratio']}x average views)")
        print(f"  [OK] Dominant Formulas: {data['top_formats'][0]}")

    asyncio.run(run_scan())


if __name__ == "__main__":
    test_archetype_pipelines()
    test_similarity_and_phash()
    test_outlier_benchmark_detector()
    print("\n>>> ALL FORMAT-NATIVE INTELLIGENCE & OUTLIER TESTS PASSED SUCCESSFULLY! <<<\n")
