import numpy as np
import pandas as pd
import json
import os
from v40_ranking_engine import RankingEngineV40
from behavioral_api_server import ViralPrescriber

class EnsembleAccuracyOptimizer:
    def __init__(self, data_dir=None):
        if data_dir is None:
            data_dir = os.path.dirname(os.path.abspath(__file__))
        self.ranker = RankingEngineV40(data_dir)
        self.behavioral = ViralPrescriber() # Behavioral engine logic
        # For V40, cat_stats are not strictly maintained in the same way, but let's mock it for the prescriber if needed
        self.cat_stats = self.ranker.channel_stats # or simply ignore
        
    def calibrate_score(self, score, category):
        """
        Niche-specific calibration.
        Removed the 0.9 competition penalty to avoid trapping scores in D-Tier.
        """
        # Sigmoid-like sharpening for "Viral" candidates
        if score > 80:
            # Gentle boost for very high scores
            score = 80 + (score - 80) * 1.1
        elif score < 20:
            # Dampen very low scores
            score = score * 0.8
            
        return np.clip(score, 5, 95) # Avoid absolute 0 or 100 for trust

    def optimize_prediction(self, raw_input):
        """
        Combines ML Ranking with Behavioral Prescriptions and Calibration.
        """
        # 1. Base ML Ranking
        blended, ml_rank, breakout_prob, mq = self.ranker._score(raw_input)
        
        # 2. Behavioral Alignment
        # The prescriber gives us 'predicted_behavior' and 'behavioral_scores'
        behav_report = self.behavioral.generate_prescription(
            raw_input['title'], 
            raw_input['category'], 
            raw_input.get('video_length', 600),
            raw_input
        )
        
        # 3. Ensemble Synthesis
        # In V4.0 Native NLP, we fully trust the ML model and remove the 20% drag.
        ensemble_score = blended
        
        # 4. Final Calibration Pass
        final_score = self.calibrate_score(ensemble_score, raw_input['category'])
        
        return round(final_score, 1), behav_report

if __name__ == "__main__":
    optimizer = EnsembleAccuracyOptimizer()
    sample = {
        "title": "I Built a $10,000 Trading Bot from Scratch!",
        "category": "Tech",
        "face_count": 1,
        "brightness": 190
    }
    score, report = optimizer.optimize_prediction(sample)
    print(f"Ensemble Optimized Score: {score}")
    print(f"Behavioral Insight: {report['predicted_behavior']}")
