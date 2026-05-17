import pandas as pd
import numpy as np
import os

class CompetitorGap:
    def __init__(self, data_dir=None):
        if data_dir is None:
            data_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_dir = data_dir
        self.df = pd.read_csv(os.path.join(data_dir, "diamond_intelligence_vault.csv"))
        # Pre-compute top performers (P90) per category
        self.niche_leaders = {}
        for cat in self.df['category'].unique():
            cat_df = self.df[self.df['category'] == cat]
            p90_val = cat_df['view_count'].quantile(0.90)
            self.niche_leaders[cat] = cat_df[cat_df['view_count'] >= p90_val]

    def analyze_gap(self, input_features):
        cat = input_features.get('category', 'Entertainment')
        leaders = self.niche_leaders.get(cat)
        
        if leaders is None or leaders.empty:
            return {"error": "Niche data not found"}
            
        # Metrics to compare
        metrics = [
            'hook_score', 'curiosity_index', 'brightness', 
            'visual_saliency', 'title_length', 'face_count'
        ]
        
        comparison = {}
        for m in metrics:
            leader_median = leaders[m].median()
            user_val = input_features.get(m, 0)
            
            gap_pct = ((user_val - leader_median) / (leader_median + 1e-6)) * 100
            
            comparison[m] = {
                'user': round(float(user_val), 2),
                'leader_median': round(float(leader_median), 2),
                'gap_percent': round(float(gap_pct), 1),
                'status': 'Leading' if gap_pct > 5 else ('Lagging' if gap_pct < -5 else 'On Par')
            }
            
        return {
            'category': cat,
            'leader_sample_size': len(leaders),
            'metrics_comparison': comparison,
            'niche_insight': self._generate_niche_insight(cat, leaders)
        }
        
    def _generate_niche_insight(self, cat, leaders):
        # Example specific insight generation
        avg_faces = leaders['face_count'].mean()
        if avg_faces > 1.2:
            return f"Top performers in {cat} almost always use multi-face thumbnails (Avg: {avg_faces:.1f})."
        
        avg_len = leaders['title_length'].mean()
        if avg_len < 40:
            return f"The {cat} niche favors short, punchy titles (Median: {int(avg_len)} chars)."
        
        return f"Focus on high curiosity gaps to break into the top 10% of {cat}."

if __name__ == "__main__":
    gap_analyzer = CompetitorGap()
    test_video = {
        'category': 'Education',
        'hook_score': 0.5,
        'curiosity_index': 0.4,
        'brightness': 100,
        'visual_saliency': 0.4,
        'title_length': 80,
        'face_count': 0
    }
    report = gap_analyzer.analyze_gap(test_video)
    print(f"Niche Analysis: {report['category']}")
    for m, data in report['metrics_comparison'].items():
        print(f" {m:<20}: {data['user']} vs Leader {data['leader_median']} ({data['gap_percent']}%) -> {data['status']}")
    print(f"Insight: {report['niche_insight']}")
