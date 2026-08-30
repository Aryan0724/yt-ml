from fastapi.testclient import TestClient
from main import app
import json
import os
import io

client = TestClient(app)

def test_health_and_ready():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "alive"
    
    response = client.get("/ready")
    assert response.status_code == 200
    assert response.json()["status"] == "ready"
    print("[OK] Health and Ready endpoints passed")

def test_analyze_success():
    # Create a dummy image
    from PIL import Image
    image = Image.new('RGB', (1280, 720), color = 'red')
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='JPEG')
    img_bytes = img_byte_arr.getvalue()
    
    data = {
        "title": "I Built a $10,000 Trading Bot from Scratch!",
        "niche": "Tech",
        "channel_title": "New Channel",
        "video_length": 1200
    }
    
    files = {
        "thumbnail": ("test.jpg", img_bytes, "image/jpeg")
    }
    
    response = client.post("/analyze", data=data, files=files)
    assert response.status_code == 200
    
    res_data = response.json()
    assert res_data["status"] == "success"
    
    analysis_id_from_metadata = res_data["metadata"]["analysis_id"]
    analysis_id_from_ai = res_data["data"]["ai"]["metadata"]["analysis_id"]
    
    assert analysis_id_from_metadata == analysis_id_from_ai
    print(f"[OK] Analyze endpoint passed. analysis_id propagates perfectly: {analysis_id_from_metadata}")
    
    assert res_data["data"]["ai"]["status"] in ["success", "fallback"]
    print(f"[OK] AI status is correctly reported as: {res_data['data']['ai']['status']}")

def test_analyze_missing_image():
    data = {
        "title": "Missing image test",
        "niche": "Tech",
        "channel_title": "New Channel",
        "video_length": 1200
    }
    response = client.post("/analyze", data=data)
    assert response.status_code == 400 # We manually return 400 if missing thumbnail
    print("[OK] Analyze missing image correctly returns 400")

def test_analyze_malformed_image():
    data = {
        "title": "Malformed image test",
        "niche": "Tech",
        "channel_title": "New Channel",
        "video_length": 1200
    }
    files = {
        "thumbnail": ("test.jpg", b"not an image", "image/jpeg")
    }
    
    response = client.post("/analyze", data=data, files=files)
    assert response.status_code == 400
    print("[OK] Analyze malformed image correctly returns 400 VisionAnalyzerError")

if __name__ == "__main__":
    print("Running Smoke Tests...")
    test_health_and_ready()
    test_analyze_success()
    test_analyze_missing_image()
    test_analyze_malformed_image()
    print("[DONE] All smoke tests passed!")
