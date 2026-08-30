"""
test_saas_core.py

Comprehensive Phase 6 Verification Test Suite for PreYT SaaS Core on Self-Hosted Infrastructure:
- 1. Configuration & Secrets Policy
- 2. Cryptographic Security (bcrypt, SHA-256 hashed tokens, JWT)
- 3. Rate Limiter (Sliding window & abuse prevention)
- 4. Storage Subsystem (Path traversal rejection & namespacing)
- 5. Versioned Economics & Unit Cost Calculator
- 6. EntitlementService & Plan Limits
- 7. Idempotency Key Manager
- 8. PostgresRepository & Decoupled Analysis Coordinator
"""

import os
import sys
import uuid
import time

# Ensure backend is in path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from core.config import settings
from core.security import (
    hash_password,
    verify_password,
    generate_secure_token,
    hash_token,
    create_access_token,
    decode_access_token
)
from core.rate_limit import RateLimiter
from core.pricing import CURRENT_PRICING_VERSION, get_pricing_card
from core.idempotency import IdempotencyManager
from services.storage.local import LocalStorageProvider
from services.usage.calculator import UsageCalculator
from services.billing.entitlements import EntitlementService, PLAN_ENTITLEMENTS
from repositories.postgres import PostgresRepository
from services.analysis.coordinator import AnalysisCoordinator


def test_1_config_and_secrets_policy():
    print("\n--- TEST 1: Configuration & Secrets Policy ---")
    repr_str = repr(settings)
    assert "password" not in repr_str.lower(), "Password leaked in settings repr!"
    assert "key" not in repr_str.lower(), "Secret key leaked in settings repr!"
    assert settings.DATABASE_URL.startswith("postgresql"), f"DATABASE_URL must be PostgreSQL: {settings.DATABASE_URL}"
    print("  [PASS] Secrets masked in logs and representation.")


def test_2_cryptographic_security():
    print("\n--- TEST 2: Cryptographic Security & Hashed Tokens ---")
    pwd = "super_creator_secret_pass_123"
    hashed = hash_password(pwd)
    assert hashed != pwd, "Password was not hashed!"
    assert verify_password(pwd, hashed) is True, "Password verification failed!"
    assert verify_password("wrong_password", hashed) is False, "Wrong password verified as true!"

    raw_token = generate_secure_token(32)
    hashed_token = hash_token(raw_token)
    assert len(hashed_token) == 64, "Token hash must be a 64-char hex SHA-256 string"
    assert hashed_token != raw_token, "Token was not hashed!"
    assert hash_token(raw_token) == hashed_token, "Deterministic hash check failed!"

    # JWT Access Token Minting & Decoding
    uid = str(uuid.uuid4())
    jwt_token = create_access_token(user_id=uid, email="creator@preyt.com")
    payload = decode_access_token(jwt_token)
    assert payload is not None, "Failed to decode minted JWT token"
    assert payload["sub"] == uid, f"Subject mismatch: {payload.get('sub')} != {uid}"
    assert payload["email"] == "creator@preyt.com"
    print("  [PASS] Cryptographic security & hashed token validation passed.")


def test_3_rate_limiting():
    print("\n--- TEST 3: Sliding-Window Rate Limiter ---")
    limiter = RateLimiter(redis_client=None)  # Memory fallback mode
    test_ip = "192.168.1.50"

    for i in range(5):
        allowed = limiter.check_login_rate_limit(test_ip)
        assert allowed is True, f"Attempt {i+1} should be allowed"

    blocked = limiter.check_login_rate_limit(test_ip)
    assert blocked is False, "6th attempt should be blocked by rate limit!"
    print("  [PASS] Rate limiter sliding-window check passed.")


def test_4_storage_subsystem():
    print("\n--- TEST 4: Isolated Storage Subsystem ---")
    storage = LocalStorageProvider(base_dir="./storage_test")
    ws_id = str(uuid.uuid4())

    key = storage.generate_thumbnail_key(ws_id, extension="webp")
    assert f"workspaces/{ws_id}/thumbnails/" in key, f"Unexpected key format: {key}"

    # Save mock file
    test_bytes = b"MOCK_WEBP_IMAGE_BYTES_12345"
    saved_key = storage.save_file(test_bytes, key)
    assert saved_key == key

    # Path traversal attack defense
    try:
        storage.save_file(test_bytes, "../../evil.exe")
        assert False, "Path traversal should have raised ValueError!"
    except ValueError:
        pass  # Expected

    # Cleanup
    storage.delete_file(key)
    print("  [PASS] Storage provider path isolation and traversal defense passed.")


def test_5_versioned_economics_calculator():
    print("\n--- TEST 5: Versioned Unit Economics Calculator ---")
    pricing = get_pricing_card(CURRENT_PRICING_VERSION)
    assert "gemini_input_per_million" in pricing
    assert "dataforseo_trends_per_task" in pricing

    cost_breakdown = UsageCalculator.calculate_analysis_cost(
        gemini_input_tokens=350,
        gemini_output_tokens=280,
        dataforseo_tasks=1,
        compute_ms=1200,
        pricing_version=CURRENT_PRICING_VERSION
    )

    assert cost_breakdown["pricing_version"] == CURRENT_PRICING_VERSION
    assert cost_breakdown["dataforseo_cost_usd"] == pricing["dataforseo_trends_per_task"]
    assert cost_breakdown["total_cost_usd"] > 0.011, f"Expected total cost > 0.011, got: {cost_breakdown['total_cost_usd']}"
    print(f"  Sample Analysis Cost Breakdown: ${cost_breakdown['total_cost_usd']} USD (DataForSEO: ${cost_breakdown['dataforseo_cost_usd']}, Gemini: ${cost_breakdown['gemini_cost_usd']})")
    print("  [PASS] Versioned economics calculations verified.")


def test_6_entitlement_service():
    print("\n--- TEST 6: Entitlement Service & Plan Limits ---")
    service = EntitlementService()
    free_limits = service.get_plan_limits("free")
    pro_limits = service.get_plan_limits("pro")
    studio_limits = service.get_plan_limits("studio")

    assert free_limits["monthly_analyses"] == 10
    assert pro_limits["monthly_analyses"] == 100
    assert studio_limits["monthly_analyses"] == 500

    assert service.can_use_feature("free", "can_connect_youtube") is False
    assert service.can_use_feature("pro", "can_connect_youtube") is True
    print("  [PASS] Plan entitlements & limits verified.")


def test_7_idempotency():
    print("\n--- TEST 7: Idempotency Manager ---")
    mgr = IdempotencyManager()
    key = str(uuid.uuid4())

    assert mgr.get_cached_response(key) is None

    mock_resp = {"status": "success", "analysis_id": "test_123", "score": 85}
    mgr.store_response(key, mock_resp, expire_seconds=300)

    cached = mgr.get_cached_response(key)
    assert cached is not None
    assert cached["analysis_id"] == "test_123"
    assert cached["score"] == 85
    print("  [PASS] Request idempotency caching verified.")


def test_8_postgres_repository_and_coordinator():
    print("\n--- TEST 8: PostgresRepository & Decoupled Coordinator ---")
    repo = PostgresRepository(sync_db_url=None)  # Memory fallback mode
    coordinator = AnalysisCoordinator(repo=repo)

    ws_id = str(uuid.uuid4())
    analysis_id = str(uuid.uuid4())

    raw_input = {
        "title": "Autonomous AI Agents Running Real Businesses",
        "category": "Tech",
        "channel_title": "AI Innovator",
        "video_length": 600.0,
        "upload_hour": 15,
        "is_weekend": 0,
        "sensitivity": "Balanced"
    }

    result = coordinator.analyze_single(
        raw_input=raw_input,
        image_bytes=None,
        analysis_id=analysis_id,
        include_topic=False,
        workspace_id=ws_id,
        thumbnail_storage_key=f"workspaces/{ws_id}/thumbnails/mock.webp"
    )

    assert "score" in result
    assert "tier" in result
    assert "master_report" in result

    # Check persistence in repo
    saved = repo.get_analysis(analysis_id, ws_id)
    assert saved is not None, "Analysis not saved in repository!"
    assert saved["title"] == raw_input["title"]
    print("  [PASS] Full analysis pipeline executed and persisted via PostgresRepository without Supabase.")


if __name__ == "__main__":
    test_1_config_and_secrets_policy()
    test_2_cryptographic_security()
    test_3_rate_limiting()
    test_4_storage_subsystem()
    test_5_versioned_economics_calculator()
    test_6_entitlement_service()
    test_7_idempotency()
    test_8_postgres_repository_and_coordinator()

    print("\n=======================================================")
    print(" ALL 8 PHASE 6 SAAS CORE TEST SUITES PASSED (100%) ")
    print("=======================================================\n")
