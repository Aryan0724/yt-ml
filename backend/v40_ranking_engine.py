import pandas as pd
import numpy as np
from catboost import CatBoostRegressor, CatBoostClassifier
import json
import os

DATA_DIR = "d:/research/youtube_dataset"

class RankingEngineV40:
    def __init__(self, model_dir=DATA_DIR):
        self.model_dir = model_dir
        
        # 1. Models
        self.ranker = CatBoostRegressor()
        self.ranker.load_model(os.path.join(model_dir, "v40_ranking_engine.pkl"))
        self.detector = CatBoostClassifier()
        self.detector.load_model(os.path.join(model_dir, "v40_breakout_detector.pkl"))
        
        # 2. Support Systems
        with open(os.path.join(model_dir, "v40_feature_list.json")) as f:
            self.features_order = json.load(f)
            
        with open(os.path.join(model_dir, "channel_stats.json")) as f:
            self.channel_stats = json.load(f)
            
        self.version = '4.0-NATIVE-NLP'

    def _build_features(self, raw: dict):
        row = {**raw}
        
        # Basic cleanup
        row['title'] = str(raw.get('title', ''))
        row['category'] = str(raw.get('category', 'Unknown'))
        row['title_length'] = len(row['title'])
        row['is_question'] = 1 if '?' in row['title'] else 0
        row['has_bracket'] = 1 if '[' in row['title'] or '(' in row['title'] else 0
        row['brightness'] = raw.get('brightness', 128)
        row['face_count'] = raw.get('face_count', 0)
        row['video_length'] = raw.get('video_length', 600)
        row['upload_hour'] = raw.get('upload_hour', 12)
        row['is_weekend'] = raw.get('is_weekend', 0)
        
        # Authority & Channel DNA
        chan = str(raw.get('channel_title', 'Unknown'))
        row['channel_title'] = chan
        
        # Get defaults from channel_stats
        chan_data = self.channel_stats.get(chan, {'authority_score': 1.0, 'est_sub_count': 1000})
        
        # If the input explicitly provides a sub_count (e.g., from external testing), use it!
        if 'sub_count' in raw:
            try:
                provided_subs = int(float(raw['sub_count']))
                row['est_sub_count'] = provided_subs
            except:
                row['est_sub_count'] = chan_data.get('est_sub_count', 1000)
        else:
            row['est_sub_count'] = chan_data.get('est_sub_count', 1000)
            
        row['authority_score'] = chan_data.get('authority_score', 1.0)
        
        # Build DF
        df = pd.DataFrame([row])
        for col in self.features_order:
            if col not in df.columns:
                df[col] = 0
        
        return df[self.features_order], row['authority_score']

    def predict(self, raw: dict) -> dict:
        df, authority = self._build_features(raw)
        
        # ML Predictions
        raw_pred = float(self.ranker.predict(df)[0])
        ml_rank = float(np.clip(raw_pred, 0, 100))
        breakout_prob = float(self.detector.predict_proba(df)[0][1])
        
        # --- STABILITY CALIBRATION ---
        # 1. Output Calibration: Smooth extreme probabilities
        if breakout_prob > 0.95: breakout_prob = 0.95 + (breakout_prob - 0.95) * 0.1
        
        # Tiers
        if   ml_rank >= 85: tier = "S-Tier (Viral Breakout)"
        elif ml_rank >= 70: tier = "A-Tier (High Growth)"
        elif ml_rank >= 50: tier = "B-Tier (Steady)"
        elif ml_rank >= 35: tier = "C-Tier (Low Impact)"
        else:               tier = "D-Tier (Flop)"
        
        return {
            'score': round(ml_rank, 1),
            'breakout_probability': round(breakout_prob, 3),
            'tier': tier,
            'features': {
                'title_length': int(df['title_length'].iloc[0]),
                'is_question': int(df['is_question'].iloc[0]),
                'face_count': int(df['face_count'].iloc[0])
            },
            'ml_rank': ml_rank
        }

    def _score(self, raw: dict):
        res = self.predict(raw)
        return res['score'], res['ml_rank'], res['breakout_probability'], res['score']

if __name__ == "__main__":
    engine = RankingEngineV40()
    sample = {
        'title': "I Built a $10,000 Trading Bot from Scratch!",
        'category': 'Tech',
        'video_length': 1200,
        'face_count': 1,
        'brightness': 180
    }
    print(json.dumps(engine.predict(sample), indent=2))
