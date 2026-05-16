import numpy as np

class ConfidenceSystem:
    def __init__(self):
        pass
        
    def calculate(self, ml_score, mq_score, breakout_prob, authority_score):
        """
        Calculates confidence, reliability, and risk level.
        """
        # 1. Consensus check: Do ML and Heuristics agree?
        agreement = 1.0 - (abs(ml_score - mq_score) / 100.0)
        
        # 2. Authority factor: High authority channels are more predictable
        authority_confidence = np.clip(authority_score / 10.0, 0.5, 1.0)
        
        # 3. Breakout Probability skew: High probability with low ML score = High Risk/Novelty
        novelty_risk = "Low"
        if breakout_prob > 0.7 and ml_score < 50:
            novelty_risk = "High"
        elif breakout_prob > 0.4:
            novelty_risk = "Medium"
            
        confidence_val = (agreement * 0.6) + (authority_confidence * 0.4)
        
        if confidence_val > 0.8:
            confidence_level = "High"
            confidence_range = "±8 pts"
        elif confidence_val > 0.5:
            confidence_level = "Medium"
            confidence_range = "±15 pts"
        else:
            confidence_level = "Low"
            confidence_range = "±25 pts"
            
        reliability = "Stable" if confidence_val > 0.7 else "Volatile"
        risk_level = "Low" if ml_score > 60 and breakout_prob < 0.3 else "Medium"
        if breakout_prob > 0.6: risk_level = "High"

        return {
            "confidence": confidence_level,
            "confidence_range": confidence_range,
            "reliability": reliability,
            "risk_level": risk_level,
            "novelty_risk": novelty_risk
        }
