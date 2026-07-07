import os
import pandas as pd
from catboost import CatBoostRegressor, CatBoostClassifier
import json

def train_models():
    data_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(data_dir, "diamond_intelligence_vault.csv")
    
    print(f"Loading dataset from {dataset_path}...")
    df = pd.read_csv(dataset_path)
    
    # We want to train on raw text, basic metadata, AND channel authority!
    features = [
        'title', 'category', 'channel_title', 'face_count', 'brightness', 
        'video_length', 'title_length', 'is_question', 
        'has_bracket', 'upload_hour', 'is_weekend',
        'est_sub_count', 'authority_score'
    ]
    
    text_features = ['title']
    cat_features = ['category', 'channel_title']
    
    # Load channel stats to enrich the dataset
    channel_stats_path = os.path.join(data_dir, "channel_stats.json")
    if os.path.exists(channel_stats_path):
        with open(channel_stats_path, "r", encoding="utf-8", errors="ignore") as f:
            c_stats = json.load(f)
        
        # Create mapping dicts
        sub_map = {k: v.get('est_sub_count', 1000) for k, v in c_stats.items()}
        auth_map = {k: v.get('authority_score', 1.0) for k, v in c_stats.items()}
        
        df['est_sub_count'] = df['channel_title'].map(sub_map).fillna(1000)
        df['authority_score'] = df['channel_title'].map(auth_map).fillna(1.0)
    else:
        df['est_sub_count'] = 1000
        df['authority_score'] = 1.0
        
    # Ensure all features exist and fill NaNs
    for f in features:
        if f not in df.columns:
            print(f"Warning: Feature {f} missing from dataset! Adding dummy.")
            df[f] = 0
            
    df['title'] = df['title'].fillna("").astype(str)
    df['category'] = df['category'].fillna("Unknown").astype(str)
    df['channel_title'] = df['channel_title'].fillna("Unknown").astype(str)
    df.fillna(0, inplace=True)
    
    X = df[features]
    
    # Target 1: ML Rank (Regressor)
    # Convert view_count to a true 0-100 score using percentile ranking.
    # This aligns the ML score with actual audience reach (S/A/B/C tiers).
    y_reg = df['view_count'].rank(pct=True) * 100.0
    
    # Target 2: Breakout Detector (Classifier)
    if 'success_tier' in df.columns:
        # success_tier contains 'S', 'A', 'B', 'C', 'D'
        # Treat 'S' and 'A' as breakout
        y_clf = df['success_tier'].isin(['S', 'A']).astype(int)
    else:
        y_clf = (df['view_count'] > df['view_count'].median()).astype(int)
        
    print("Training CatBoostRegressor (V4.0 Native NLP)...")
    regressor = CatBoostRegressor(
        iterations=300, 
        learning_rate=0.1, 
        depth=6, 
        text_features=text_features, 
        cat_features=cat_features,
        verbose=50
    )
    regressor.fit(X, y_reg)
    reg_path = os.path.join(data_dir, "v40_ranking_engine.pkl")
    regressor.save_model(reg_path)
    print(f"Saved to {reg_path}")
    
    print("Training CatBoostClassifier (V4.0 Breakout Detector)...")
    classifier = CatBoostClassifier(
        iterations=200,
        learning_rate=0.1,
        depth=6,
        text_features=text_features,
        cat_features=cat_features,
        verbose=50
    )
    classifier.fit(X, y_clf)
    clf_path = os.path.join(data_dir, "v40_breakout_detector.pkl")
    classifier.save_model(clf_path)
    print(f"Saved to {clf_path}")
    
    # Save the new feature list
    with open(os.path.join(data_dir, "v40_feature_list.json"), "w") as f:
        json.dump(features, f)
    print("Saved feature list to v40_feature_list.json")
    
if __name__ == "__main__":
    train_models()
