import re
import numpy as np

class HeuristicAnalyzer:
    def __init__(self, cat_stats=None):
        self.cat_stats = cat_stats or {}
        
    def analyze(self, raw: dict, processed: dict) -> dict:
        """
        Performs heuristic checks for brightness, contrast, saturation, 
        face visibility, text readability, and composition.
        Returns factors, strengths, weaknesses, and a list of structured improvements.
        """
        factors = {}
        strengths = []
        weaknesses = []
        improvements = []
        
        # Extract features
        brightness = raw.get('brightness', 128)
        contrast = raw.get('contrast', 'medium')
        contrast_score = raw.get('contrast_score', 50.0)
        saturation = raw.get('saturation', 'medium')
        saturation_score = raw.get('saturation_score', 50.0)
        face_count = raw.get('face_count', 0)
        average_face_area_pct = raw.get('average_face_area_pct', 0.0)
        emotional_visibility_score = raw.get('emotional_visibility_score', 0.0)
        clutter_level_rating = raw.get('clutter_level_rating', 5.0)
        text_density = raw.get('text_density', 0.0)
        mobile_readability = raw.get('mobile_readability', 75.0)
        ocr_text = raw.get('ocr_text', '')
        
        factors['brightness'] = brightness
        factors['face_detected'] = face_count > 0
        factors['face_count'] = face_count
        factors['contrast'] = contrast
        factors['saturation'] = saturation
        factors['clutter_level_rating'] = clutter_level_rating
        factors['text_density'] = text_density
        factors['mobile_readability'] = mobile_readability
        
        # 1. Brightness checks
        if brightness < 100:
            weaknesses.append("Dark thumbnail exposure diminishes scrolling prominence")
            improvements.append({
                "title": "Increase Exposure / Brightness",
                "current": f"Average brightness is low ({int(brightness)}/255).",
                "recommended": "Raise brightness levels by 15-20% in your thumbnail editor.",
                "why": "Bright thumbnails draw the eye first in dark mode mobile feeds.",
                "tier": "IMPORTANT OPTIMIZATION",
                "priority": "High"
            })
        elif brightness > 210:
            weaknesses.append("Over-exposed highlights wash out visual details")
            improvements.append({
                "title": "Calibrate Exposure Highlights",
                "current": f"Exposure is overly bright ({int(brightness)}/255).",
                "recommended": "Lower highlight exposures to recover washed out subject details.",
                "why": "Blown-out highlights look uncalibrated and reduce readability on phone screens.",
                "tier": "POLISH IMPROVEMENT",
                "priority": "Medium"
            })
        else:
            strengths.append("Luminance contrast fits the optimal thumbnail exposure baseline")

        # 2. Contrast checks
        if contrast_score < 45.0:
            weaknesses.append("Low subject separation / contrast limits thumbnail readability")
            improvements.append({
                "title": "Boost Contrast & Color Isolation",
                "current": f"Luminance contrast is low ({int(contrast_score)}/100).",
                "recommended": "Apply saturated highlight borders or rim lighting around key focal elements.",
                "why": "High edge contrast separates foreground subjects from background and speeds up visual processing.",
                "tier": "CRITICAL ISSUE",
                "priority": "High"
            })
        else:
            strengths.append("High contrast outlines ensure clear foreground isolation")

        # 3. Clutter / Composition checks
        if clutter_level_rating > 6.5:
            weaknesses.append("High visual background clutter disrupts scrolling eye-focus path")
            improvements.append({
                "title": "Clean Cluttered Composition",
                "current": f"Visual clutter level is high (rating {clutter_level_rating:.1f}/10.0).",
                "recommended": "Limit composition to 2-3 main focal elements and blur background elements.",
                "why": "Clean compositions with unified visual focus decrease cognitive load, allowing instant recognition.",
                "tier": "CRITICAL ISSUE",
                "priority": "High"
            })
        else:
            strengths.append("Balanced visual clutter allows solid focal points concentration")

        # 4. Text & Readability checks
        if mobile_readability < 55.0 or text_density > 25.0:
            weaknesses.append("Dense/small thumbnail text decreases mobile-feed legibility")
            improvements.append({
                "title": "Optimize Mobile Typography",
                "current": f"Mobile readability is low ({int(mobile_readability)}%) with text density of {int(text_density)}%.",
                "recommended": "Restrict thumbnail text to 2-4 words maximum, using bold thicker fonts (e.g. Impact or Outfit).",
                "why": "Tiny or crowded fonts are illegible on mobile device screens, forcing viewers to skip reading.",
                "tier": "CRITICAL ISSUE",
                "priority": "High"
            })
        else:
            strengths.append("Minimal, legible typography ensures strong mobile readability")

        # 5. Face / Subject Logic
        if face_count == 0:
            strengths.append("Typography and composition focus established without human distractions")
            improvements.append({
                "title": "Implement Visual Storytelling",
                "current": "No human faces detected on canvas.",
                "recommended": "Add high-contrast focal subject, mystery silhouette, or clear directional arrow.",
                "why": "In non-face thumbnails, an unresolved mystery element creates curiosity and forces a click.",
                "tier": "IMPORTANT OPTIMIZATION",
                "priority": "High"
            })
        else:
            strengths.append("Human emotional connection established via face detection")
            if average_face_area_pct < 12.0:
                weaknesses.append("Detected faces are cropped too small for mobile recognition")
                improvements.append({
                    "title": "Increase Face Sizing",
                    "current": f"Faces occupy only {average_face_area_pct:.1f}% of the canvas frame.",
                    "recommended": "Increase character crop scale so faces occupy 18-25% of the thumbnail.",
                    "why": "On tiny phone screens, facial emotions are invisible unless cropped tightly and magnified.",
                    "tier": "CRITICAL ISSUE",
                    "priority": "High"
                })
            
            if emotional_visibility_score < 60.0:
                weaknesses.append("Passive or neutral facial expression dilutes urgency")
                improvements.append({
                    "title": "Exaggerate Facial Reaction",
                    "current": f"Emotional visibility score is low ({int(emotional_visibility_score)}/100).",
                    "recommended": "Use high-intensity shock, laughter, anger, or curiosity reaction expressions.",
                    "why": "Exaggerated facial expressions trigger mirror neurons in viewers, driving high curiosity clicks.",
                    "tier": "IMPORTANT OPTIMIZATION",
                    "priority": "High"
                })

        # 6. Title Tension & Hook
        title_length = len(raw.get('title', ''))
        if title_length < 15:
            weaknesses.append("Title is too short to form a valid hook")
            improvements.append({
                "title": "Expand Title Hook",
                "current": f"Title is only {title_length} characters.",
                "recommended": "Write a compelling, complete thought (35-65 chars) that sparks curiosity.",
                "why": "Extremely short or vague titles fail to establish context or urgency.",
                "tier": "CRITICAL ISSUE",
                "priority": "High"
            })
        elif title_length > 70:
            weaknesses.append("Title length exceeds mobile truncation limit (~50-60 characters)")
            improvements.append({
                "title": "Front-Load Primary Hook",
                "current": f"Title length is {title_length} characters.",
                "recommended": "Move the core emotional trigger or keyword into the first 45 characters.",
                "why": "YouTube cuts off long titles with '...' on mobile screens, burying late-stage context.",
                "tier": "CRITICAL ISSUE",
                "priority": "High"
            })
        else:
            strengths.append("Title character length fits mobile viewport cutoff guidelines")

        # 7. Safe Area Check
        for w in raw.get("ui_warnings", []):
            weaknesses.append(w)
            improvements.append({
                "title": "Relocate Timestamp Overlay Clashes",
                "current": "Critical elements fall into YouTube's UI danger zone.",
                "recommended": "Move faces and focal text out of the bottom-right 25% of the thumbnail.",
                "why": "YouTube's video duration badge covers the bottom-right corner, obscuring anything behind it.",
                "tier": "CRITICAL ISSUE",
                "priority": "High"
            })

        return {
            "factors": factors,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "improvements": improvements
        }
