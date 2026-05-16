import numpy as np
import pandas as pd
import json
import os
from v30_ranking_engine import RankingEngineV30
from behavioral_api_server import ViralPrescriber

class EnsembleAccuracyOptimizer:
    def __init__(self, data_dir="d:/research/youtube_dataset"):
        self.ranker = RankingEngineV30(data_dir)
        self.behavioral = ViralPrescriber() # Behavioral engine logic
        self.cat_stats = self.ranker.cat_stats
        
    def calibrate_score(self, score, category):
        """
        Niche-specific calibration. 
        Some categories (like Gaming) have high variance and need 'sharper' predictions.
        Others (like Education) are more linear.
        """
        cat_data = self.cat_stats.get(category, {})
        # If the category is highly competitive, we penalize average scores more heavily
        competition = cat_data.get('count', 100)
        if competition > 500:
            # High competition = hard to stand out, push lower scores down
            if score < 60:
                score *= 0.9
        
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
        
        # 2. Behavioral Behavioral Alignment
        # The prescriber gives us 'predicted_behavior' and 'behavioral_scores'
        behav_report = self.behavioral.generate_prescription(
            raw_input['title'], 
            raw_input['category'], 
            raw_input.get('video_length', 600),
            raw_input
        )
        
        # Behavioral adjustment factor
        # If hook_strength and curiosity_gap are BOTH high, we boost the ML score
        behav_proxies = behav_report['behavioral_scores']
        behav_boost = (behav_proxies['hook_strength'] + behav_proxies['curiosity_gap']) / 2.0
        
        # 3. Ensemble Synthesis
        # We give the behavioral boost a 20% weight (down from 30%) for stability
        ensemble_score = (blended * 0.8) + (behav_boost * 100 * 0.2)
        
        # 4. Final Calibration Pass
        final_score = self.calibrate_score(ensemble_score, raw_input['category'])
        
        return round(final_score, 1), behav_report

if __name__ == "__main__":
    optimizer = EnsembleAccuracyOptimizer()
    sample = {
        "title": "I spent 100 Hours in a Secret Underground City!",
        "category": "Gaming",
        "face_count": 1,
        "brightness": 190
    }
    score, report = optimizer.optimize_prediction(sample)
    print(f"Ensemble Optimized Score: {score}")
    print(f"Behavioral Insight: {report['predicted_behavior']}")
