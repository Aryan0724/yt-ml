import os
import json
import pandas as pd
import numpy as np
from v30_ranking_engine import RankingEngineV30
from v40_heuristic_analyzer import HeuristicAnalyzer
from v40_confidence_system import ConfidenceSystem
from v40_accuracy_optimizer import EnsembleAccuracyOptimizer

class CreatorIntelligenceEngine:
    def __init__(self, model_dir=None):
        if model_dir is None:
            model_dir = os.path.dirname(os.path.abspath(__file__))
        self.base_engine = RankingEngineV30(model_dir)
        self.optimizer = EnsembleAccuracyOptimizer(model_dir)
        self.heuristics = HeuristicAnalyzer(self.base_engine.cat_stats)
        self.confidence_system = ConfidenceSystem()
        self.version = "1.1-ENSEMBLE-BETA"

    def analyze_single(self, raw_input: dict) -> dict:
        """
        Full structured analysis for a single thumbnail/title.
        """
        # 1. Base Scores & Ensemble Optimization
        # We now use the Ensemble Optimizer which blends ML + Behavioral + Calibration
        processed = self.base_engine._relativize(raw_input)
        blended, behav_report = self.optimizer.optimize_prediction(raw_input)
        
        # Get raw components for risk analysis
        _, ml_score, breakout_prob, mq_score = self.base_engine._score(raw_input)
        
        # 2. Heuristics & Recommendations
        h_results = self.heuristics.analyze(raw_input, processed)
        
        # 3. Confidence & Risk
        conf = self.confidence_system.calculate(
            ml_score, mq_score, breakout_prob, processed.get('authority_score', 1.0)
        )
        
        # 4. Tier Assignment
        if blended >= 85: tier = "S"
        elif blended >= 70: tier = "A"
        elif blended >= 40: tier = "B"
        else: tier = "C"

        # 5. Build Final Structure
        output = {
            "engine_version": self.version,
            "score": int(blended),
            "tier": tier,
            "confidence": conf['confidence'],
            "confidence_range": conf['confidence_range'],
            "reliability": conf['reliability'],
            "risk_level": conf['risk_level'],
            "novelty_risk": conf['novelty_risk'],
            "factors": h_results['factors'],
            "strengths": h_results['strengths'],
            "weaknesses": h_results['weaknesses'],
            "improvements": h_results['improvements'],
            "raw_metrics": {
                "ml_score": ml_score,
                "heuristic_score": mq_score,
                "breakout_prob": breakout_prob
            }
        }
        return output

    def compare_thumbnails(self, options: list) -> dict:
        """
        Options is a list of dicts (thumbnails/titles).
        Returns ranking and relative performance.
        """
        results = []
        for i, opt in enumerate(options):
            analysis = self.analyze_single(opt)
            analysis['id'] = opt.get('id', f"Option {chr(65+i)}")
            results.append(analysis)
            
        # Sort by score descending
        results.sort(key=lambda x: x['score'], reverse=True)
        
        ranking = []
        for i, res in enumerate(results):
            ranking.append({
                "rank": i + 1,
                "id": res['id'],
                "score": res['score'],
                "tier": res['tier']
            })
            
        comparison_brief = ""
        if len(results) >= 2:
            best = results[0]
            second = results[1]
            lift = ((best['score'] - second['score']) / (second['score'] + 1)) * 100
            comparison_brief = f"{best['id']} is predicted to outperform {second['id']} by {int(lift)}%."

        return {
            "brief": comparison_brief,
            "ranking": ranking,
            "detailed_results": results
        }

if __name__ == "__main__":
    engine = CreatorIntelligenceEngine()
    
    # Test Comparison Mode
    options = [
        {
            "id": "Thumbnail A",
            "title": "I survived 100 days in a desert",
            "category": "Gaming",
            "face_count": 0,
            "brightness": 120
        },
        {
            "id": "Thumbnail B",
            "title": "How I Survived 100 Days in the Desert!",
            "category": "Gaming",
            "face_count": 1,
            "brightness": 180
        }
    ]
    
    report = engine.compare_thumbnails(options)
    print(json.dumps(report, indent=2))
