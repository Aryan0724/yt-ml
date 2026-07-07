# -*- coding: utf-8 -*-
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import requests
import json
import sys
import os

# Add backend for cv2/numpy
BACKEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
sys.path.insert(0, BACKEND_DIR)

import numpy as np
import cv2

BASE = "http://127.0.0.1:8000"
NEXTJS = "http://localhost:3000"

def separator(title):
    print("\n" + "="*60)
    print("  " + title)
    print("="*60)

def ok(msg, detail=""): print(f"  [OK]   {msg}" + (f" -- {detail}" if detail else ""))
def fail(msg, detail=""): print(f"  [!!]   {msg}" + (f" -- {detail}" if detail else ""))
def info(msg, detail=""): print(f"  [-->]  {msg}" + (f" -- {detail}" if detail else ""))

passed = 0
failed = 0

# ─────────────────────────────────────────────────────────
# 1. HEALTH CHECK
# ─────────────────────────────────────────────────────────
separator("API TEST 1: FastAPI Health + Next.js Health")
try:
    r = requests.get(f"{BASE}/", timeout=5)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "operational"
    ok("FastAPI /health returns 200", f"engine={data.get('engine')}")
    passed += 1
except Exception as e:
    fail("FastAPI health check failed", str(e))
    failed += 1

try:
    r = requests.get(NEXTJS, timeout=5)
    assert r.status_code == 200
    ok("Next.js app returns 200")
    passed += 1
except Exception as e:
    fail("Next.js health check failed", str(e))
    failed += 1

# ─────────────────────────────────────────────────────────
# 2. /compare ENDPOINT — 3-WAY A/B/C TEST
# ─────────────────────────────────────────────────────────
separator("API TEST 2: /compare endpoint — 3-way title A/B/C")
COMPARE_CASES = [
    {"title": "I Survived 100 Days in the Desert [INSANE CHALLENGE]", "niche": "Entertainment", "sensitivity": "Balanced"},
    {"title": "my daily vlog ep 3", "niche": "People & Blogs", "sensitivity": "Balanced"},
    {"title": "Why EVERY Expert is WRONG About This SECRET?", "niche": "Science & Technology", "sensitivity": "Balanced"},
]
try:
    r = requests.post(f"{BASE}/compare", json=COMPARE_CASES, timeout=10)
    assert r.status_code == 200, f"HTTP {r.status_code}: {r.text[:100]}"
    data = r.json()
    assert data["status"] == "success"
    winner = data["winner"]
    variants = data["all_variants"]
    
    info("All variants scored:")
    for v in variants:
        info(f"  [{v['tier']}] {v['score']:>3}pts  {v['title'][:55]}")
    
    ok(f"/compare returns winner correctly", f"'{winner['title'][:50]}' score={winner['score']}")
    
    # Verify the boring vlog is NOT the winner
    boring_is_winner = "vlog" in winner.get("title", "").lower()
    if not boring_is_winner:
        ok("Boring vlog is NOT the winner", "correct ordering")
        passed += 1
    else:
        fail("Boring vlog incorrectly won A/B test")
        failed += 1
    passed += 1
except Exception as e:
    fail("/compare test failed", str(e))
    failed += 1

# ─────────────────────────────────────────────────────────
# 3. /analyze — SYNTHETIC THUMBNAIL (HIGH CTR)
# ─────────────────────────────────────────────────────────
separator("API TEST 3: /analyze — High-CTR Programmatic Thumbnail")
def make_thumbnail(brightness=180, has_text=True, dark_bg=False):
    img = np.zeros((720, 1280, 3), dtype=np.uint8)
    bg_color = (10, 5, 30) if dark_bg else (50, 30, 100)
    img[:] = bg_color
    # Bright central circle (subject)
    cv2.circle(img, (640, 360), 230, (brightness, int(brightness*0.8), 50), -1)
    # Glow effect
    cv2.circle(img, (640, 360), 260, (int(brightness*0.4), int(brightness*0.3), 20), 20)
    if has_text:
        cv2.putText(img, "100 DAYS", (310, 220), cv2.FONT_HERSHEY_SIMPLEX, 3.5, (255,255,255), 9, cv2.LINE_AA)
        cv2.putText(img, "DESERT SURVIVAL", (180, 580), cv2.FONT_HERSHEY_SIMPLEX, 2.0, (0,255,200), 6, cv2.LINE_AA)
    return cv2.imencode(".jpg", img)[1].tobytes()

thumb_bytes = make_thumbnail(brightness=200, has_text=True)
files = {"thumbnail": ("thumb.jpg", thumb_bytes, "image/jpeg")}
data_form = {
    "title": "I Survived 100 Days in the Desert [INSANE CHALLENGE]",
    "niche": "Entertainment",
    "channel_title": "MrBeast",
    "video_length": "720",
    "upload_hour": "15",
    "is_weekend": "0"
}
try:
    r = requests.post(f"{BASE}/analyze", files=files, data=data_form, timeout=30)
    assert r.status_code == 200, f"HTTP {r.status_code}: {r.text[:200]}"
    d = r.json()
    assert d["status"] == "success"
    result = d["data"]
    
    info(f"Score: {result['score']} | Tier: {result['tier']} | Confidence: {result['confidence']}")
    info(f"Breakout: {result['safe_vs_breakout']['breakout_score']} | Safe: {result['safe_vs_breakout']['safe_score']}")
    info(f"Face detected: {result['debug']['face_detected']} (count={result['debug']['face_count']})")
    info(f"OCR text: '{result['debug']['ocr_text']}'")
    info(f"Brightness: {result['debug']['brightness']}")
    
    print()
    info("Strengths:")
    for s in result.get("strengths", [])[:3]:
        print(f"       + {s}")
    info("Improvements:")
    for imp in result.get("improvements", [])[:4]:
        print(f"       [{imp.get('tier','?')}] {imp.get('title','?')} -> {imp.get('improvement','?')}")
    
    score_ok = 0 <= result["score"] <= 100
    ok("Score in valid range [0,100]", f"score={result['score']}") if score_ok else fail("Score out of range")
    passed += (1 if score_ok else 0)
    failed += (0 if score_ok else 1)
    
    has_fields = all(k in result for k in ["score", "tier", "confidence", "improvements", "channel_dna", "safe_vs_breakout", "debug"])
    ok("All expected fields present in response") if has_fields else fail("Missing fields in response")
    passed += (1 if has_fields else 0)
    failed += (0 if has_fields else 1)
except Exception as e:
    fail("/analyze high-CTR test failed", str(e))
    failed += 1

# ─────────────────────────────────────────────────────────
# 4. /analyze — DARK/LOW-CONTRAST THUMBNAIL (should flag issues)
# ─────────────────────────────────────────────────────────
separator("API TEST 4: /analyze — Dark/Low-CTR Thumbnail (should flag weaknesses)")
dark_bytes = make_thumbnail(brightness=40, has_text=False, dark_bg=True)
files2 = {"thumbnail": ("dark.jpg", dark_bytes, "image/jpeg")}
data_form2 = {
    "title": "ep 3",
    "niche": "People & Blogs",
    "channel_title": "SmallCreatorXYZ123",
    "video_length": "180",
    "upload_hour": "3",
    "is_weekend": "0"
}
try:
    r = requests.post(f"{BASE}/analyze", files=files2, data=data_form2, timeout=30)
    d = r.json()
    result2 = d["data"]
    
    info(f"Score: {result2['score']} | Tier: {result2['tier']}")
    info(f"Brightness: {result2['debug']['brightness']}")
    
    # Dark + short title should get exposure warning
    imp_titles = [i.get("title","") for i in result2.get("improvements", [])]
    has_dark_warning = any("Exposure" in t or "Brightness" in t for t in imp_titles)
    has_title_warning = any("Title" in t or "Gibberish" in t for t in imp_titles)
    
    ok("Dark thumbnail triggers brightness improvement") if has_dark_warning else fail("Missing dark thumbnail warning")
    ok("Short title triggers title improvement") if has_title_warning else fail("Missing title improvement for 'ep 3'")
    
    info("Improvements triggered:")
    for imp in result2.get("improvements", [])[:5]:
        print(f"       [{imp.get('tier','?')}] {imp.get('title','?')}")
    
    # Score should be lower than the bright viral thumbnail
    if result2["score"] < 50:
        ok(f"Dark/boring thumbnail scores below 50", f"score={result2['score']}")
        passed += 1
    else:
        fail(f"Dark/boring thumbnail scored too high", f"score={result2['score']}")
        failed += 1
    passed += (1 if has_dark_warning else 0)
    failed += (0 if has_dark_warning else 1)
except Exception as e:
    fail("/analyze dark thumbnail test failed", str(e))
    failed += 1

# ─────────────────────────────────────────────────────────
# 5. /analyze — NEXT.JS PROXY
# ─────────────────────────────────────────────────────────
separator("API TEST 5: Next.js /api/creator/analyze Proxy")
try:
    thumb_bytes3 = make_thumbnail(brightness=170, has_text=True)
    files3 = {"thumbnail": ("proxy_test.jpg", thumb_bytes3, "image/jpeg")}
    data_form3 = {
        "title": "The SECRET They Don't Want You to Know About Crypto",
        "niche": "Science & Technology",
        "channel_title": "TechExposed",
        "video_length": "900",
        "upload_hour": "12",
        "is_weekend": "1"
    }
    r = requests.post(f"{NEXTJS}/api/creator/analyze", files=files3, data=data_form3, timeout=30)
    if r.status_code == 200:
        data = r.json()
        if data.get("status") == "success":
            ok("Next.js proxy successfully forwarded and returned result",
               f"Score: {data['data']['score']} Tier: {data['data']['tier']}")
            passed += 1
        else:
            fail("Next.js proxy returned non-success", str(data)[:100])
            failed += 1
    elif r.status_code == 404:
        fail("Next.js /api/creator/analyze route not found (404)")
        failed += 1
    else:
        fail(f"Next.js proxy returned HTTP {r.status_code}", r.text[:100])
        failed += 1
except Exception as e:
    fail("Next.js proxy test error", str(e))
    failed += 1

# ─────────────────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────────────────
separator("API TEST RESULTS")
total = passed + failed
rate = round(passed / max(1, total) * 100, 1)
print(f"  Tests Passed:  {passed}/{total} ({rate}%)")
print(f"  Tests Failed:  {failed}/{total}")
print()
print(f"  FastAPI:   http://127.0.0.1:8000")
print(f"  Next.js:   http://localhost:3000")
print(f"  Docs:      http://127.0.0.1:8000/docs")
