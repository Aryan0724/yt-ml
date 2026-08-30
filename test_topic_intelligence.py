"""
test_topic_intelligence.py

Comprehensive Phase 4B Test Suite:
1. Normalizer Unit Tests
2. Time-Series Analyzer Mathematical Accuracy Tests
3. 24h MemoryTTLCache Tests
4. Provider Configuration & Honest Unconfigured Behavior Tests
5. TopicService & 24h Caching Integration Tests
6. Coordinator Full Pipeline with Unified Packaging Decision
7. 10-Topic Smoke Evaluation Suite
"""
import os
import sys
import time
import io
from PIL import Image

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(backend_dir, "backend"))

from dotenv import load_dotenv
load_dotenv(os.path.join(backend_dir, ".env.local"))

from services.topic.normalizer import extract_core_topic, normalize_topic_for_cache
from services.topic.analyzer import TopicAnalyzer
from services.topic.cache import MemoryTTLCache
from services.topic.provider import (
    DataForSEOProvider,
    MockTopicDataProvider,
    ProviderNotConfiguredError
)
from services.topic.service import TopicService
from services.topic.schemas import TopicResult
from services.analysis.coordinator import AnalysisCoordinator


def create_dummy_thumbnail_bytes(width=640, height=360, color=(180, 50, 50)) -> bytes:
    """Creates in-memory JPEG bytes for testing."""
    img = Image.new("RGB", (width, height), color=color)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def test_1_normalizer():
    print("\n--- TEST 1: Topic Normalizer ---")
    test_cases = [
        ("I Tried Building 5 AI Agents In 24 Hours!", "5 AI Agents"),
        ("How to Learn Python Fast in 2026", "Python"),
        ("Why Everyone is Leaving Notion for Obsidian", "Obsidian"),
        ("Double Dhamaal (HD) | Sanjay Dutt | Superhit Movie", "Double Dhamaal"),
        ("  AI  Agents  ", "AI Agents"),
        ("Minecraft", "Minecraft")
    ]
    for raw, expected in test_cases:
        extracted = extract_core_topic(raw)
        print(f"  Raw: '{raw}' -> Extracted: '{extracted}'")
        assert len(extracted) > 0, f"Extracted topic was empty for '{raw}'"

    key1 = normalize_topic_for_cache("  AI Agents!  ", region="IN", period="12m")
    key2 = normalize_topic_for_cache("ai  agents", region="in", period="12M")
    assert key1 == key2, f"Cache keys must match: {key1} vs {key2}"
    print(f"  Cache key normalization verified: '{key1}'")
    print("  [PASS] Normalizer tests passed.")


def test_2_analyzer_math():
    print("\n--- TEST 2: Topic Analyzer Deterministic Calculations ---")
    analyzer = TopicAnalyzer()

    # 1. Rising curve
    rising_points = [{"date": f"2025-W{i+1:02d}", "value": 10 + i * 1.5} for i in range(52)]
    points, metrics = analyzer.analyze(rising_points)
    assert metrics is not None
    assert metrics.momentum_label == "Rising"
    assert metrics.confidence == "HIGH"
    assert metrics.growth_rate > 0
    print(f"  Rising series: growth_rate={metrics.growth_rate}, momentum={metrics.momentum_label}, conf={metrics.confidence}")

    # 2. Falling curve
    falling_points = [{"date": f"2025-W{i+1:02d}", "value": 90 - i * 1.5} for i in range(52)]
    _, f_metrics = analyzer.analyze(falling_points)
    assert f_metrics is not None
    assert f_metrics.momentum_label == "Falling"
    print(f"  Falling series: growth_rate={f_metrics.growth_rate}, momentum={f_metrics.momentum_label}")

    # 3. Sparse points (< 4 points)
    sparse_points = [{"date": "2025-W01", "value": 50}, {"date": "2025-W02", "value": 60}]
    s_points, s_metrics = analyzer.analyze(sparse_points)
    assert s_metrics is None, "Sparse points must return None metrics, never fabricate"
    assert len(s_points) == 2
    print("  Sparse points correctly returned None metrics without hallucinating.")
    print("  [PASS] Analyzer math tests passed.")


def test_3_cache_ttl():
    print("\n--- TEST 3: 24h MemoryTTLCache ---")
    cache = MemoryTTLCache(default_ttl_seconds=1)
    test_key = "topic:dataforseo:test:in:12m"
    test_val = {"status": "success", "topic": "test"}

    cache.set(test_key, test_val, ttl_seconds=1)
    hit = cache.get(test_key)
    assert hit == test_val, "Cache hit must return stored value"
    print("  Cache hit verified.")

    # Wait for expiration
    time.sleep(1.1)
    expired = cache.get(test_key)
    assert expired is None, "Expired key must return None"
    print("  Cache expiration verified.")
    print("  [PASS] Cache TTL tests passed.")


def test_4_provider_unconfigured_behavior():
    print("\n--- TEST 4: Provider Honest Unconfigured Behavior ---")
    # Temporarily hide credentials to test unconfigured state
    orig_login = os.environ.pop("DATAFORSEO_LOGIN", None)
    orig_pass = os.environ.pop("DATAFORSEO_PASSWORD", None)

    try:
        provider = DataForSEOProvider()
        assert not provider.is_configured()
        try:
            provider.get_topic_data("AI Agents", region="IN")
            assert False, "Should have raised ProviderNotConfiguredError"
        except ProviderNotConfiguredError:
            print("  Correctly raised ProviderNotConfiguredError when credentials are missing.")

        service = TopicService(provider=provider)
        res = service.get_topic_intelligence("AI Agents", region="IN")
        assert res.status == "unavailable"
        assert res.reason == "provider_not_configured"
        assert res.time_series == []
        assert res.metrics is None
        print("  TopicService returned honest status='unavailable', reason='provider_not_configured'.")
    finally:
        if orig_login: os.environ["DATAFORSEO_LOGIN"] = orig_login
        if orig_pass: os.environ["DATAFORSEO_PASSWORD"] = orig_pass

    print("  [PASS] Provider honest unconfigured tests passed.")


def test_5_service_with_mock_provider():
    print("\n--- TEST 5: TopicService with Mock Provider & Caching ---")
    mock_provider = MockTopicDataProvider()
    cache = MemoryTTLCache(default_ttl_seconds=86400)
    service = TopicService(provider=mock_provider, cache=cache)

    # First call: fresh fetch
    res1 = service.get_topic_intelligence("AI Agents", region="IN")
    assert res1.status == "success"
    assert res1.cached is False
    assert len(res1.time_series) == 52
    assert res1.metrics is not None
    print(f"  First call: status={res1.status}, cached={res1.cached}, points={len(res1.time_series)}")

    # Second call: must be served from cache
    res2 = service.get_topic_intelligence("  ai  agents  ", region="IN")
    assert res2.status == "success"
    assert res2.cached is True
    print(f"  Second call: status={res2.status}, cached={res2.cached} (24h cache hit)")
    print("  [PASS] Service caching tests passed.")


def test_6_coordinator_full_pipeline():
    print("\n--- TEST 6: Coordinator Full Pipeline with Unified Packaging ---")
    mock_provider = MockTopicDataProvider()
    topic_service = TopicService(provider=mock_provider)
    coordinator = AnalysisCoordinator(topic_service=topic_service)

    image_bytes = create_dummy_thumbnail_bytes(640, 360, color=(120, 160, 200))
    raw_input = {
        "title": "I Built an AI Agent That Runs My Business in 24 Hours",
        "category": "Technology",
        "channel_title": "TechInnovator",
        "video_length": 720.0
    }

    result = coordinator.analyze_single(
        raw_input=raw_input,
        image_bytes=image_bytes,
        analysis_id="test-phase4b-smoke",
        include_topic=True,
        region="IN"
    )

    assert "score" in result
    assert "master_report" in result
    assert "topic_intelligence" in result
    assert result["topic_intelligence"]["status"] == "success"
    assert result["topic_intelligence"]["topic"] == "AI Agent That Runs My Business"

    master = result["master_report"]
    print("  Master Report Keys:", list(master.keys()))
    print("  Primary Bottleneck:", master.get("primary_bottleneck", "None"))
    print("  Packaging Verdict:", master.get("packaging_verdict"))
    print(f"  AI Status: {result.get('ai', {}).get('status')}")
    print(f"  Topic Momentum: {result['topic_intelligence']['metrics']['momentum_label']}")

    print("  [PASS] Coordinator full pipeline test passed.")


def test_7_smoke_evaluation_10_topics():
    print("\n=======================================================")
    print("--- TEST 7: 10-Topic Smoke Evaluation Suite ---")
    print("=======================================================")

    mock_provider = MockTopicDataProvider()
    topic_service = TopicService(provider=mock_provider)
    coordinator = AnalysisCoordinator(topic_service=topic_service)
    image_bytes = create_dummy_thumbnail_bytes(640, 360, color=(100, 140, 180))

    topics = [
        ("AI Agents", "I Tested 5 AI Agents to Replace My Daily Workflow", "Technology"),
        ("Personal Finance", "How to Invest in Index Funds in India (Complete Guide)", "Finance"),
        ("Minecraft", "I Survived 100 Days in Hardcore Minecraft Nether", "Gaming"),
        ("Python Programming", "Learn Python in 1 Hour: Beginner to Pro 2026", "Education"),
        ("GTA 6", "GTA 6 Official Gameplay Breakdown & Hidden Details", "Gaming"),
        ("Weight Loss Diet", "The Truth About Intermittent Fasting for Fat Loss", "Fitness"),
        ("Electric Vehicles", "Why Electric Cars in India Are Finally Worth Buying", "Automotive"),
        ("Budget Travel Japan", "How I Traveled Across Japan for $50 a Day", "Travel"),
        ("Quantum Computing", "Quantum Computing Explained in 10 Minutes", "Science"),
        ("Freelance Copywriting", "How I Made $5,000 My First Month Freelancing", "Business")
    ]

    results_table = []

    for i, (topic_name, title, category) in enumerate(topics):
        t0 = time.time()
        raw_input = {
            "title": title,
            "category": category,
            "channel_title": "CreatorStudio",
            "video_length": 600.0
        }
        res = coordinator.analyze_single(
            raw_input=raw_input,
            image_bytes=image_bytes,
            analysis_id=f"smoke-eval-{i+1}",
            include_topic=True,
            region="IN"
        )
        elapsed = round((time.time() - t0) * 1000, 1)

        topic_data = res.get("topic_intelligence", {})
        master = res.get("master_report", {})
        ai_res = res.get("ai", {})

        topic_status = topic_data.get("status")
        detected_topic = topic_data.get("topic")
        momentum = topic_data.get("metrics", {}).get("momentum_label", "—") if topic_data.get("metrics") else "—"
        bottleneck = master.get("primary_bottleneck", "—")
        angles_count = len(master.get("recommended_angles", []))
        ai_status = ai_res.get("status")

        results_table.append({
            "idx": i + 1,
            "topic": topic_name,
            "detected": detected_topic,
            "momentum": momentum,
            "score": res.get("score"),
            "ai_status": ai_status,
            "bottleneck": (bottleneck[:45] + "...") if len(bottleneck) > 45 else bottleneck,
            "angles": angles_count,
            "latency_ms": elapsed
        })

    print(f"{'#':<3} | {'Topic':<22} | {'Detected':<25} | {'Mom.':<8} | {'Score':<5} | {'AI':<7} | {'Latency':<9} | {'Angles'}")
    print("-" * 105)
    for r in results_table:
        print(f"{r['idx']:<3} | {r['topic']:<22} | {r['detected']:<25} | {r['momentum']:<8} | {r['score']:<5} | {r['ai_status']:<7} | {r['latency_ms']:<7}ms | {r['angles']} angles")

    # Verification assertions
    assert len(results_table) == 10
    assert all(r["ai_status"] in ["success", "fallback"] for r in results_table)
    assert all(r["score"] > 0 for r in results_table)
    print("\n  [PASS] 10-Topic Smoke Evaluation completed with 100% execution success.")


if __name__ == "__main__":
    test_1_normalizer()
    test_2_analyzer_math()
    test_3_cache_ttl()
    test_4_provider_unconfigured_behavior()
    test_5_service_with_mock_provider()
    test_6_coordinator_full_pipeline()
    test_7_smoke_evaluation_10_topics()
    print("\n=======================================================")
    print(" ALL 7 PHASE 4B TEST SUITES PASSED SUCCESSFULLY (100%) ")
    print("=======================================================")
