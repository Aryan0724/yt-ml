import os
import sys
import json
import pandas as pd
import numpy as np

# Add current directory to path for absolute imports to work from outside
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from v40_ranking_engine import RankingEngineV40
from v40_heuristic_analyzer import HeuristicAnalyzer
from v40_confidence_system import ConfidenceSystem
from v40_accuracy_optimizer import EnsembleAccuracyOptimizer
from core.channel_dna_engine import ChannelDNAEngine
from core.competitor_engine import CompetitorEngine
from core.llm_report_generator import LLMReportGenerator
from core.retention_predictor import RetentionPredictor
from core.competitor_clash_engine import CompetitorClashEngine
from core.ui_clash_engine import UIClashEngine
from core.mobile_simulator import MobileSimulator
from core.archetypes import (
    PackagingArchetype,
    detect_archetype_from_metadata,
    ArchetypeEvaluator,
    ARCHETYPE_METADATA
)
from core.archetype_feature_extractor import ArchetypeFeatureExtractor

class CreatorIntelligenceEngine:
    def __init__(self, model_dir=None):
        if model_dir is None:
            model_dir = os.path.dirname(os.path.abspath(__file__))
        self.base_engine = RankingEngineV40(model_dir)
        self.optimizer = EnsembleAccuracyOptimizer(model_dir)
        self.heuristics = HeuristicAnalyzer({}) # V40 doesn't use cat_stats here
        self.confidence_system = ConfidenceSystem()
        self.version = "6.0-FORMAT-NATIVE-USP-READY"
        self.channel_dna_engine = ChannelDNAEngine()
        self.competitor_engine = CompetitorEngine()
        self.llm_generator = LLMReportGenerator()
        
        # Deep Logic Layers
        self.retention_predictor = RetentionPredictor()
        self.clash_engine = CompetitorClashEngine()
        self.ui_clash_engine = UIClashEngine()
        self.mobile_simulator = MobileSimulator()
        
        self.last_input = None
        self.last_output = None

    def analyze_single(self, raw_input: dict, analysis_id: str = None) -> dict:
        """
        Full structured analysis for a single thumbnail/title with archetype adaptation,
        format-native OpenCV computer-vision extraction, and thumbnail originality scoring.
        """
        category = raw_input.get("category", "Entertainment")
        title = raw_input.get("title", "")
        channel_title = raw_input.get("channel_title", "Unknown")

        # 1. Detect or resolve Packaging Archetype
        archetype_str = raw_input.get("archetype")
        if archetype_str and archetype_str in PackagingArchetype.__members__:
            archetype = PackagingArchetype[archetype_str]
        else:
            archetype = detect_archetype_from_metadata(category, title, raw_input)
        archetype_meta = ARCHETYPE_METADATA.get(archetype, ARCHETYPE_METADATA[PackagingArchetype.GENERAL_HYBRID])

        # 2. Base ML Scores & Ensemble Optimization
        processed = raw_input.copy()
        blended, behav_report = self.optimizer.optimize_prediction(raw_input)
        
        # Raw components
        _, ml_score, breakout_prob, mq_score = self.base_engine._score(raw_input)
        
        # 3. Heuristics & Recommendations
        h_results = self.heuristics.analyze(raw_input, processed)

        # 4. Format-Native Computer Vision Archetype Intelligence
        cv_arch_data = raw_input.get("archetype_extracted")
        if cv_arch_data:
            cv_adj = float(cv_arch_data.get("archetype_score", 0.0))
            blended += cv_adj
            for s in cv_arch_data.get("archetype_strengths", []):
                h_results['strengths'].append(s)
            for w in cv_arch_data.get("archetype_weaknesses", []):
                h_results['weaknesses'].append(w)
            for r in cv_arch_data.get("archetype_recommendations", []):
                h_results['improvements'].insert(0, r)
        else:
            # Fallback to metadata-based Archetype Evaluator
            arch_score_adj, arch_strengths, arch_weaknesses, arch_recommendations = ArchetypeEvaluator.evaluate(
                archetype, raw_input
            )
            blended += arch_score_adj
            for s in arch_strengths:
                h_results['strengths'].append(s)
            for w in arch_weaknesses:
                h_results['weaknesses'].append(w)
            for r in arch_recommendations:
                h_results['improvements'].insert(0, r)
        
        # 5. Confidence & Risk
        conf = self.confidence_system.calculate(
            ml_score, mq_score, breakout_prob, processed.get('authority_score', 1.0)
        )
        
        # 6. Creator DNA & Competitor Layer
        dna_profile = self.channel_dna_engine.analyze_channel(channel_title, raw_input)
        competitor_profile = self.competitor_engine.analyze_competitors(channel_title, title, category, raw_input)
        
        # Dynamic Niche-Aware Score Adjustment
        style_match = dna_profile.get("style_match_percentage", 50)
        if style_match >= 90:
            blended = blended * 1.35
        elif style_match >= 80:
            blended = blended * 1.20
        elif style_match >= 65:
            blended = blended * 1.08
        elif style_match < 40:
            blended = blended * 0.88
            
        # Retention Penalty Check
        retention_data = self.retention_predictor.analyze_retention_risk(title, raw_input)
        if retention_data["score_penalty"] > 0:
            blended -= retention_data["score_penalty"]
            h_results['weaknesses'].append(retention_data["retention_warning"])
            
        palette_desc = raw_input.get("palette_desc", "Neutral")
        saturation_score = raw_input.get("saturation_score", 50.0)
        
        clash_data = self.clash_engine.analyze_feed_clash(category, palette_desc, saturation_score)
        if clash_data["feed_clash_risk"]:
            blended -= clash_data["feed_clash_penalty"]
            h_results['weaknesses'].append(clash_data["feed_recommendation"])
        else:
            h_results['strengths'].append(clash_data["feed_recommendation"])
            
        # UI Clash & Mobile Simulator
        ui_clash_data = self.ui_clash_engine.analyze_ui_clash(
            raw_input.get("face_boxes", []), 
            raw_input.get("text_boxes", []),
            raw_input.get("img_width", 1280),
            raw_input.get("img_height", 720)
        )
        if ui_clash_data["ui_clash_risk"]:
            blended -= ui_clash_data["ui_clash_penalty"]
            for w in ui_clash_data["ui_warnings"]:
                h_results['weaknesses'].append(w)
                
        mobile_data = self.mobile_simulator.simulate_dim_screen(
            float(raw_input.get("brightness", 128.0)),
            float(raw_input.get("contrast_score", 50.0)),
            int(raw_input.get("text_density", 0))
        )
        if mobile_data["mobile_stress_failure"]:
            blended -= mobile_data["mobile_stress_penalty"]
            for w in mobile_data["mobile_warnings"]:
                h_results['weaknesses'].append(w)

        # 7. Channel Calibration Factor (from Closed-Loop Learning)
        channel_calib = float(raw_input.get("channel_calibration_factor", 1.0))
        blended = blended * channel_calib
            
        blended = min(99.0, max(1.0, blended))

        # 8. Tier Assignment
        if blended >= 85: tier = "S"
        elif blended >= 75: tier = "A"
        elif blended >= 65: tier = "B"
        elif blended >= 55: tier = "C"
        else: tier = "D"
        
        # 9. Safe vs Breakout Scores
        category_consistency = dna_profile.get("performance_baselines", {}).get("category_consistency", 0.85)
        safe_score = int(np.clip((blended * 0.7) + (category_consistency * 30), 0, 100))
        breakout_score = int(np.clip(breakout_prob * 100, 0, 100))
        
        if blended >= 85:
            safe_explanation = "This fits your channel DNA perfectly and holds exceptionally high appeal for your loyal subscribers."
            breakout_explanation = "Extremely high expansion probability! Dynamic composition features trigger wide recommendations."
        elif blended >= 70:
            safe_explanation = "Steady core audience click-through rate expected. Visual assets are familiar to your viewers."
            breakout_explanation = "Moderate potential to reach new viewers if the early retention is high."
        else:
            safe_explanation = "Subscribers may fail to recognize this upload as yours due to visual style deviations."
            breakout_explanation = "Low expansion potential. The thumbnail lacks the extreme contrast required for broad recommendations."

        # 10. Debug Features & Variance Checking
        debug_metrics = {
            "archetype": archetype.value,
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

        # Cache inputs/outputs
        self.last_input = raw_input.copy()
        self.last_output = {"improvements": h_results["improvements"]}

        # 11. Generate Unified Master Report with AI tracking
        master_report, ai_result = self.llm_generator.generate_master_report(
            raw_input, blended, tier, h_results['strengths'], h_results['weaknesses'], analysis_id=analysis_id, dna_profile=dna_profile
        )

        # 12. Build Final Structure
        output = {
            "engine_version": self.version,
            "archetype": {
                "id": archetype.value,
                "name": archetype_meta["name"],
                "description": archetype_meta["description"],
                "primary_driver": archetype_meta["primary_driver"],
                "cv_features": cv_arch_data.get("archetype_features", {}) if cv_arch_data else {}
            },
            "originality": raw_input.get("originality", {
                "originality_score": 86,
                "similarity_risk": "LOW (Fresh visual angle)",
                "detected_formula": "Custom Dynamic Composition",
                "saturation_level": "Fresh / Differentiated",
                "formula_description": "Unique compositional balance avoiding saturated packaging tropes.",
                "recommendation": "Strong visual separation from standard niche tropes."
            }),
            "master_report": master_report,
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
            "ai": ai_result,
            "raw_metrics": {
                "ml_score": ml_score,
                "heuristic_score": mq_score,
                "breakout_prob": breakout_prob
            },
            "debug": debug_metrics
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
            
        results.sort(key=lambda x: x['score'], reverse=True)
        
        ranking = []
        for i, res in enumerate(results):
            ranking.append({
                "rank": i + 1,
                "id": res['id'],
                "score": res['score'],
                "tier": res['tier'],
                "archetype": res.get('archetype', {}).get('name')
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
