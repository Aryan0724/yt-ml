import sys
import os
import json
sys.path.append("d:/research/diamond-intelligence-next/backend")
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

result = engine.analyze_single(sample)
print(json.dumps(result, indent=2))
