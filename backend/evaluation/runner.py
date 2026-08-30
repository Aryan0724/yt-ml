import os
import sys
import json
import uuid
import time
from tqdm import tqdm

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from evaluation.datasets import EvaluationDataset
from evaluation.metrics import DeterministicMetrics, RuleBasedMetrics
from evaluation.judges import LLMJudge
from services.analysis.coordinator import AnalysisCoordinator

# Since we want to test "Combinations A-F", we would technically need feature flags or mock injections.
# A = V1 Engine
# B = V2 Engine
# C = V1 Engine + old AI
# D = V2 Engine + new AI
# E = V2 + Topic Intelligence
# F = V2 + Topic Intelligence + Gemini

class EvaluationRunner:
    def __init__(self):
        self.dataset = EvaluationDataset()
        self.judge = LLMJudge()
        self.coordinator = AnalysisCoordinator()
        
    def run_combination_f(self, samples_limit: int = 5):
        """
        Runs Combination F (V2 + Topic Intelligence + Gemini)
        Because running 100 samples against Gemini takes a few minutes, we allow a limit.
        """
        samples = self.dataset.get_stratified_sample()
        if samples_limit:
            samples = samples[:samples_limit]
            
        det_metrics = DeterministicMetrics()
        rule_metrics = RuleBasedMetrics()
        
        judge_scores = []
        
        print(f"Running Evaluation for {len(samples)} samples...")
        
        for sample in tqdm(samples):
            # Convert CSV row to raw_input format
            raw_input = {
                "title": str(sample.get("title", "")),
                "category": str(sample.get("category", "General")),
                "channel_title": str(sample.get("channel_title", "Unknown")),
                "video_length": float(sample.get("video_length", 600)),
                "face_count": int(sample.get("face_count", 0)),
                "brightness": float(sample.get("brightness", 120.0)),
                "contrast_score": 50.0,
                "saturation_score": 50.0,
                "clutter_level_rating": float(sample.get("visual_clutter", 0.0)),
                "text_density": 0,
                "mobile_readability": 100
            }
            
            # Execute full pipeline
            analysis_id = str(uuid.uuid4())
            try:
                # We mock image_bytes as None since this is metadata-driven evaluation
                result = self.coordinator.analyze_single(raw_input, None, analysis_id)
                
                det_metrics.add_result(result)
                rule_metrics.add_result(result)
                
                ai_data = result.get("ai", {})
                if ai_data.get("status") == "success" and ai_data.get("enhancement"):
                    # Score with Judge
                    prompt = ai_data.get("metadata", {}).get("prompt", "")
                    ai_output = json.dumps(ai_data.get("enhancement"), indent=2)
                    
                    scores = self.judge.evaluate(prompt, ai_output)
                    judge_scores.append(scores)
                    
            except Exception as e:
                safe_title = sample.get('title', '').encode('ascii', 'ignore').decode('ascii')
                print(f"Error on sample {safe_title}: {e}")
                
        # Aggregate LLM Judge Scores
        avg_scores = {
            "relevance": 0.0,
            "completeness": 0.0,
            "specificity": 0.0,
            "clarity": 0.0,
            "actionability": 0.0
        }
        if judge_scores:
            for s in judge_scores:
                avg_scores["relevance"] += s.relevance
                avg_scores["completeness"] += s.completeness
                avg_scores["specificity"] += s.specificity
                avg_scores["clarity"] += s.clarity
                avg_scores["actionability"] += s.actionability
                
            for k in avg_scores:
                avg_scores[k] = round(avg_scores[k] / len(judge_scores), 2)
                
        print("\n┌────────────────────────────────────┐")
        print("│ PREYT V2 EVALUATION (F)            │")
        print("├────────────────────────────────────┤")
        print(f"│ Relevance     {avg_scores['relevance']:.1f} / 5.0            │")
        print(f"│ Completeness  {avg_scores['completeness']:.1f} / 5.0            │")
        print(f"│ Specificity   {avg_scores['specificity']:.1f} / 5.0            │")
        print(f"│ Clarity       {avg_scores['clarity']:.1f} / 5.0            │")
        print(f"│ ACTIONABILITY {avg_scores['actionability']:.1f} / 5.0            │")
        print("└────────────────────────────────────┘")
        
        print("\nDeterministic Metrics:", det_metrics.get_summary())
        print("Rule-Based Metrics:", rule_metrics.get_summary())

if __name__ == "__main__":
    runner = EvaluationRunner()
    runner.run_combination_f(samples_limit=5)
