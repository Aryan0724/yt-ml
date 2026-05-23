import re
import numpy as np

class HeuristicAnalyzer:
    def __init__(self, cat_stats=None):
        self.cat_stats = cat_stats or {}
        
    def analyze(self, raw: dict, processed: dict) -> dict:
        """
        Performs heuristic checks for brightness, contrast, saturation, 
        face visibility, text readability, etc.
        Returns factors, strengths, weaknesses, and a list of structured improvements.
        """
        factors = {}
        strengths = []
        weaknesses = []
        improvements = [] # Holds dicts instead of strings
        
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
                "title": "Increase Exposure/Brightness",
                "current": f"Average brightness is low ({int(brightness)}/255).",
                "recommended": "Raise brightness levels by 15-20% in the edit/color-grade panel.",
                "why": "Bright thumbnails draw the eye first in dark mode apps and mobile recommendation scrolls.",
                "tier": "⚠️ IMPORTANT OPTIMIZATION",
                "improvement": "+8% to +12% CTR potential"
            })
        elif brightness > 210:
            weaknesses.append("Over-exposed highlights wash out visual details")
            improvements.append({
                "title": "Calibrate Exposure Highlights",
                "current": f"Exposure is overly bright ({int(brightness)}/255).",
                "recommended": "Lower highlight exposures to recover washed out facial/subject details.",
                "why": "Blown-out highlights look amateurish and reduce details readability in mobile feeds.",
                "tier": "ℹ️ POLISH IMPROVEMENT",
                "improvement": "+3% to +6% CTR potential"
            })
        else:
            strengths.append("Luminance contrast fits the optimal thumbnail exposure baseline")

        # 2. Contrast checks
        if contrast_score < 45.0:
            weaknesses.append("Low subject separation / contrast limits thumbnail readability")
            improvements.append({
                "title": "Boost Contrast & Color Isolation",
                "current": f"Luminance contrast is low ({int(contrast_score)}/100).",
                "recommended": "Apply neon/saturated highlight borders around key focal elements.",
                "why": "High edge contrast separates foreground subjects from background and speeds up visual processing.",
                "tier": "🚨 CRITICAL ISSUE",
                "improvement": "+10% to +18% CTR potential"
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
                "tier": "🚨 CRITICAL ISSUE",
                "improvement": "+12% to +20% CTR potential"
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
                "tier": "🚨 CRITICAL ISSUE",
                "improvement": "+9% to +15% CTR potential"
            })
        else:
            strengths.append("Minimal, legible typography ensures strong mobile readability")

        # 5. Face / Subject Logic
        if face_count == 0:
            strengths.append("Typography and composition focus established without human distractions")
            # Strictly object contrast, composition, arrows, color isolation, curiosity framing, visual storytelling
            improvements.append({
                "title": "Implement Visual Storytelling",
                "current": "No human faces detected to create an emotional connection.",
                "recommended": "Add custom arrows, question-mark badges, or mystery shadows to tell a visual story.",
                "why": "In non-face thumbnails, an unresolved mystery element creates curiosity and forces a click.",
                "tier": "⚠️ IMPORTANT OPTIMIZATION",
                "improvement": "+8% to +14% CTR potential"
            })
            improvements.append({
                "title": "Isolate Focal Objects",
                "current": "Focal subjects blend slightly with background details.",
                "recommended": "Use radial dark vignettes or color isolation to make the central object POP.",
                "why": "Without a human anchor, the viewer's eye must land on the main object within 0.3 seconds.",
                "tier": "ℹ️ POLISH IMPROVEMENT",
                "improvement": "+5% to +10% CTR potential"
            })
        else:
            strengths.append("Human emotional connection established via face detection")
            # Face optimization checks
            if average_face_area_pct < 12.0:
                weaknesses.append("Detected faces are cropped too small for mobile recognition")
                improvements.append({
                    "title": "Increase Face Sizing",
                    "current": f"Faces occupy only {average_face_area_pct:.1f}% of the canvas frame.",
                    "recommended": "Increase character crop scale so faces occupy 18-25% of the thumbnail.",
                    "why": "On tiny phone screens, facial emotions are invisible unless cropped tightly and magnified.",
                    "tier": "🚨 CRITICAL ISSUE",
                    "improvement": "+10% to +20% CTR potential"
                })
            
            if emotional_visibility_score < 60.0:
                weaknesses.append("Passive or neutral facial expression dilutes urgency")
                improvements.append({
                    "title": "Exaggerate Facial Reaction",
                    "current": f"Emotional visibility score is low ({int(emotional_visibility_score)}/100).",
                    "recommended": "Use high-intensity shock, laughter, anger, or curiosity reaction expressions.",
                    "why": "Exaggerated facial expressions trigger mirror neurons in viewers, driving high curiosity clicks.",
                    "tier": "⚠️ IMPORTANT OPTIMIZATION",
                    "improvement": "+8% to +16% CTR potential"
                })

        # 6. Title Tension & Hook
        hook_score = processed.get('hook_score', 0.5)
        title_length = len(raw.get('title', ''))

        if title_length < 15:
            weaknesses.append("Title is too short or gibberish to form a valid hook")
            improvements.append({
                "title": "Rewrite Gibberish/Short Title",
                "current": f"Title is only {title_length} characters.",
                "recommended": "Write a compelling, complete thought (30-60 chars) that sparks curiosity.",
                "why": "Extremely short or nonsense titles confuse the algorithm and kill CTR.",
                "tier": "🚨 CRITICAL ISSUE",
                "improvement": "+15% to +25% CTR potential"
            })
        elif hook_score < 0.4:
            weaknesses.append("Title lacks click motivation hook")
            improvements.append({
                "title": "Trigger Curiosity Wording",
                "current": "Video title is informative but lacks tension or conflict.",
                "recommended": "Incorporate contradiction, power words ('Secret', 'Mistake'), or extreme stakes.",
                "why": "Titles that pose an open question or highlight a risk trigger loss aversion, raising CTR.",
                "tier": "⚠️ IMPORTANT OPTIMIZATION",
                "improvement": "+7% to +12% CTR potential"
            })
        else:
            strengths.append("Title possesses a strong emotional or curiosity hook")

        # 7. Niche/Category Specific Checks
        category = raw.get('category', '').lower()
        if 'news' in category or 'politics' in category:
            sat_score = raw.get('saturation_score', 0)
            cont_score = raw.get('contrast_score', 0)
            if sat_score > 70 or cont_score > 70 or 'Saturated' in raw.get('palette_desc', ''):
                weaknesses.append("Gaming-style aesthetics detected in a News/Politics niche")
                improvements.append({
                    "title": "Restore Journalistic Tone",
                    "current": "Thumbnail colors/contrast mimic gaming or entertainment.",
                    "recommended": "Lower saturation and use realistic grading to maintain credibility.",
                    "why": "News audiences associate over-saturation with clickbait or misinformation.",
                    "tier": "🚨 CRITICAL ISSUE",
                    "improvement": "+8% to +15% CTR potential"
                })

        # Fallback safeguard: make sure we always return at least 1-2 improvements
        if not improvements:
            improvements.append({
                "title": "Increase Color Saturation",
                "current": "Vibrant colors fall in the standard baseline range.",
                "recommended": "Increase saturation by 10% in main subject layers.",
                "why": "Slightly elevated color saturation offsets display dimming on mobile screens.",
                "tier": "ℹ️ POLISH IMPROVEMENT",
                "improvement": "+4% to +8% CTR potential"
            })

        # Return factors, strengths, weaknesses, and structured list of improvements
        return {
            "factors": factors,
            "strengths": list(set(strengths)),
            "weaknesses": list(set(weaknesses)),
            "improvements": improvements
        }
