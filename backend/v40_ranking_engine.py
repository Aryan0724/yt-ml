import pandas as pd
import numpy as np
from catboost import CatBoostRegressor, CatBoostClassifier
import json
import os
import re
from behavioral_logic import BehavioralLogic
from statistical_context import StatisticalContext

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
        
        self.bl = BehavioralLogic()
        self.sc = StatisticalContext(os.path.join(model_dir, "v40_category_stats.json"))
        
        with open(os.path.join(model_dir, "channel_stats.json")) as f:
            self.channel_stats = json.load(f)
            
        self.version = '4.0-BEHAVIORAL'

    def _build_features(self, raw: dict) -> pd.DataFrame:
        # Behavioral Proxies
        proxies = self.bl.get_all_proxies(raw.get('title', ''))
        row = {**raw, **proxies}
        
        # Basic cleanup
        row['title_length'] = len(str(raw.get('title', '')))
        row['is_question'] = 1 if '?' in str(raw.get('title', '')) else 0
        row['has_bracket'] = 1 if '[' in str(raw.get('title', '')) or '(' in str(raw.get('title', '')) else 0
        row['brightness_normalized'] = row.get('brightness', 128) / 255.0
        row['video_length'] = row.get('video_length', 600)
        
        # Authority
        chan = raw.get('channel_title', 'Unknown')
        chan_data = self.channel_stats.get(chan, {'authority_score': 1.0, 'est_sub_count': 1000, 'category_consistency': 0.1, 'video_count': 5})
        row['authority_score'] = chan_data.get('authority_score', 1.0)
        row['log_est_sub_count'] = np.log10(max(100, chan_data.get('est_sub_count', 1000)))
        row['category_consistency'] = chan_data.get('category_consistency', 0.1)
        row['video_count'] = chan_data.get('video_count', 5)
        
        # Linguistic DNA
        t = str(raw.get('title', '')).lower()
        row['title_power_word_count'] = len(re.findall(r'\b(secret|exposed|shocking|actually|truth|mistake|stop)\b', t))
        row['title_has_number'] = 1 if re.search(r'\d+', t) else 0
        row['title_caps_ratio'] = sum(1 for c in str(raw.get('title', '')) if c.isupper()) / (len(str(raw.get('title', ''))) + 1)
        
        # Statistical Context (Z-Scores & P90 Gaps)
        row = self.sc.transform_row(row)
        
        # Interactions
        row['novelty'] = 1.0 / (self.sc.stats.get(str(row.get('category', 'Entertainment')), {}).get('count', 100) + 1)
        row['viral_signal'] = row['hook_strength'] * row['curiosity_gap'] * row['simplicity_score'] * (row['novelty'] + 0.1)
        row['retention_balance'] = np.log10(row['video_length'] + 1) * row['narrative_density']
        row['engagement_potential'] = row['hook_strength'] * (row['authority_score'] + 0.5)
        
        # Build DF
        df = pd.DataFrame([row])
        for col in self.features_order:
            if col not in df.columns:
                df[col] = 0
        return df[self.features_order]

    def predict(self, raw: dict) -> dict:
        df = self._build_features(raw)
        
        # ML Predictions
        ml_rank = float(np.clip(self.ranker.predict(df)[0], 0, 100))
        breakout_prob = float(self.detector.predict_proba(df)[0][1])
        
        # --- STABILITY CALIBRATION ---
        # 1. Output Calibration: Smooth extreme probabilities
        if breakout_prob > 0.95: breakout_prob = 0.95 + (breakout_prob - 0.95) * 0.1
        
        # 2. Authority Smoothing: Low authority channels have higher variance
        authority = df['authority_score'].iloc[0]
        if authority < 2.0:
            ml_rank = ml_rank * 0.9 # Conservative ranking for unknown creators
            
        # Tiers
        if   ml_rank >= 85: tier = "S-Tier (Viral Breakout)"
        elif ml_rank >= 70: tier = "A-Tier (High Growth)"
        elif ml_rank >= 40: tier = "B-Tier (Steady)"
        else:               tier = "C-Tier (Low Impact)"
        
        return {
            'score': round(ml_rank, 1),
            'breakout_probability': round(breakout_prob, 3),
            'tier': tier,
            'features': {
                'hook_strength': round(float(df['hook_strength'].iloc[0]), 2),
                'curiosity_gap': round(float(df['curiosity_gap'].iloc[0]), 2),
                'narrative_density': round(float(df['narrative_density'].iloc[0]), 2),
                'simplicity_score': round(float(df['simplicity_score'].iloc[0]), 2),
                'viral_signal': round(float(df['viral_signal'].iloc[0]), 2)
            }
        }

if __name__ == "__main__":
    engine = RankingEngineV40()
    sample = {
        'title': "I Built a Secret Room in My House but It Went Wrong!",
        'category': 'Entertainment',
        'video_length': 1200,
        'face_count': 1,
        'brightness': 180
    }
    print(json.dumps(engine.predict(sample), indent=2))
