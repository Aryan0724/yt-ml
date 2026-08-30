"""
channel_dna_engine.py

Analyzes visual and behavioral patterns for a channel.

IMPORTANT — PRODUCT RULE:
  Only data derived from real inputs (image metrics, title text) is returned.
  No subscriber counts, average views, or performance history are fabricated.
  When a user's real channel data is not connected, those fields are omitted entirely.
"""
import os
import json
import numpy as np


class ChannelDNAEngine:
    def __init__(self, channel_stats_path=None):
        if channel_stats_path is None:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            backend_dir = os.path.dirname(current_dir)
            channel_stats_path = os.path.join(backend_dir, "channel_stats.json")

        self.channel_stats_path = channel_stats_path
        self.channel_stats = {}
        if os.path.exists(channel_stats_path):
            try:
                with open(channel_stats_path, "r", encoding="utf-8") as f:
                    self.channel_stats = json.load(f)
            except Exception as e:
                print(f"Error loading channel_stats: {e}")

    def analyze_channel(self, channel_identifier: str, raw_input: dict = None) -> dict:
        """
        Analyzes visual style match and behavioral classification for a channel.

        Returns ONLY data that is traceable to real inputs:
          - style_match: derived from actual image metrics vs niche baseline
          - channel_behavior_profile: heuristic keyword classification (labeled as such)
          - performance_baselines: only populated when real channel data is available

        Does NOT return: fabricated subscriber counts, fabricated average views,
        hardcoded "historical errors", or any random-seed generated numbers.
        """
        cleaned_id = channel_identifier.strip()
        if "youtube.com/" in cleaned_id:
            parts = cleaned_id.split("/")
            cleaned_id = parts[-1] if parts[-1] else parts[-2]
        cleaned_id = cleaned_id.replace("@", "")

        # Look up real channel data (from channel_stats.json if present)
        chan_data = None
        for key in self.channel_stats.keys():
            if cleaned_id.lower() == key.lower().strip() or cleaned_id.lower() == key.lower().replace(" ", "").strip():
                chan_data = self.channel_stats[key]
                cleaned_id = key
                break

        # Extract real image/input metrics
        category = raw_input.get("category", "Entertainment") if raw_input else "Entertainment"
        curr_brightness = raw_input.get("brightness", 128) if raw_input else 128
        curr_face_count = raw_input.get("face_count", 0) if raw_input else 0
        curr_saturation = raw_input.get("saturation_score", 50) if raw_input else 50
        curr_clutter = raw_input.get("clutter_level_rating", 5.0) if raw_input else 5.0
        curr_text_density = raw_input.get("text_density", 0) if raw_input else 0

        # --- Heuristic behavioral classification (labeled as heuristic, not real data) ---
        cat_lower = category.lower()
        id_lower = cleaned_id.lower()

        identity = "Standard Creator"
        preference = "Clean Visuals"
        dominant_style = "Balanced"
        pattern = "Curiosity Hooks"
        patterns = ["Big Reactions", "Large Text", "Clear Subject"]

        if "game" in id_lower or "play" in id_lower or "game" in cat_lower or "gaming" in cat_lower:
            identity = "High-Energy Gaming"
            preference = "Action & Faces"
            dominant_style = "High Contrast"
            pattern = "Challenge Hooks"
            patterns = ["Crazy Faces", "Red Arrows", "Big Zoom"]
        elif "tech" in id_lower or "mkbhd" in id_lower or "tech" in cat_lower or "science" in cat_lower:
            identity = "Tech Reviewer"
            preference = "Sleek Gadgets"
            dominant_style = "Clean Minimal"
            pattern = "Honest Reviews"
            patterns = ["Dark Background", "Glowing Gadget", "Minimal Text"]
        elif "movie" in id_lower or "comedy" in id_lower or "entertainment" in cat_lower:
            identity = "Classic Comedy"
            preference = "Famous Actors"
            dominant_style = "Warm Colors"
            pattern = "Funny Highlights"
            patterns = ["Split Screen", "Bright Outlines", "Catchy Quotes"]
        elif "vlog" in id_lower or "vlog" in cat_lower or "lifestyle" in cat_lower:
            identity = "Lifestyle Creator"
            preference = "Authentic Moments"
            dominant_style = "Natural Warm"
            pattern = "Personal Journey"
            patterns = ["Natural Light", "Candid Faces", "Minimal Text"]

        # --- Style match: derived from real image metrics vs niche visual baseline ---
        # Niche baselines are general averages, not channel-specific history
        niche_brightness_baseline = {
            "gaming": 118, "tech": 115, "education": 130, "entertainment": 135,
            "vlogs": 138, "music": 125
        }
        niche_saturation_baseline = {
            "gaming": 75, "tech": 60, "education": 55, "entertainment": 80,
            "vlogs": 65, "music": 70
        }

        avg_brightness = next((v for k, v in niche_brightness_baseline.items() if k in cat_lower), 128)
        avg_saturation = next((v for k, v in niche_saturation_baseline.items() if k in cat_lower), 65)
        avg_clutter = 4.5

        brightness_diff = abs(curr_brightness - avg_brightness) / 255.0
        saturation_diff = abs(curr_saturation - avg_saturation) / 100.0
        clutter_diff = abs(curr_clutter - avg_clutter) / 10.0

        style_match = 100.0 - (brightness_diff * 20.0 + saturation_diff * 20.0 + clutter_diff * 20.0)
        face_frequency_baseline = 0.65  # most niches use faces more than not
        if (curr_face_count > 0 and face_frequency_baseline < 0.4) or (curr_face_count == 0 and face_frequency_baseline > 0.6):
            style_match -= 15.0
        style_match = max(45, min(99, int(style_match)))

        # Build result — only include performance data if it came from a real source
        result = {
            "channel_title": cleaned_id,
            "niche": category,
            "style_profile": (
                f"{'Vibrant' if curr_saturation > 75 else 'Matte'}, "
                f"{'High Contrast' if curr_brightness > 120 else 'Sleek Minimalism'}, "
                f"{'Reactive Face' if curr_face_count > 0 else 'Typography Focus'}"
            ),
            "channel_behavior_profile": {
                "channel_identity": identity,
                "audience_preference": preference,
                "dominant_thumbnail_style": dominant_style,
                "title_pattern": pattern,
                "high_performing_patterns": patterns,
                # Explicitly label these as heuristic estimates, not channel-measured data
                "_note": "Behavioral classification is heuristic based on channel name and category keywords, not measured channel data."
            },
            "style_match_percentage": style_match,
            "data_source": "real_image_metrics",
            "channel_connected": False  # Will be True when YouTube OAuth is integrated
        }

        # Only add performance baselines if we have REAL channel data
        if chan_data:
            result["performance_baselines"] = {
                "median_views": chan_data.get("avg_views"),
                "top_10_percent_threshold": chan_data.get("p90_views"),
                "category_consistency": chan_data.get("category_consistency"),
                "_source": "channel_stats.json"
            }
            result["subscribers"] = chan_data.get("est_sub_count")
            result["video_count"] = chan_data.get("video_count")
            result["channel_connected"] = True

        return result
