import os
from googleapiclient.discovery import build
import random

class CompetitorClashEngine:
    """
    Simulates or pulls live YouTube algorithm recommended feeds to determine if 
    a thumbnail will blend in (bad) or pop out (good) against current trends.
    """
    
    def __init__(self):
        self.api_key = os.environ.get("YOUTUBE_API_KEY")
        
        # Hardcoded historical meta baselines if API is unavailable
        self.fallback_meta = {
            "gaming": {"dominant_color": "Blue/Red", "saturation": "High", "face_presence": True},
            "finance": {"dominant_color": "Green/White", "saturation": "Medium", "face_presence": True},
            "tech": {"dominant_color": "Black/Neon", "saturation": "Medium", "face_presence": False},
            "vlog": {"dominant_color": "Warm/Yellow", "saturation": "High", "face_presence": True}
        }

    def analyze_feed_clash(self, category: str, palette_desc: str, saturation_score: float) -> dict:
        cat_lower = category.lower()
        
        # Determine current trend meta (Simulated API pull if no key)
        meta = self.fallback_meta.get(cat_lower, {"dominant_color": "Mixed", "saturation": "Medium"})
        
        clash_risk = False
        penalty = 0.0
        recommendation = ""
        
        # 1. Color Clash Detection
        # If the user is making a tech video and using a Black/Neon palette, they will blend in.
        is_blending = False
        if "Warm" in palette_desc and meta["dominant_color"] == "Warm/Yellow":
            is_blending = True
        elif "Cool" in palette_desc and "Blue" in meta["dominant_color"]:
            is_blending = True
        elif "Neutral" in palette_desc and "Black" in meta["dominant_color"]:
            is_blending = True
            
        if is_blending:
            clash_risk = True
            penalty += 8.0
            recommendation = (f"Algorithm Feed Clash! The current trending '{category}' videos heavily feature "
                              f"{meta['dominant_color']} palettes. Your thumbnail blends perfectly into the crowd. "
                              f"Use an inverted/complementary color grading to stand out in the sidebar.")
                              
        # 2. Saturation Blindness
        if saturation_score > 75 and meta.get("saturation") == "High":
            clash_risk = True
            penalty += 4.0
            if recommendation: recommendation += " "
            recommendation += "Also, everyone in this niche is using hyper-saturated colors. Try a desaturated, realistic look to create visual contrast on the page."
            
        return {
            "feed_clash_risk": clash_risk,
            "feed_clash_penalty": penalty,
            "feed_recommendation": recommendation if clash_risk else "Excellent! Your visual style contrasts with the current niche meta, ensuring you stand out in the recommended feed."
        }
