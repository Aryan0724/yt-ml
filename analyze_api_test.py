# -*- coding: utf-8 -*-
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import requests
import numpy as np
import cv2

BASE = "http://127.0.0.1:8000"
NEXTJS = "http://localhost:3000"

def make_thumbnail(brightness=180, has_text=True, dark_bg=False):
    img = np.zeros((720, 1280, 3), dtype=np.uint8)
    img[:] = (10, 5, 30) if dark_bg else (50, 30, 100)
    cv2.circle(img, (640, 360), 230, (brightness, int(brightness * 0.8), 50), -1)
    if has_text:
        cv2.putText(img, "100 DAYS", (310, 220), cv2.FONT_HERSHEY_SIMPLEX, 3.5, (255, 255, 255), 9, cv2.LINE_AA)
        cv2.putText(img, "DESERT SURVIVAL", (180, 580), cv2.FONT_HERSHEY_SIMPLEX, 2.0, (0, 255, 200), 6, cv2.LINE_AA)
    return cv2.imencode(".jpg", img)[1].tobytes()

passed = 0
failed = 0

def ok(msg, detail=""):
    global passed
    print(f"  [OK]  {msg}" + (f" -- {detail}" if detail else ""))
    passed += 1

def fail(msg, detail=""):
    global failed
    print(f"  [!!]  {msg}" + (f" -- {detail}" if detail else ""))
    failed += 1

def info(msg):
    print(f"  -->  {msg}")

print("\n" + "="*60)
print("  API TEST A: /analyze High-CTR Thumbnail")
print("="*60)
try:
    r = requests.post(
        f"{BASE}/analyze",
        files={"thumbnail": ("t.jpg", make_thumbnail(200, True), "image/jpeg")},
        data={
            "title": "I Survived 100 Days in the Desert [INSANE CHALLENGE]",
            "niche": "Entertainment",
            "channel_title": "MrBeast",
            "video_length": "720",
            "upload_hour": "15",
            "is_weekend": "0"
        },
        timeout=180
    )
    d = r.json()
    res = d["data"]
    score_a = res["score"]
    info(f"Score={res['score']} | Tier={res['tier']} | Confidence={res['confidence']}")
    info(f"Breakout={res['safe_vs_breakout']['breakout_score']} | Safe={res['safe_vs_breakout']['safe_score']}")
    info(f"Face detected={res['debug']['face_detected']} | count={res['debug']['face_count']}")
    info(f"OCR text: {repr(res['debug']['ocr_text'])}")
    info(f"Brightness(real-detected)={res['debug']['brightness']}")
    print()
    print("  Strengths:")
    for s in res.get("strengths", [])[:3]:
        print(f"    + {s}")
    print("  Top Improvements:")
    for imp in res.get("improvements", [])[:4]:
        print(f"    [{imp.get('tier','?')}] {imp.get('title','?')}  -> {imp.get('improvement','?')}")

    if 0 <= res["score"] <= 100:
        ok("Score in valid range [0,100]", f"score={res['score']}")
    else:
        fail("Score out of range", f"score={res['score']}")

    required = ["score", "tier", "confidence", "improvements", "channel_dna", "safe_vs_breakout", "debug"]
    missing = [k for k in required if k not in res]
    if not missing:
        ok("All expected response fields present")
    else:
        fail("Missing fields", str(missing))

except Exception as e:
    fail("/analyze high-CTR test failed", str(e))
    score_a = -1

print("\n" + "="*60)
print("  API TEST B: /analyze Dark/Boring Thumbnail")
print("="*60)
try:
    r2 = requests.post(
        f"{BASE}/analyze",
        files={"thumbnail": ("dark.jpg", make_thumbnail(35, False, True), "image/jpeg")},
        data={
            "title": "ep 3",
            "niche": "People & Blogs",
            "channel_title": "SmallCreatorXYZ",
            "video_length": "180",
            "upload_hour": "3",
            "is_weekend": "0"
        },
        timeout=180
    )
    d2 = r2.json()
    res2 = d2["data"]
    score_b = res2["score"]
    info(f"Score={res2['score']} | Tier={res2['tier']}")
    info(f"Brightness(real-detected)={res2['debug']['brightness']}")
    print("  Improvements flagged:")
    for imp in res2.get("improvements", [])[:5]:
        print(f"    [{imp.get('tier','?')}] {imp.get('title','?')}")

    imp_titles = [i.get("title", "") for i in res2.get("improvements", [])]
    if any("Exposure" in t or "Brightness" in t for t in imp_titles):
        ok("Dark thumbnail correctly triggers Brightness/Exposure warning")
    else:
        fail("Dark thumbnail missing brightness warning")

    if any("Title" in t or "Gibberish" in t for t in imp_titles):
        ok("Short title 'ep 3' correctly triggers Title improvement")
    else:
        fail("Short title missing improvement suggestion")

    if res2["score"] < 50:
        ok(f"Dark/boring scores below 50 as expected", f"score={res2['score']}")
    else:
        fail(f"Dark/boring scored too high", f"score={res2['score']}")

except Exception as e:
    fail("/analyze dark thumbnail test failed", str(e))
    score_b = -1

print("\n" + "="*60)
print("  API TEST C: Next.js /api/creator/analyze Proxy")
print("="*60)
try:
    r3 = requests.post(
        f"{NEXTJS}/api/creator/analyze",
        files={"thumbnail": ("proxy.jpg", make_thumbnail(160, True), "image/jpeg")},
        data={
            "title": "The SECRET They Don't Want You to Know",
            "niche": "Science & Technology",
            "channel_title": "TechExposedChannel",
            "video_length": "900",
            "upload_hour": "12",
            "is_weekend": "1"
        },
        timeout=180
    )
    if r3.status_code == 200:
        data3 = r3.json()
        if data3.get("status") == "success":
            ok("Next.js proxy forwarded and returned result",
               f"Score={data3['data']['score']} Tier={data3['data']['tier']}")
        else:
            fail("Proxy returned non-success", str(data3)[:100])
    elif r3.status_code == 404:
        fail("Next.js /api/creator/analyze route not found (404) - route may not exist")
    else:
        fail(f"Next.js proxy HTTP {r3.status_code}", r3.text[:150])
except Exception as e:
    fail("Next.js proxy test error", str(e))

print("\n" + "="*60)
print("  FINAL SCORE COMPARISON")
print("="*60)
if score_a > 0 and score_b > 0:
    delta = score_a - score_b
    info(f"High-CTR thumbnail score:  {score_a}")
    info(f"Dark/boring thumbnail score: {score_b}")
    info(f"Delta (CTR advantage): +{delta} points")
    if score_a > score_b:
        ok("High-CTR thumbnail correctly outscores dark/boring", f"delta={delta}")
    else:
        fail("Ordering wrong: boring scored >= viral")

print("\n" + "="*60)
print(f"  API INTEGRATION TESTS DONE")
print(f"  Passed: {passed}  |  Failed: {failed}")
print("="*60)
