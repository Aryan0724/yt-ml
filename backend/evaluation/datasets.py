import pandas as pd
import os
import random
from typing import List, Dict, Any

class EvaluationDataset:
    def __init__(self, csv_path: str = None):
        if csv_path is None:
            csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "diamond_intelligence_vault.csv")
        self.csv_path = csv_path
        
    def get_stratified_sample(self, seed: int = 42) -> List[Dict[str, Any]]:
        """
        Samples exactly 100 rows, stratified by metadata to avoid LLM-in-the-loop classification bias.
        25 Evergreen (Education, Science & Technology)
        25 Trending/News (News, News & Politics)
        25 Niche (Vlogs, Music, People & Blogs)
        25 Competitive (Gaming, Entertainment)
        """
        df = pd.read_csv(self.csv_path)
        
        # We assume 'category' exists
        if 'category' not in df.columns:
            raise ValueError("CSV missing 'category' column.")
            
        def get_sample(categories: List[str], n: int) -> pd.DataFrame:
            subset = df[df['category'].isin(categories)]
            if len(subset) == 0:
                # Fallback to random if categories not found
                subset = df
            return subset.sample(n=min(n, len(subset)), random_state=seed)

        evergreen = get_sample(["Education", "Science & Technology"], 25)
        trending = get_sample(["News", "News & Politics"], 25)
        niche = get_sample(["Vlogs", "Music", "People & Blogs"], 25)
        competitive = get_sample(["Gaming", "Entertainment"], 25)
        
        combined = pd.concat([evergreen, trending, niche, competitive])
        
        # If we didn't hit 100 due to data shortages, fill the rest randomly
        if len(combined) < 100:
            remaining = 100 - len(combined)
            fill_df = df[~df.index.isin(combined.index)].sample(n=remaining, random_state=seed)
            combined = pd.concat([combined, fill_df])
            
        return combined.to_dict(orient='records')
