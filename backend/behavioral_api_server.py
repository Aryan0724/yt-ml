import joblib
import pandas as pd
import numpy as np
from behavioral_simulation_engine import PsychologicalProxyExtractor
import os

MODEL_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "behavioral_engine_v1.pkl")
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "behavioral_intelligence_vault.csv")

class ViralPrescriber:
    def __init__(self):
        self.extractor = PsychologicalProxyExtractor()
        if os.path.exists(MODEL_FILE):
            self.model = joblib.load(MODEL_FILE)
        else:
            self.model = None
            print("Warning: Behavioral Model not found. Insights will be heuristic only.")
            
        self.tier_map = {0: 'Graveyard', 1: 'Stable', 2: 'High', 3: 'Breakout'}

    def generate_prescription(self, title, category, video_length, thumb_data=None):
        """
        Generates a full behavioral audit and prescription report.
        """
        # 1. Extract Proxies
        row = {
            'title': title,
            'category': category,
            'video_length': video_length,
            'face_count': thumb_data.get('face_count', 0) if thumb_data else 0,
            'visual_saliency': thumb_data.get('visual_saliency', 0.5) if thumb_data else 0.5,
            'brightness': thumb_data.get('brightness', 128) if thumb_data else 128,
            'video_age_days': 0, # Assume new for prescription
            'is_weekend': 0,
            'upload_hour': 12
        }
        
        proxies = self.extractor.extract_all_proxies(row)
        
        # 2. Predict Tier & Confidence
        prediction = "Unknown"
        confidence = 0.0
        if self.model:
            # Construct a complete feature vector matching the training set
            feature_data = {
                'hook_strength': proxies['hook_strength'],
                'curiosity_gap': proxies['curiosity_gap'],
                'retention_risk': proxies['retention_risk'],
                'narrative_tension': proxies['narrative_tension'],
                'engagement_potential': proxies['engagement_potential'],
                'visual_saliency': row['visual_saliency'],
                'face_count': row['face_count'],
                'object_count': 4,
                'brightness': row['brightness'],
                'video_length': row['video_length'],
                'is_weekend': 0,
                'upload_hour': 12
            }
            mock_df = pd.DataFrame([feature_data])
            
            # Prediction
            # We need to add all category columns as 0, except the one matching 'category'
            for col in self.model.feature_names_in_:
                if col.startswith('category_'):
                    feature_data[col] = 1 if col == f"category_{category}" else 0
            
            mock_df = pd.DataFrame([feature_data])
            # Ensure column order matches training
            mock_df = mock_df[self.model.feature_names_in_]
            
            pred_id = self.model.predict(mock_df)[0]
            probs = self.model.predict_proba(mock_df)[0]
            prediction = self.tier_map.get(pred_id, "Unknown")
            confidence = probs[pred_id]

        # 3. Generate Actionable Insights
        insights = []
        if proxies['hook_strength'] < 0.5:
            insights.append("HOOK IS WEAK: Your title lacks high-intensity emotional triggers. Add words like 'Mistake', 'Secret', or 'Hidden'.")
        else:
            insights.append("HOOK IS STRONG: Great use of power words.")
            
        if proxies['curiosity_gap'] < 0.5:
            insights.append("CURIOSITY GAP IS NARROW: You are telling the whole story in the title. Use 'This' or 'Why' to create an open loop.")
            
        if proxies['retention_risk'] > 0.5:
            insights.append("RETENTION RISK IS HIGH: The video length is too long for the current title complexity. Consider a shorter, punchier edit.")

        return {
            'title': title,
            'predicted_behavior': prediction,
            'confidence': f"{confidence*100:.1f}%",
            'behavioral_scores': proxies,
            'prescriptions': insights
        }

if __name__ == "__main__":
    prescriber = ViralPrescriber()
    report = prescriber.generate_prescription(
        title="I tried every AI tool for 30 days",
        category="Tech",
        video_length=1200,
        thumb_data={'face_count': 1, 'visual_saliency': 0.8, 'brightness': 180}
    )
    
    print("\n" + "="*50)
    print("      YOUTUBE AUDIENCE BEHAVIOR AUDIT")
    print("="*50)
    print(f"TITLE: {report['title']}")
    print(f"PREDICTED BEHAVIOR: {report['predicted_behavior']} ({report['confidence']} confidence)")
    print("-" * 50)
    print("BEHAVIORAL SCORES:")
    for k, v in report['behavioral_scores'].items():
        print(f"  {k.replace('_', ' ').upper():<20} : {v}")
    print("-" * 50)
    print("ACTIONABLE INSIGHTS:")
    for ins in report['prescriptions']:
        print(f" {ins}")
    print("="*50)
