import re
import numpy as np

class HeuristicAnalyzer:
    def __init__(self, cat_stats=None):
        self.cat_stats = cat_stats or {}
        
    def analyze(self, raw: dict, processed: dict) -> dict:
        """
        Performs heuristic checks for brightness, contrast, saturation, 
        face visibility, text readability, etc.
        """
        factors = {}
        strengths = []
        weaknesses = []
        improvements = []
        
        # 1. Visual Factors
        brightness = raw.get('brightness', 128)
        face_count = raw.get('face_count', 0)
        face_size = raw.get('face_size', 'medium') # placeholder if not provided
        contrast = raw.get('contrast', 'medium')
        saturation = raw.get('saturation', 'medium')
        
        factors['brightness'] = brightness
        factors['face_detected'] = face_count > 0
        factors['face_size'] = face_size
        factors['contrast'] = contrast
        factors['saturation'] = saturation
        
        # Heuristic Logic: Brightness
        if brightness < 140:
            weaknesses.append("Brightness below optimal range")
            improvements.append(f"Increase brightness by {int((160-brightness)/160 * 100)}%")
        elif brightness > 200:
            strengths.append("High visual visibility")
        else:
            factors['brightness_status'] = "optimal"

        # Heuristic Logic: Faces
        if face_count == 0:
            weaknesses.append("No human face detected")
            improvements.append("Add a face with a strong emotional expression")
        else:
            strengths.append("Human connection established via face")
            if face_size == 'small':
                weaknesses.append("Face is too small to be recognizable")
                improvements.append("Increase face crop size by 20-30%")

        # 2. Text & Title Factors
        title = raw.get('title', '')
        text_readability = raw.get('text_readability', 5) # 1-10
        text_density = raw.get('text_density', 'medium')
        
        factors['text_readability'] = text_readability
        factors['text_density'] = text_density
        
        if text_readability < 6:
            weaknesses.append("Text may be difficult to read on mobile")
            improvements.append("Increase text size or contrast against background")
        
        # 3. Niche Alignment
        cat = raw.get('category', 'Entertainment')
        niche_alignment = "average"
        if self.cat_stats:
            cat_data = self.cat_stats.get(cat, {})
            # Placeholder for complex niche alignment logic
            niche_alignment = "high" if processed.get('hook_score', 0) > 0.7 else "average"
        
        factors['niche_alignment'] = niche_alignment
        
        # 4. Global Indicators
        if processed.get('hook_score', 0) > 0.6:
            strengths.append("Strong curiosity gap in title")
        elif processed.get('hook_score', 0) < 0.3:
            weaknesses.append("Title lacks a compelling 'hook'")
            improvements.append("Use power words like 'Secret', 'Actually', or 'Mistake'")

        return {
            "factors": factors,
            "strengths": list(set(strengths)),
            "weaknesses": list(set(weaknesses)),
            "improvements": list(set(improvements))
        }
