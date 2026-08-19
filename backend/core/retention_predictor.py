from textblob import TextBlob
import re

class RetentionPredictor:
    """
    Deep logic engine that calculates the 'semantic gap' between what the title promises 
    and what the thumbnail actually delivers. High gap = high clickbait = low AVD (Average View Duration).
    """
    
    def __init__(self):
        # High arousal words that promise extreme stakes or emotions
        self.extreme_trigger_words = [
            'insane', 'never', 'secret', 'banned', 'illegal', 'destroyed', 
            'survived', 'extreme', 'worst', 'best', 'unbelievable', 'shocking',
            'crazy', 'exposed', 'truth'
        ]

    def analyze_retention_risk(self, title: str, visual_metrics: dict) -> dict:
        title_lower = title.lower()
        
        # 1. Title Emotional Analysis (NLP)
        blob = TextBlob(title)
        sentiment_polarity = blob.sentiment.polarity
        sentiment_subjectivity = blob.sentiment.subjectivity
        
        # Count extreme words
        trigger_count = sum(1 for word in self.extreme_trigger_words if re.search(r'\b' + word + r'\b', title_lower))
        
        # Calculate Title Hype Level (0 to 100)
        hype_level = min(100.0, (trigger_count * 25.0) + (sentiment_subjectivity * 50.0))
        
        # 2. Visual Emotional Delivery (What the thumbnail proves)
        # Did they include a face with an emotional reaction?
        emotional_visibility = visual_metrics.get("emotional_visibility_score", 0.0)
        # Is the color palette intense enough to match an "insane" title?
        saturation = visual_metrics.get("saturation_score", 50.0)
        
        # Visual Delivery Score (0 to 100)
        visual_delivery = (emotional_visibility * 0.6) + (saturation * 0.4)
        
        # 3. The Clickbait Gap Calculation
        # If hype is high but delivery is low, they are lying to the audience.
        gap = hype_level - visual_delivery
        
        risk_level = "Low"
        warning = ""
        penalty = 0.0
        
        if gap > 40:
            risk_level = "High"
            penalty = gap * 0.3 # Subtract up to 15-20 points from the total score
            warning = (f"High Bounce Risk! Your title sets an extreme expectation ({trigger_count} trigger words), "
                      f"but your thumbnail lacks the emotional proof or visual intensity to back it up. "
                      f"Viewers will click and immediately leave.")
        elif gap > 20:
            risk_level = "Medium"
            penalty = gap * 0.1
            warning = "Slight Clickbait Risk: Your title is highly sensational, ensure the first 5 seconds of the video immediately deliver on this promise."
        elif gap < -30:
            # Reverse clickbait - visual is crazy, title is boring
            risk_level = "High (Under-promised)"
            penalty = 5.0
            warning = "Your thumbnail is highly intense, but your title is boring. The algorithm will struggle to find the right audience."
            
        return {
            "title_hype_score": hype_level,
            "visual_delivery_score": visual_delivery,
            "clickbait_gap": gap,
            "retention_risk_level": risk_level,
            "retention_warning": warning,
            "score_penalty": penalty
        }
