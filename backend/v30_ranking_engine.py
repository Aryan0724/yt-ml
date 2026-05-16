import pandas as pd
import numpy as np
from catboost import CatBoostRegressor, CatBoostClassifier
import json
import os
import re

DATA_DIR = "d:/research/youtube_dataset"

from v30_title_forensics import TitleForensics
from v30_competitor_gap import CompetitorGap


class RankingEngineV30:
    def __init__(self, model_dir=DATA_DIR):
        self.model_dir = model_dir
        self.ranker = CatBoostRegressor()
        self.ranker.load_model(os.path.join(model_dir, "v30_ranking_engine.pkl"))
        self.detector = CatBoostClassifier()
        self.detector.load_model(os.path.join(model_dir, "v30_breakout_detector.pkl"))

        with open(os.path.join(model_dir, "v30_feature_list.json")) as f:
            self.features_order = json.load(f)
        with open(os.path.join(model_dir, "category_stats.json")) as f:
            self.cat_stats = json.load(f)
        with open(os.path.join(model_dir, "channel_stats.json")) as f:
            self.channel_stats = json.load(f)

        self.forensics = TitleForensics()
        self.gap_analyzer = CompetitorGap(model_dir)

        # Power-word lists used everywhere
        self.POWER_WORDS = ['secret','exposed','shocking','never','why','how',
                            'mistake','revealed','insane','stop','finally','actually',
                            'truth','real','worst','best','only','never','always']
        self.GAP_PHRASES  = ['why', 'how', 'this is why', 'the reason',
                             'what happens', 'found out', 'secret']
        self.STAKES_WORDS = ['i spent', 'hours', 'days', 'challenge', 'survived', 
                             'surviving', '$', 'vs', 'impossible', 'world\'s', 'biggest']
        self.EVENT_KEYWORDS = ['april fools', 'reveal', 'leaked', 'announcement', 
                               'goodbye', 'the end', 'finally']
        self.BORING_KEYWORDS = ['vlog', 'update', 'episode', 'part', 'check', 'thoughts', 
                                'random', 'routine', 'morning', 'situation', 'my']
        self.version = '4.5-ULTIMATE'

    # ─────────────────────────────────────────────────────
    # Internal: feature build
    # ─────────────────────────────────────────────────────
    def _relativize(self, raw: dict) -> dict:
        cat   = raw.get('category', 'Entertainment')
        chan  = raw.get('channel_title', 'Unknown')
        title = str(raw.get('title', ''))
        out   = dict(raw)

        # Linguistic signals — always recomputed from title string
        t_lower = title.lower()
        
        # 1. Hook Score: Power Words + Narrative Stakes + Events
        hook  = sum(1 for w in self.POWER_WORDS if re.search(rf'\b{w}\b', t_lower)) * 0.4
        hook += sum(1 for w in self.STAKES_WORDS if re.search(rf'\b{w}\b', t_lower)) * 0.3 
        hook += sum(1 for w in self.EVENT_KEYWORDS if re.search(rf'\b{w}\b', t_lower)) * 0.6 
        hook += 0.3 if '?' in title else 0
        hook += 0.2 if '[' in title or '(' in title else 0
        
        # Boring Penalty (The Fix for 'channel update #3')
        hook -= sum(1 for w in self.BORING_KEYWORDS if re.search(rf'\b{w}\b', t_lower)) * 0.8
        
        # Extreme Punctuation (Hype Detection)
        if '!!' in title or '??' in title:
            hook += 0.3
        # Bonus for numbers + time/money (The MrBeast Formula)
        if re.search(r'\d+\s*(hours|days|years|mins|\$)', t_lower):
            hook += 0.5
            
        out['hook_score'] = np.clip(hook, 0.0, 1.0)

        # 2. Curiosity Index
        curio  = sum(1 for p in self.GAP_PHRASES if re.search(rf'\b{p}\b', t_lower)) * 0.6
        curio += 0.4 if '?' in title else 0
        out['curiosity_index'] = np.clip(curio, 0.0, 1.0)

        out['title_power_word_count'] = sum(1 for w in self.POWER_WORDS if re.search(rf'\b{w}\b', t_lower))
        out['title_has_number']  = 1 if re.search(r'\d+', title) else 0
        out['title_caps_ratio']  = sum(1 for c in title if c.isupper()) / (len(title) + 1)
        out['title_length']      = len(title)
        out['is_question']       = int(title.strip().endswith('?'))
        out['has_bracket']       = int('[' in title or '(' in title)
        out['brightness_normalized'] = out.get('brightness', 128) / 255.0

        # Channel authority
        chan_data = self.channel_stats.get(chan, {}) or {}
        # FALLBACK: If unknown, treat as a SMALL CREATOR (Authority 1.0), not the superstars average.
        fallback  = {'avg_views': 500, 'p90_views': 2000, 'authority_score': 1.0,
                     'est_sub_count': 1000, 'category_consistency': 0.1, 'video_count': 5}
        for k, v in fallback.items():
            chan_data.setdefault(k, v)

        out['avg_views']           = chan_data['avg_views']
        out['p90_views']           = chan_data['p90_views']
        out['authority_score']     = chan_data['authority_score']
        out['log_est_sub_count']   = np.log10(max(100, chan_data['est_sub_count']))
        out['category_consistency']= chan_data['category_consistency']
        out['video_count']         = chan_data['video_count']

        # Category context
        cat_data  = self.cat_stats.get(cat, self.cat_stats.get('Entertainment', {}))
        cat_means = cat_data.get('means', {})
        for col, mean_val in cat_means.items():
            out[f'{col}_relative'] = out.get(col, 0) / max(0.1, mean_val)

        out['competition_density'] = cat_data.get('count', 100)
        out['novelty_score']       = 1.0 / (out['competition_density'] + 1)
        return out

    def _build_df(self, processed: dict) -> pd.DataFrame:
        df = pd.DataFrame([processed])
        for col in self.features_order:
            if col not in df.columns:
                df[col] = 0
        return df[self.features_order]

    def _score(self, raw: dict) -> tuple:
        """Returns (blended_score, ml_rank, breakout_prob, metadata_quality)"""
        p = self._relativize(raw)
        df = self._build_df(p)
        ml_rank      = float(np.clip(self.ranker.predict(df)[0], 0, 100))
        breakout_prob= float(self.detector.predict_proba(df)[0][1])

        mq_hook  = p.get('hook_score', 0) * 45 
        mq_curio = p.get('curiosity_index', 0) * 25
        mq_vis   = (min(1, p.get('face_count', 0)) * 15) + (min(1, p.get('brightness', 128)/180) * 15)
        mq       = min(100, mq_hook + mq_curio + mq_vis)

        # Final Boring Cap: If it's a boring title, it CANNOT be A-Tier (mq cap 45)
        if any(re.search(rf'\b{w}\b', str(raw.get('title','')).lower()) for w in self.BORING_KEYWORDS):
            mq = min(40, mq)

        # --- V4.2 AGGRESSIVE AUTHORITY BLENDING ---
        # For massive channels (high authority), we trust the ML Truth almost entirely.
        authority = p.get('authority_score', 3.0)
        
        # Weighting formula: 
        # Authority < 3 (Small): ML 20% / MQ 80% (Strict rules for small channels)
        # Authority > 8 (Giant): ML 95% / MQ 5% (Trust history for giants)
        if authority > 8:
            ml_weight = 0.95
        elif authority < 3:
            ml_weight = 0.20
        else:
            ml_weight = np.clip(0.2 + (authority / 12.0), 0.2, 0.9)
        
        mq_weight = 1.0 - ml_weight
        
        blended = round((ml_rank * ml_weight) + (mq * mq_weight), 1)
        
        # print(f"DEBUG | Title: {raw.get('title','')} | MQ: {mq} | ML: {ml_rank:.1f} | Auth: {authority:.1f} | ML_W: {ml_weight:.2f} | Blended: {blended}")

        # --- V4.4 THE HARD CEILING (THE ULTIMATE FIX) ---
        # If it's a boring title, we hard-cap the final score.
        # Even if a giant channel posts it, it's not a 'Viral' piece of content.
        if any(re.search(rf'\b{w}\b', str(raw.get('title','')).lower()) for w in self.BORING_KEYWORDS):
            blended = min(44.9, blended)
        
        return blended, round(ml_rank, 1), round(breakout_prob, 3), round(mq, 1)

    # ─────────────────────────────────────────────────────
    # OPTIMIZATION JOURNEY — the primary product
    # ─────────────────────────────────────────────────────
    def _build_optimization_journey(self, raw: dict) -> dict:
        """
        Simulates an ordered sequence of improvements and returns
        the full step-by-step score progression.
        """
        title   = str(raw.get('title', ''))
        cat     = raw.get('category', 'Entertainment')
        current = dict(raw)

        base_blended, base_ml, base_bp, base_mq = self._score(current)

        steps = []

        # --- Step 1: Title Power Analysis ---
        tf = self.forensics.analyze(title, cat)
        rewrites = tf.get('rewrite_suggestions', [])

        # Best rewrite (if any)
        best_rewrite = None
        best_rewrite_delta = 0
        for rw in rewrites:
            candidate = dict(current, title=rw['title'])
            s, *_ = self._score(candidate)
            delta = s - base_blended
            if delta > best_rewrite_delta:
                best_rewrite_delta = delta
                best_rewrite = rw

        if best_rewrite:
            candidate = dict(current, title=best_rewrite['title'])
            s, _, bp, mq = self._score(candidate)
            steps.append({
                'step': 1,
                'action': 'Rewrite Title',
                'description': f"Change title to a {best_rewrite['type'].replace('_',' ')} structure",
                'before_title': title,
                'after_title': best_rewrite['title'],
                'score_before': base_blended,
                'score_after': s,
                'rank_lift': round(s - base_blended, 1),
                'impact_level': 'High' if s - base_blended > 10 else 'Medium',
                'why': 'A well-structured title drives curiosity and increases CTR significantly.'
            })
            current['title'] = best_rewrite['title']

        # --- Step 2: Add question mark if not present ---
        if '?' not in current.get('title',''):
            candidate = dict(current, title=current.get('title','').rstrip('.!') + '?')
            s, _, bp, mq = self._score(candidate)
            delta = round(s - self._score(current)[0], 1)
            if delta > 1.0:
                steps.append({
                    'step': len(steps)+1,
                    'action': 'Add Question Mark',
                    'description': 'Convert title to a question to boost curiosity gap',
                    'before_title': current.get('title',''),
                    'after_title': candidate['title'],
                    'score_before': self._score(current)[0],
                    'score_after': s,
                    'rank_lift': delta,
                    'impact_level': 'Medium',
                    'why': 'Question-format titles have a higher CTR because they create an open loop in the viewer\'s mind.'
                })
                current['title'] = candidate['title']

        # --- Step 3: Add face to thumbnail ---
        if not raw.get('face_count', 0):
            candidate = dict(current, face_count=1)
            s, _, bp, mq = self._score(candidate)
            delta = round(s - self._score(current)[0], 1)
            if delta > 0.5:
                steps.append({
                    'step': len(steps)+1,
                    'action': 'Add a Face to Thumbnail',
                    'description': 'Include a human face with an expressive emotion',
                    'before_title': None,
                    'after_title': None,
                    'score_before': self._score(current)[0],
                    'score_after': s,
                    'rank_lift': delta,
                    'impact_level': 'High',
                    'why': 'Human faces create instant emotional connection. Thumbnails with faces get 38% higher CTR on average.'
                })
                current['face_count'] = 1

        # --- Step 4: Optimize brightness ---
        current_brightness = raw.get('brightness', 128)
        cat_brightness = self.cat_stats.get(cat, {}).get('means', {}).get('brightness', 100)
        ideal_brightness = min(220, max(160, cat_brightness * 1.8))
        if abs(current_brightness - ideal_brightness) > 30:
            candidate = dict(current, brightness=ideal_brightness)
            s, _, bp, mq = self._score(candidate)
            delta = round(s - self._score(current)[0], 1)
            if delta > 0.5:
                direction = 'brighter' if ideal_brightness > current_brightness else 'darker'
                steps.append({
                    'step': len(steps)+1,
                    'action': f'Make Thumbnail {direction.title()}',
                    'description': f'Adjust thumbnail brightness to ~{int(ideal_brightness)} (currently {int(current_brightness)})',
                    'before_title': None,
                    'after_title': None,
                    'score_before': self._score(current)[0],
                    'score_after': s,
                    'rank_lift': delta,
                    'impact_level': 'Medium',
                    'why': f'Top performers in {cat} use brighter, high-contrast thumbnails that stand out in the feed.'
                })
                current['brightness'] = ideal_brightness

        # --- Step 5: Add bracket/emotion hook ---
        if '[' not in current.get('title','') and '(' not in current.get('title',''):
            brackets = ['[SHOCKING]', '[EXPOSED]', '[TRUTH]', '[MUST WATCH]']
            best_bracket = None
            best_bracket_score = self._score(current)[0]
            for b in brackets:
                candidate = dict(current, title=current.get('title','') + ' ' + b)
                s, *_ = self._score(candidate)
                if s > best_bracket_score:
                    best_bracket_score = s
                    best_bracket = b

            if best_bracket and best_bracket_score - self._score(current)[0] > 1.0:
                new_title = current.get('title','') + ' ' + best_bracket
                before_score = self._score(current)[0]
                steps.append({
                    'step': len(steps)+1,
                    'action': 'Add Emotion Bracket',
                    'description': f'Append {best_bracket} to signal high stakes',
                    'before_title': current.get('title',''),
                    'after_title': new_title,
                    'score_before': before_score,
                    'score_after': best_bracket_score,
                    'rank_lift': round(best_bracket_score - before_score, 1),
                    'impact_level': 'Medium',
                    'why': 'Brackets create visual hierarchy and signal to viewers that the content has a strong payoff.'
                })
                current['title'] = new_title

        # Final state
        final_blended, final_ml, final_bp, final_mq = self._score(current)
        total_lift = round(final_blended - base_blended, 1)

        return {
            'baseline_score': base_blended,
            'optimized_score': final_blended,
            'total_rank_lift': total_lift,
            'optimized_title': current.get('title', title),
            'steps': steps,
            'verdict': (
                'Significant improvement achievable' if total_lift > 20 else
                'Moderate improvement achievable'   if total_lift > 10 else
                'Minor improvements — content is near-optimal or needs deeper changes'
            )
        }

    # ─────────────────────────────────────────────────────
    # PUBLIC: predict — returns the full Intelligence Brief
    # ─────────────────────────────────────────────────────
    def predict(self, raw: dict, use_shap: bool = True) -> dict:
        # print(f"DEBUG: Engine Version {self.version}")
        blended, ml_rank, breakout_prob, mq = self._score(raw)

        if   blended >= 85: tier = "S-Tier (Viral Breakout)"
        elif blended >= 70: tier = "A-Tier (High Growth)"
        elif blended >= 40: tier = "B-Tier (Steady)"
        else:               tier = "C-Tier (Low Impact)"

        report = {
            'percentile_score':       blended,
            'metadata_quality_score': mq,
            'raw_ml_rank':            ml_rank,
            'tier':                   tier,
            'breakout_probability':   breakout_prob,
        }

        if use_shap and 'is_simulation' not in raw:
            title = str(raw.get('title', ''))
            cat   = raw.get('category', 'Entertainment')
            processed = self._relativize(raw)

            # 1. Optimization Journey (PRIMARY)
            report['optimization_journey'] = self._build_optimization_journey(raw)

            # 2. Title Forensics
            report['title_forensics'] = self.forensics.analyze(title, cat)

            # 3. Competitor Gap
            report['competitor_gap'] = self.gap_analyzer.analyze_gap(processed)

        return report
