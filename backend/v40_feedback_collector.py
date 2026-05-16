import os
import pandas as pd
import json
from datetime import datetime

class FeedbackCollector:
    def __init__(self, data_dir="d:/research/youtube_dataset"):
        self.data_dir = data_dir
        self.feedback_file = os.path.join(data_dir, "feedback_vault.csv")
        
        # Initialize file if it doesn't exist
        if not os.path.exists(self.feedback_file):
            df = pd.DataFrame(columns=[
                'prediction_id', 'timestamp', 'video_id', 'channel_title', 
                'title', 'category', 'predicted_score', 'predicted_tier',
                'actual_score', 'actual_views', 'error', 'status'
            ])
            df.to_csv(self.feedback_file, index=False)

    def log_prediction(self, prediction_id, raw_input, results):
        """
        Saves the initial prediction snapshot.
        """
        df = pd.read_csv(self.feedback_file)
        
        new_entry = {
            'prediction_id': prediction_id,
            'timestamp': datetime.now().isoformat(),
            'video_id': None, # To be updated when published
            'channel_title': raw_input.get('channel_title', 'Unknown'),
            'title': raw_input.get('title', ''),
            'category': raw_input.get('category', 'Entertainment'),
            'predicted_score': results.get('score'),
            'predicted_tier': results.get('tier'),
            'actual_score': None,
            'actual_views': None,
            'error': None,
            'status': 'pending_upload'
        }
        
        df = pd.concat([df, pd.DataFrame([new_entry])], ignore_index=True)
        df.to_csv(self.feedback_file, index=False)
        return prediction_id

    def link_video(self, prediction_id, video_id):
        """
        Links a prediction to a real YouTube Video ID.
        """
        df = pd.read_csv(self.feedback_file)
        df.loc[df['prediction_id'] == prediction_id, 'video_id'] = video_id
        df.loc[df['prediction_id'] == prediction_id, 'status'] = 'uploaded'
        df.to_csv(self.feedback_file, index=False)

    def update_actual_performance(self, video_id, actual_score, actual_views):
        """
        Updates the entry with real-world performance data.
        """
        df = pd.read_csv(self.feedback_file)
        mask = df['video_id'] == video_id
        
        if mask.any():
            pred_score = df.loc[mask, 'predicted_score'].values[0]
            error = abs(pred_score - actual_score)
            
            df.loc[mask, 'actual_score'] = actual_score
            df.loc[mask, 'actual_views'] = actual_views
            df.loc[mask, 'error'] = error
            df.loc[mask, 'status'] = 'validated'
            
            df.to_csv(self.feedback_file, index=False)
            return True
        return False

    def get_validation_summary(self):
        """
        Returns stats on how well the model is performing vs reality.
        """
        df = pd.read_csv(self.feedback_file)
        validated = df[df['status'] == 'validated']
        
        if validated.empty:
            return "No validated data yet."
            
        mae = validated['error'].mean()
        return {
            "total_validated": len(validated),
            "mean_absolute_error": round(mae, 2),
            "accuracy_improvement_potential": "High" if mae > 20 else "Low"
        }

if __name__ == "__main__":
    collector = FeedbackCollector()
    # Mock a prediction log
    p_id = "pred_999"
    collector.log_prediction(p_id, {"title": "Test Video"}, {"score": 75, "tier": "A"})
    collector.link_video(p_id, "dQw4w9WgXcQ")
    collector.update_actual_performance("dQw4w9WgXcQ", 72, 50000)
    
    print("Feedback Loop Logic Initialized.")
    print(collector.get_validation_summary())
