import re
import numpy as np

class TitleForensics:
    def __init__(self):
        self.POWER_WORDS = {
            'SECRET': 0.15, 'INSANE': 0.12, 'EXPOSED': 0.18, 'HIDDEN': 0.14,
            'MASTER': 0.10, 'PERFECT': 0.08, 'SHOCKING': 0.16, 'IMMEDIATELY': 0.05,
            'STOP': 0.07, 'MISTAKE': 0.11, 'NEVER': 0.09, 'ALWAYS': 0.05,
            'FIRST': 0.04, 'LAST': 0.04, 'GIFT': 0.03, 'GIVEAWAY': 0.02
        }
        self.GENERIC_WORDS = ['TUTORIAL', 'VLOG', 'VIDEO', 'EPISODE', 'PART', 'SERIES']
        
    def analyze(self, title, category="Entertainment"):
        title_upper = title.upper()
        words = re.findall(r'\w+', title_upper)
        
        analysis = []
        total_impact = 0
        
        # 1. Word-level impact
        for word in words:
            if word in self.POWER_WORDS:
                impact = self.POWER_WORDS[word]
                analysis.append({'word': word, 'type': 'power_word', 'impact': impact})
                total_impact += impact
            elif word in self.GENERIC_WORDS:
                impact = -0.05
                analysis.append({'word': word, 'type': 'generic_noun', 'impact': impact})
                total_impact += impact
                
        # 2. Structural Analysis
        has_question = title.strip().endswith('?')
        has_bracket = '[' in title or '(' in title
        reveals_payoff = not any(m in title_upper for m in ['WHY', 'HOW', 'THIS', 'REASON', 'BECAUSE', 'HAPPENED'])
        
        # 3. Pattern Recognition
        if has_question: pattern = "Question"
        elif "HOW TO" in title_upper: pattern = "Tutorial"
        elif any(m in title_upper for m in ['SECRET', 'HIDDEN', 'EXPOSED']): pattern = "Revelation"
        else: pattern = "Narrative"
        
        # 4. Generate Suggestions
        suggestions = []
        if reveals_payoff:
            suggestions.append({
                'title': f"Why {title} actually happened",
                'strategy': "Withhold payoff - move answer behind the click",
                'type': 'curiosity_loop'
            })
        if not has_bracket:
            suggestions.append({
                'title': f"{title} (SHOCKING)",
                'strategy': "Add emotional bracket for high-intensity categories",
                'type': 'emotional_bracket'
            })
            
        return {
            'word_analysis': analysis,
            'structure': {
                'pattern': pattern,
                'has_question': has_question,
                'has_bracket': has_bracket,
                'reveals_payoff': reveals_payoff,
                'total_word_impact': round(total_impact, 2)
            },
            'rewrite_suggestions': suggestions
        }

if __name__ == "__main__":
    forensics = TitleForensics()
    sample = "Testing a new AI model for my YouTube channel"
    report = forensics.analyze(sample)
    print(f"Title: {sample}")
    print(f"Pattern: {report['structure']['pattern']}")
    print(f"Suggestions: {report['rewrite_suggestions']}")
