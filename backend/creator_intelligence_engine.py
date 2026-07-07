import os
import sys
import json
import pandas as pd
import numpy as np

# Add current directory to path for absolute imports to work from outside
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from v30_ranking_engine import RankingEngineV30
from v40_heuristic_analyzer import HeuristicAnalyzer
from v40_confidence_system import ConfidenceSystem
from v40_accuracy_optimizer import EnsembleAccuracyOptimizer
from core.channel_dna_engine import ChannelDNAEngine
from core.competitor_engine import CompetitorEngine
from core.llm_report_generator import LLMReportGenerator

class CreatorIntelligenceEngine:
    def __init__(self, model_dir=None):
        if model_dir is None:
            model_dir = os.path.dirname(os.path.abspath(__file__))
        self.base_engine = RankingEngineV30(model_dir)
        self.optimizer = EnsembleAccuracyOptimizer(model_dir)
        self.heuristics = HeuristicAnalyzer(self.base_engine.cat_stats)
        self.confidence_system = ConfidenceSystem()
        self.version = "2.0-ULTIMATE-INTELLIGENCE"
        self.channel_dna_engine = ChannelDNAEngine()
        self.competitor_engine = CompetitorEngine()
        self.llm_generator = LLMReportGenerator()
        self.last_input = None
        self.last_output = None

    def analyze_single(self, raw_input: dict) -> dict:
        """
        Full structured analysis for a single thumbnail/title.
        """
        # 1. Base Scores & Ensemble Optimization
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
        
        # 4. Creator DNA & Competitor Layer
        channel_title = raw_input.get("channel_title", "Unknown")
        category = raw_input.get("category", "Entertainment")
        title = raw_input.get("title", "")
        
        dna_profile = self.channel_dna_engine.analyze_channel(channel_title, raw_input)
        competitor_profile = self.competitor_engine.analyze_competitors(channel_title, title, category, raw_input)
        
        # --- NEW: Dynamic Niche-Aware Score Adjustment ---
        style_match = dna_profile.get("style_match_percentage", 50)
        
        # If the thumbnail aligns heavily with the channel's historical DNA, we boost the raw ML score
        # so it doesn't just blindly rate based on brightness/contrast!
        if style_match >= 90:
            blended = blended * 1.45  # Massive boost for perfect niche match
        elif style_match >= 80:
            blended = blended * 1.25
        elif style_match >= 65:
            blended = blended * 1.10
        elif style_match < 40:
            blended = blended * 0.85  # Penalty for deviating from what works in their niche
            
        blended = min(99.0, blended)

        # 5. Tier Assignment
        if blended >= 85: tier = "S"
        elif blended >= 75: tier = "A"
        elif blended >= 65: tier = "B"
        elif blended >= 55: tier = "C"
        else: tier = "D"
        
        # 6. Safe vs Breakout Scores
        category_consistency = dna_profile.get("performance_baselines", {}).get("category_consistency", 0.85)
        safe_score = int(np.clip((blended * 0.7) + (category_consistency * 30), 0, 100))
        breakout_score = int(np.clip(breakout_prob * 100, 0, 100))
        
        safe_explanation = ""
        breakout_explanation = ""
        if blended >= 85:
            safe_explanation = "This fits your channel DNA perfectly and holds exceptionally high appeal for your loyal subscribers."
            breakout_explanation = "Extremely high expansion probability! Dynamic composition features trigger wide recommendations."
        elif blended >= 70:
            safe_explanation = "Steady core audience click-through rate expected. Visual assets are familiar to your viewers."
            breakout_explanation = "Moderate potential to reach new viewers if the early retention is high."
        else:
            safe_explanation = "Subscribers may fail to recognize this upload as yours due to visual style deviations."
            breakout_explanation = "Low expansion potential. The thumbnail lacks the extreme contrast required for broad recommendations."

        # 7. Debug Features & Output Variance Validation
        debug_metrics = {
            "face_detected": raw_input.get("face_count", 0) > 0,
            "face_count": raw_input.get("face_count", 0),
            "face_boxes": raw_input.get("face_boxes", []),
            "ocr_text": raw_input.get("ocr_text", ""),
            "brightness": float(raw_input.get("brightness", 128.0)),
            "contrast_score": int(raw_input.get("contrast_score", 50)),
            "saturation_score": int(raw_input.get("saturation_score", 50)),
            "clutter_level_rating": float(raw_input.get("clutter_level_rating", 5.0)),
            "mobile_readability": raw_input.get("mobile_readability", 100),
            "text_density": int(raw_input.get("text_density", 0)),
            "curiosity_score": int(processed.get("hook_score", 0.5) * 100)
        }

        # Variance checking
        possible_static_output_bug = False
        if self.last_input is not None and self.last_output is not None:
            different_inputs = (
                (self.last_input.get("title") != raw_input.get("title")) or
                (abs(self.last_input.get("brightness", 0) - raw_input.get("brightness", 0)) > 2) or
                (self.last_input.get("face_count") != raw_input.get("face_count"))
            )
            # Compare generated improvements titles
            last_titles = [imp.get("title") for imp in self.last_output.get("improvements", []) if isinstance(imp, dict)]
            current_titles = [imp.get("title") for imp in h_results["improvements"] if isinstance(imp, dict)]
            same_recommendations = (last_titles == current_titles and len(last_titles) > 0)
            
            if different_inputs and same_recommendations:
                possible_static_output_bug = True

        # Cache inputs/outputs
        self.last_input = raw_input.copy()
        # Create a copy of the improvements for later validation comparison
        self.last_output = {"improvements": h_results["improvements"]}

        # NEW: Enhance improvements with LLM & generate executive summary
        enhanced_improvements = self.llm_generator.generate_intelligent_improvements(raw_input, h_results['improvements'], dna_profile=dna_profile)
        executive_summary = self.llm_generator.generate_executive_summary(
            raw_input, blended, tier, None, h_results['strengths'], h_results['weaknesses'], dna_profile=dna_profile
        )
        dna_alignment_analysis = self.llm_generator.generate_dna_alignment_insight(raw_input, dna_profile, tier)
        h_results['improvements'] = enhanced_improvements

        # 8. Build Final Structure
        output = {
            "engine_version": self.version,
            "executive_summary": executive_summary,
            "dna_alignment_analysis": dna_alignment_analysis,
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
            "channel_dna": dna_profile,
            "competitor_analysis": competitor_profile,
            "safe_vs_breakout": {
                "safe_score": safe_score,
                "safe_explanation": safe_explanation,
                "breakout_score": breakout_score,
                "breakout_explanation": breakout_explanation
            },
            "raw_metrics": {
                "ml_score": ml_score,
                "heuristic_score": mq_score,
                "breakout_prob": breakout_prob
            },
            "debug": debug_metrics,
            "possible_static_output_bug": possible_static_output_bug
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
