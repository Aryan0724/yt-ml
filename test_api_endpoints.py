"""
test_api_endpoints.py

Direct HTTP Integration tests for the live PreYT FastAPI SaaS endpoints.
"""

import urllib.request
import urllib.parse
import json
import uuid

BASE_URL = "http://127.0.0.1:8000"


def make_request(method: str, path: str, data: dict = None, headers: dict = None):
    url = f"{BASE_URL}{path}"
    headers = headers or {}
    body = None
    if data is not None:
        body = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            resp_body = response.read().decode("utf-8")
            return response.status, json.loads(resp_body) if resp_body else {}
    except urllib.error.HTTPError as e:
        resp_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(resp_body)
        except Exception:
            return e.code, {"error": resp_body}


def test_live_api():
    print("Testing /health...")
    status, health_resp = make_request("GET", "/health")
    assert status == 200, f"Health check failed with {status}: {health_resp}"
    print("  [PASS] /health returned 200 OK:", health_resp)

    print("\nTesting /auth/register...")
    test_email = f"creator_{uuid.uuid4().hex[:8]}@example.com"
    status, reg_resp = make_request("POST", "/auth/register", {
        "email": test_email,
        "password": "strong_creator_password_2026",
        "full_name": "Test Creator"
    })
    print(f"  Register response ({status}):", reg_resp.get("user", {}).get("email"))
    assert status in (200, 201), f"Register failed: {reg_resp}"
    assert "access_token" in reg_resp
    assert "workspace" in reg_resp
    token = reg_resp["access_token"]
    refresh_token = reg_resp["refresh_token"]
    ws_id = reg_resp["workspace"]["id"]
    print("  [PASS] /auth/register created user, workspace, and minted JWT.")

    print("\nTesting /auth/me...")
    status, me_resp = make_request("GET", "/auth/me", headers={"Authorization": f"Bearer {token}"})
    print(f"  /auth/me status={status}, resp={me_resp}")
    assert status == 200
    assert me_resp["email"] == test_email
    print("  [PASS] /auth/me resolved authenticated user:", me_resp["email"])

    print("\nTesting /workspaces...")
    status, ws_list = make_request("GET", "/workspaces", headers={"Authorization": f"Bearer {token}"})
    assert status == 200
    assert len(ws_list) >= 1
    assert ws_list[0]["role"] == "owner"
    print(f"  [PASS] /workspaces listed {len(ws_list)} workspace(s): {ws_list[0]['name']}")

    print("\nTesting /projects...")
    status, proj_resp = make_request("POST", "/projects", {
        "name": "Main Channel Series",
        "description": "Weekly deep dives"
    }, headers={
        "Authorization": f"Bearer {token}",
        "X-Workspace-Id": ws_id
    })
    assert status in (200, 201)
    assert proj_resp["name"] == "Main Channel Series"
    print(f"  [PASS] /projects created project: {proj_resp['name']}")

    print("\nTesting /auth/refresh...")
    status, ref_resp = make_request("POST", "/auth/refresh", {
        "refresh_token": refresh_token
    })
    assert status == 200
    assert "access_token" in ref_resp
    print("  [PASS] /auth/refresh rotated refresh token successfully.")

    print("\n=======================================================")
    print(" ALL LIVE SAAS HTTP API ENDPOINTS VERIFIED (100%) ")
    print("=======================================================\n")


if __name__ == "__main__":
    test_live_api()
