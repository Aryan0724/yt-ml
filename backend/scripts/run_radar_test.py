import os
import sys
import json
from pprint import pprint

# Set up path so we can import from backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.radar.service import RadarService

def run():
    print("Initializing RadarService...")
    radar = RadarService()
    
    print("Fetching Topics (Region: IN, Limit: 50)...")
    feed = radar.get_topics(region="IN", limit=50)
    
    print(f"Data Available: {feed.data_available}")
    if not feed.data_available:
        print(f"Reason: {feed.reason}")
        
    print(f"Total topics returned: {feed.total}")
    print("\n--- TOPICS (Sorted by Opportunity Score DESC) ---")
    
    for i, topic in enumerate(feed.topics):
        print(f"{i+1}. {topic.canonical_name} [{topic.classification}]")
        print(f"   Opp Score: {topic.opportunity.score} ({topic.opportunity.tier})")
        print(f"   Demand: {topic.metrics.demand} | Momentum: {topic.metrics.momentum}% | Saturation: {topic.metrics.saturation}")
        print(f"   Why: {topic.why_this_matters}")
        print(f"   Creator Opp: {topic.creator_opportunity}")
        print("-" * 40)

if __name__ == "__main__":
    run()
