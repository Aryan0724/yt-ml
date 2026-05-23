import os
import json
import numpy as np

class CompetitorEngine:
    def __init__(self, model_dir=None):
        if model_dir is None:
            model_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.model_dir = model_dir

    def analyze_competitors(self, channel_title: str, title: str, category: str, raw_input: dict = None) -> dict:
        """
        Identifies relevant competitors in the creator's niche and performs comparative analysis.
        """
        # Determine competitors based on niche/category
        cat = category.lower()
        
        competitors = []
        differences = []
        references = []
        
        if "comedy" in cat or "entertainment" in cat or "movie" in cat or "shemaroo" in channel_title.lower():
            competitors = [
                {"name": "Goldmines Gaane", "subs": "12.4M", "avg_views": 450000, "similarity_score": 0.88, "niche": "Bollywood Nostalgia"},
                {"name": "Ultra Movie Parlour", "subs": "8.9M", "avg_views": 220000, "similarity_score": 0.82, "niche": "Classic Film Scenes"},
                {"name": "Venus Comedy", "subs": "4.2M", "avg_views": 180000, "similarity_score": 0.79, "niche": "Retro Comedy Cuts"}
            ]
            differences = [
                "Top-performing competitors consistently use larger character/actor faces with highly recognizable emotions (smiling, crying, angry).",
                "They use high-contrast yellow-orange outer glow boundaries to isolate subjects from dark background backdrops.",
                "They structure titles using direct curiosity hooks rather than generic titles (e.g. '[NAME] Hilarious Comedy Scene' instead of just scene names)."
            ]
            references = [
                {
                    "title": "Welcome (2007) Epic Comedy Scene - Akshay Kumar & Nana Patekar",
                    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "views": 4500000,
                    "upload_age": "6 months ago",
                    "thumbnail": "/mock-thumbnails/welcome_comp.jpg",
                    "why_it_worked": "Perfect 3-subject framing containing active facial conflict which creates instant curiosity.",
                    "what_to_study": "Study the color separation between Nana Patekar's dynamic yellow shirt and the dark textured background."
                },
                {
                    "title": "Dhamaal (2007) Hilarious Plane Crash Scene compilation",
                    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "views": 2800000,
                    "upload_age": "3 months ago",
                    "thumbnail": "/mock-thumbnails/dhamaal_comp.jpg",
                    "why_it_worked": "Exaggerated facial shock expression occupying over 35% of the canvas grid.",
                    "what_to_study": "Observe the high saturation layers on faces to capture mobile attention in feeds."
                }
            ]
        elif "gaming" in cat or "game" in cat or "minecraft" in cat:
            competitors = [
                {"name": "MrBeast Gaming", "subs": "42.1M", "avg_views": 4800000, "similarity_score": 0.91, "niche": "High Stakes Minecraft"},
                {"name": "Dream", "subs": "31.8M", "avg_views": 6200000, "similarity_score": 0.85, "niche": "Speedruns & Hunters"},
                {"name": "DanTDM", "subs": "28.6M", "avg_views": 1400000, "similarity_score": 0.78, "niche": "Let's Plays & Challenges"}
            ]
            differences = [
                "Top competitors systematically crop faces to occupy 20-30% of the thumbnail, using extreme grins or expressions.",
                "They avoid native gameplay HUD clutter and instead superimpose isolated neon-outlined game characters.",
                "Titles are structured as high-stakes challenges (e.g., 'I Survived...' or 'X vs Y Hunters')."
            ]
            references = [
                {
                    "title": "I Survived 100 Days in a Hardcore Desert World!",
                    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "views": 8200000,
                    "upload_age": "1 month ago",
                    "thumbnail": "/mock-thumbnails/minecraft_survival.jpg",
                    "why_it_worked": "Creates a distinct visual narrative loop (extreme desert backdrop contrasted with a massive blue ice block).",
                    "what_to_study": "Analyze how brightness of the center subject is raised by ~40% relative to the surroundings."
                }
            ]
        elif "tech" in cat or "science" in cat or "technology" in cat or "mkbhd" in channel_title.lower():
            competitors = [
                {"name": "Marques Brownlee", "subs": "18.6M", "avg_views": 3200000, "similarity_score": 0.95, "niche": "Sleek Gadget Reviews"},
                {"name": "Dave2D", "subs": "3.8M", "avg_views": 850000, "similarity_score": 0.88, "niche": "Minimalist Diagnostic Tech"},
                {"name": "Linus Tech Tips", "subs": "15.6M", "avg_views": 1900000, "similarity_score": 0.81, "niche": "Wacky Tech Experiments"}
            ]
            differences = [
                "Top competitors isolate products perfectly using shallow depth of field (creamy bokeh backdrops).",
                "They use professional color-grading, preferring matte dark graphite gray or high neon contrast backings.",
                "Titles avoid clickbait capitalization, using simple lowercase curiosity hooks or clean model names."
            ]
            references = [
                {
                    "title": "The Smartwatch of the Future (MKBHD)",
                    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "views": 3400000,
                    "upload_age": "2 weeks ago",
                    "thumbnail": "/mock-thumbnails/mkbhd_review.jpg",
                    "why_it_worked": "Ultra-sharp focal points on gadget details with absolute minimum backing text.",
                    "what_to_study": "Note how device curves capture bright highlights to stand out in dark mode browser feeds."
                }
            ]
        else:
            competitors = [
                {"name": "Casey Neistat", "subs": "12.6M", "avg_views": 1800000, "similarity_score": 0.76, "niche": "Cinematic Storytelling Vlogs"},
                {"name": "Airrack", "subs": "14.2M", "avg_views": 2400000, "similarity_score": 0.72, "niche": "Audacious Challenge Vlogs"}
            ]
            differences = [
                "Top creators use dynamic hand gesturing or movement frames to suggest action.",
                "High saturation on subjects combined with high-contrast text overlays (3-4 words max).",
                "Emotional anchors are placed dead-center to immediately stop feed scrolling."
            ]
            references = [
                {
                    "title": "I Secretly Lived in a Tiny House for 7 Days",
                    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "views": 4100000,
                    "upload_age": "4 weeks ago",
                    "thumbnail": "/mock-thumbnails/vlog_comp.jpg",
                    "why_it_worked": "High curiosity gap created by showing an ultra-narrow entry hatch contrasted with a cozy bright interior.",
                    "what_to_study": "Study the rule of thirds placement of the host's reaction face."
                }
            ]

        # Extract actual metrics if raw_input is present
        brightness = raw_input.get('brightness', 128) if raw_input else 128
        contrast_score = raw_input.get('contrast_score', 50.0) if raw_input else 50.0
        saturation_score = raw_input.get('saturation_score', 50.0) if raw_input else 50.0
        clutter_level_rating = raw_input.get('clutter_level_rating', 5.0) if raw_input else 5.0
        face_count = raw_input.get('face_count', 0) if raw_input else 0
        emotional_visibility_score = raw_input.get('emotional_visibility_score', 0.0) if raw_input else 0.0
        mobile_readability = raw_input.get('mobile_readability', 75.0) if raw_input else 75.0

        # Generate Comparative Niche Averages
        niche_visual_strength = 72
        niche_curiosity = 68
        niche_readability = 84
        niche_intensity = 79

        # Calculate User Scores based on real OpenCV metrics
        # 1. Visual strength: contrast + saturation - brightness penalties - clutter penalties
        brightness_penalty = 0
        if brightness < 100:
            brightness_penalty = (100 - brightness) * 0.5
        elif brightness > 200:
            brightness_penalty = (brightness - 200) * 0.5
            
        clutter_penalty = 0
        if clutter_level_rating > 6.5:
            clutter_penalty = (clutter_level_rating - 6.5) * 8.0
            
        your_visual_strength = float(np.clip(
            (0.3 * contrast_score) + 
            (0.3 * saturation_score) + 
            (0.4 * (100.0 - brightness_penalty * 2.0)) - 
            clutter_penalty,
            15.0, 100.0
        ))

        # 2. Curiosity trigger: based on title words + emotional face visibility
        title_curiosity_bonus = 0
        curiosity_words = ["secret", "mistake", "survived", "vs", "history", "uncovered", "why", "how", "dangerous", "broke", "ultimate", "survive"]
        for word in curiosity_words:
            if word in title.lower():
                title_curiosity_bonus += 12
        title_curiosity_bonus = min(35, title_curiosity_bonus)
        
        if face_count > 0:
            your_curiosity = 30 + emotional_visibility_score * 0.4 + title_curiosity_bonus
        else:
            your_curiosity = 35 + contrast_score * 0.2 + title_curiosity_bonus
        your_curiosity = float(np.clip(your_curiosity, 15.0, 100.0))

        # 3. Readability: maps to mobile readability
        your_readability = float(np.clip(mobile_readability, 10.0, 100.0))

        # 4. Emotional Intensity: maps to face expression or contrast
        if face_count > 0:
            your_intensity = float(np.clip(emotional_visibility_score, 10.0, 100.0))
        else:
            your_intensity = float(np.clip(contrast_score * 0.7, 10.0, 100.0))

        # Adjust competitor similarity scores based on visual distance to average
        for comp in competitors:
            diff_factor = abs(your_visual_strength - niche_visual_strength) / 100.0
            comp["similarity_score"] = float(np.clip(comp["similarity_score"] - diff_factor * 0.1, 0.4, 0.98))

        return {
            "niche_competitors": competitors,
            "what_competitors_do_differently": differences,
            "competitive_position": {
                "visual_attention_strength": {"you": int(your_visual_strength), "average": niche_visual_strength},
                "curiosity_trigger_index": {"you": int(your_curiosity), "average": niche_curiosity},
                "mobile_readability_rating": {"you": int(your_readability), "average": niche_readability},
                "emotional_intensity_rating": {"you": int(your_intensity), "average": niche_intensity}
            },
            "clickable_competitor_references": references
        }
