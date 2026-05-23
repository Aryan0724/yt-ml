import os
import cv2
import numpy as np
import requests
import json

def run_tests():
    print("====================================================")
    print("STARTING CREATOR DECISION INTELLIGENCE PIPELINE TESTS")
    print("====================================================")

    # 1. Paths
    grace_hopper_path = r"D:\research\youtube_dataset\legacy\v19_env\Lib\site-packages\matplotlib\mpl-data\sample_data\grace_hopper.jpg"
    no_face_temp_path = "no_face_test.jpg"

    # Verify grace hopper exists
    if not os.path.exists(grace_hopper_path):
        print(f"[-] Grace Hopper image not found at expected path: {grace_hopper_path}")
        # Search for alternative in matplotlib
        alternative = r"C:\Users\Aryan\.gemini\antigravity\brain\aadea2ff-9738-4822-a114-2265f6335dda\grace_hopper.jpg"
        if os.path.exists(alternative):
            grace_hopper_path = alternative
            print(f"[+] Found alternative Grace Hopper path: {grace_hopper_path}")
        else:
            # Generate a face using opencv draw helper (wait, cascade wouldn't detect it easily, let's download or locate it)
            print("[-] No face image found, search in project directory...")

    print(f"[i] Using Grace Hopper image: {grace_hopper_path}")

    # Generate a programmatic graphic thumbnail (No Face)
    # 1280x720 (standard YouTube thumbnail size)
    img = np.zeros((720, 1280, 3), dtype=np.uint8)
    # Draw dark blue backdrop
    img[:] = (40, 20, 10)
    # Draw high contrast neon elements
    cv2.circle(img, (640, 360), 200, (0, 255, 0), -1) # Neon green circle in center
    cv2.circle(img, (200, 200), 80, (0, 255, 255), -1) # Yellow circle
    # Write some high contrast text
    cv2.putText(img, "AMAZING SAAS", (300, 600), cv2.FONT_HERSHEY_SIMPLEX, 3.0, (255, 255, 255), 8, cv2.LINE_AA)
    
    cv2.imwrite(no_face_temp_path, img)
    print(f"[+] Generated non-face geometric graphic thumbnail at: {no_face_temp_path}")

    # URLs
    fastapi_url = "http://127.0.0.1:8000/analyze"
    nextjs_url = "http://localhost:3000/api/creator/analyze"

    print("\n----------------------------------------------------")
    print("TEST 1: Fast API Direct Backend Analysis")
    print("----------------------------------------------------")

    # A. Face Image Test
    print("[i] Sending Grace Hopper (Face) to FastAPI...")
    with open(grace_hopper_path, 'rb') as f:
        files = {'thumbnail': f}
        data = {
            'title': 'How Grace Hopper Changed Programming Forever',
            'niche': 'Education',
            'channel_title': 'Tech History Pro',
            'video_length': '620',
            'upload_hour': '14',
            'is_weekend': '0'
        }
        res = requests.post(fastapi_url, files=files, data=data)
        
    assert res.status_code == 200, f"FastAPI returned non-200 status: {res.status_code}\n{res.text}"
    payload1 = res.json()
    assert payload1['status'] == 'success', "Response status not success"
    
    data1 = payload1['data']
    print(f"[+] Face Detected: {data1['debug']['face_count']}")
    print(f"[+] Face Bounding Boxes: {data1['debug']['face_boxes']}")
    print(f"[+] Score: {data1['score']} (Tier {data1['tier']})")
    
    # Verify face reaction or size improvements are present
    face_improvements = [imp for imp in data1['improvements'] if "face" in imp['title'].lower() or "emotion" in imp['title'].lower() or "facial" in imp['title'].lower()]
    print(f"[+] Face Improvements triggered: {[imp['title'] for imp in face_improvements]}")
    assert data1['debug']['face_count'] > 0, "No faces detected in Grace Hopper image"

    # B. Non-Face Image Test
    print("\n[i] Sending Geometric Graphic (No Face) to FastAPI...")
    with open(no_face_temp_path, 'rb') as f:
        files = {'thumbnail': f}
        data = {
            'title': 'I Built the Ultimate Automated SaaS Platform',
            'niche': 'Tech',
            'channel_title': 'SaaS Developer',
            'video_length': '840',
            'upload_hour': '16',
            'is_weekend': '1'
        }
        res = requests.post(fastapi_url, files=files, data=data)
        
    assert res.status_code == 200, f"FastAPI returned non-200 status: {res.status_code}\n{res.text}"
    payload2 = res.json()
    assert payload2['status'] == 'success', "Response status not success"
    
    data2 = payload2['data']
    print(f"[+] Face Detected: {data2['debug']['face_count']}")
    print(f"[+] Score: {data2['score']} (Tier {data2['tier']})")
    
    # Verify no face-centric recommendations are generated
    face_related_imps = [imp for imp in data2['improvements'] if "face" in imp['title'].lower() or "emotion" in imp['title'].lower()]
    print(f"[+] Face Improvements triggered on non-face thumbnail: {len(face_related_imps)}")
    assert len(face_related_imps) == 0, "Error: Face improvements triggered on a thumbnail with NO faces"
    
    # Verify composition, contrast, and visual storytelling recommendations are generated
    storytelling_imps = [imp for imp in data2['improvements'] if "storytelling" in imp['title'].lower() or "focal" in imp['title'].lower() or "typography" in imp['title'].lower() or "contrast" in imp['title'].lower() or "exposure" in imp['title'].lower()]
    print(f"[+] Storytelling/Contrast/Typography Improvements triggered: {[imp['title'] for imp in storytelling_imps]}")
    assert len(storytelling_imps) > 0, "No non-face improvements triggered"

    print("\n----------------------------------------------------")
    print("TEST 2: Next.js API Proxy Propagation Analysis")
    print("----------------------------------------------------")

    # A. Face Image Test via Next.js Proxy
    print("[i] Sending Grace Hopper (Face) to Next.js API...")
    with open(grace_hopper_path, 'rb') as f:
        files = {'thumbnail': f}
        data = {
            'title': 'How Grace Hopper Changed Programming Forever',
            'niche': 'Education',
            'channel_title': 'Tech History Pro',
            'video_length': '620',
            'upload_hour': '14',
            'is_weekend': '0'
        }
        res = requests.post(nextjs_url, files=files, data=data)
        
    assert res.status_code == 200, f"Next.js API returned non-200 status: {res.status_code}\n{res.text}"
    next_payload = res.json()
    assert next_payload['status'] == 'success', "Next.js returned non-success payload status"
    print(f"[+] Next.js proxy successfully forwarded and returned result. Score: {next_payload['data']['score']}")

    # Clean up temp file
    if os.path.exists(no_face_temp_path):
        os.remove(no_face_temp_path)

    print("\n====================================================")
    print("ALL TESTS PASSED SUCCESSFULLY! PIPELINE IS VERIFIED DYNAMIC")
    print("====================================================")

if __name__ == "__main__":
    run_tests()
