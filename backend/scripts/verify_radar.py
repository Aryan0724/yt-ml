import sys
import os
from pprint import pprint

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.radar.opportunity import OpportunityCalculator
from services.radar.service import RadarTopicItem
from services.topic.provider import MockTopicDataProvider

def run_verification():
    print("--- Phase 7.5: Mathematical Verification Fixture ---")
    
    # 1. Rising Topic (Consistent growth over 12 months)
    # 52 weeks, growing from 20 to 80
    rising_points = [{"date": f"2025-W{i+1:02d}", "value": min(100, 20 + int(i * 1.2))} for i in range(52)]
    
    # 2. Breaking Topic (Flat, then massive spike in last 4 weeks)
    breaking_points = [{"date": f"2025-W{i+1:02d}", "value": 10 if i < 48 else 95} for i in range(52)]
    
    # 3. Cooling Topic (High, then steady decline)
    cooling_points = [{"date": f"2025-W{i+1:02d}", "value": max(10, 90 - int(i * 1.5))} for i in range(52)]
    
    # 4. Stable/Saturating (Consistently high, high saturation proxy)
    # We will simulate high saturation by having a very flat high curve
    stable_points = [{"date": f"2025-W{i+1:02d}", "value": 85 + (i % 5)} for i in range(52)]
    
    fixtures = {
        "Rising Trend": rising_points,
        "Breaking Trend": breaking_points,
        "Cooling Trend": cooling_points,
        "Stable Trend": stable_points
    }
    
    calc = OpportunityCalculator()
    
    for name, points in fixtures.items():
        print(f"\nEvaluating: {name}")
        metrics, opp, classification, why_this_matters, creator_opportunity = calc.calculate_metrics_and_opportunity(points)
        
        print(f"  Demand:     {metrics.demand:.1f}")
        print(f"  Momentum:   {metrics.momentum:.1f}%")
        print(f"  Saturation: {metrics.saturation:.1f}")
        print(f"  Volatility: {metrics.volatility:.1f}")
        print(f"  -> Score:   {opp.score:.2f} ({opp.tier})")
        print(f"  -> Class:   {classification}")
        
    print("\nVerification complete. Deterministic maths check passed if outputs are stable.")

if __name__ == "__main__":
    run_verification()
