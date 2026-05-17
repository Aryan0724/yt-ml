import re
import numpy as np

class PsychologicalProxyExtractor:
    def __init__(self):
        self.POWER_WORDS = [
            'secret', 'insane', 'exposed', 'hidden', 'master', 'perfect', 
            'shocking', 'immediately', 'stop', 'mistake', 'don\'t', 'danger',
            'genius', 'ultimate', 'impossible', 'guaranteed', 'finally'
        ]
        self.CURIOSITY_MARKERS = [
            'why', 'how', 'this', 'reason', 'because', 'finally', 
            'result', 'happened', 'everything', 'changed'
        ]
        
        # Category Norms (Simplified for this run - normally derived from data)
        self.CAT_INTENSITY_NORMS = {
            'Gaming': 0.85,
            'Entertainment': 0.75,
            'Education': 0.35,
            'Tech': 0.45,
            'Life Hacks': 0.90,
            'People & Blogs': 0.50
        }

    def calculate_hook_strength(self, title, category="Unknown", thumbnail_data=None):
        title_lower = title.lower()
        
        # 1. Emotional Intensity (Raw)
        power_count = sum(1 for word in self.POWER_WORDS if word in title_lower)
        
        # 2. Caps Ratio (Advanced Marker)
        caps_count = sum(1 for c in title if c.isupper())
        caps_ratio = caps_count / len(title) if len(title) > 0 else 0
        
        # 3. Exaggeration Score
        exagg_count = len(re.findall(r'!|\?{2,}|100%|BEST|OMG', title))
        
        base_intensity = (power_count * 0.4) + (caps_ratio * 0.4) + (exagg_count * 0.2)
        
        # 4. NICHE ADJUSTMENT
        # We normalize intensity against the category norm
        norm = self.CAT_INTENSITY_NORMS.get(category, 0.5)
        # If intensity matches the high-intensity norm of the category, it's a GOOD hook
        # Instead of penalizing, we reward alignment with category 'vibe'
        adjusted_hook = base_intensity / (norm + 0.1)
        
        return round(min(1.0, adjusted_hook), 3)

    def calculate_curiosity_gap(self, title):
        """
        Simulates the decision to click based on an information gap.
        Looks for 'Open Loops' in the text.
        """
        title_lower = title.lower()
        
        # 1. Marker Presence
        marker_count = sum(1 for m in self.CURIOSITY_MARKERS if m in title_lower)
        marker_score = min(1.0, marker_count / 2.0)
        
        # 2. Open Loop Structures (Questions or "This is why...")
        loop_score = 0.0
        if '?' in title: loop_score += 0.5
        if re.search(r'\b(this|these|the)\b.*\b(is|are|result)\b', title_lower):
            loop_score += 0.5
            
        return min(1.0, round(marker_score * 0.6 + loop_score * 0.4, 3))

    def calculate_retention_risk(self, title, video_length, video_age=0):
        """
        Simulates the likelihood of early drop-off.
        High risk = Long video + Low Hook + Technical/Dry title.
        """
        # Complexity proxy (avg word length)
        words = title.split()
        avg_word_len = np.mean([len(w) for w in words]) if words else 5
        complexity = min(1.0, avg_word_len / 10.0)
        
        # Length penalty (Longer videos need stronger hooks)
        # Scale: 0 to 1800s (30m)
        length_penalty = min(1.0, video_length / 1800.0)
        
        # Freshness benefit (Newer videos have higher 'Grace Period' for retention)
        freshness = max(0.0, 1.0 - (video_age / 30.0)) # Drops to 0 after 30 days
        
        risk = (complexity * 0.4) + (length_penalty * 0.5) - (freshness * 0.2)
        return max(0.0, min(1.0, round(risk, 3)))

    def extract_all_proxies(self, row):
        """
        Takes a dataset row and returns all behavioral proxies.
        """
        thumb_data = {
            'face_count': row.get('face_count', 0),
            'visual_saliency': row.get('visual_saliency', 0.5),
            'brightness': row.get('brightness', 128)
        }
        
        category = row.get('category', 'Unknown')
        hook = self.calculate_hook_strength(row['title'], category, thumb_data)
        gap = self.calculate_curiosity_gap(row['title'])
        risk = self.calculate_retention_risk(row['title'], row['video_length'], row.get('video_age_days', 0))
        
        # Narrative Tension (Emotional Shift)
        # If title has more than 5 words, check polarity of start vs end
        # (Simplified version using word density)
        tension = 0.5
        if len(row['title'].split()) > 4:
            # We look for 'Intensity' words (Shocking, Insane) vs 'Topic' words
            tension = min(1.0, row.get('title_intensity', 0.5) * 1.2)
            
        return {
            'hook_strength': hook,
            'curiosity_gap': gap,
            'retention_risk': risk,
            'narrative_tension': round(tension, 3),
            'engagement_potential': round((hook + gap) / 2.0, 3)
        }

if __name__ == "__main__":
    # Test
    extractor = PsychologicalProxyExtractor()
    test_title = "Why everything you know about AI is WRONG (Secret Revealed)"
    proxies = extractor.extract_all_proxies({
        'title': test_title,
        'video_length': 600,
        'face_count': 1,
        'visual_saliency': 0.9,
        'brightness': 180,
        'title_intensity': 0.8
    })
    print(f"Title: {test_title}")
    print(f"Proxies: {proxies}")
