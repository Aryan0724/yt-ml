import sys
import json
import os

sys.path.append("d:/research/diamond-intelligence-next/backend")

# MOCK the SDK to simulate a 200 SUCCESS response (since quota is exhausted)
from google import genai
from pydantic import BaseModel

class MockResponse:
    def __init__(self):
        self.text = json.dumps({
            "diagnosis": {
                "root_cause": "The thumbnail completely lacks facial emotion and is overpowered by neon UI clutter.",
                "severity": "Critical",
                "evidence": "Passive or neutral facial expression dilutes urgency; Feed clash with neon palettes.",
                "expected_consequence": "Viewers will scroll past because it blends into the 'Tech' red ocean."
            },
            "optimization_plan": [
                {
                    "priority": 1,
                    "action": "Increase character crop scale so faces occupy 18-25% of the thumbnail.",
                    "rationale": "On tiny phone screens, facial emotions are invisible unless cropped tightly."
                }
            ]
        })

def mock_generate_content(*args, **kwargs):
    return MockResponse()

# Apply the mock
genai.Client.models = type('MockModels', (), {'generate_content': staticmethod(mock_generate_content)})()

from creator_intelligence_engine import CreatorIntelligenceEngine
engine = CreatorIntelligenceEngine()

sample = {
    'title': "I Built a $10,000 Trading Bot from Scratch!",
    'category': 'Tech',
    'video_length': 1200,
    'face_count': 1,
    'brightness': 180,
    'channel_title': 'New Channel'
}

# 1. Provide an explicit analysis_id as requested
result = engine.analyze_single(sample, analysis_id="PREYT-TEST-12345")

# We only print the 'ai' and 'master_report' objects to verify the behavior
output_to_verify = {
    "master_report": result.get("master_report"),
    "ai": result.get("ai")
}
print(json.dumps(output_to_verify, indent=2))
