import sys, os, csv, time

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append('d:/research/diamond-intelligence-next/backend')
from v40_ranking_engine import RankingEngineV40

vault_path = 'd:/research/diamond-intelligence-next/backend/diamond_intelligence_vault.csv'
ext_path = 'd:/research/youtube_dataset/external_validation_samples.csv'

# Load 25 samples from vault
vault_samples = []
with open(vault_path, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)
    tier_buckets = {'S': [], 'A': [], 'B': [], 'C': [], 'D': []}
    for r in rows:
        t = str(r.get('success_tier', 'C')).upper().strip()
        if t in tier_buckets:
            tier_buckets[t].append(r)
    # 5 from each tier
    vault_samples = (tier_buckets['S'][:5] + tier_buckets['A'][:5] + 
                     tier_buckets['B'][:5] + tier_buckets['C'][:5] + tier_buckets['D'][:5])

# Load 25 samples from external
ext_samples = []
if os.path.exists(ext_path):
    with open(ext_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        ext_samples = list(reader)[:25]

engine = RankingEngineV40('d:/research/diamond-intelligence-next/backend')

TIER_ORDER = {'S': 4, 'A': 3, 'B': 2, 'C': 1, 'D': 0}
def tier_to_num(t):
    if isinstance(t, str) and '-' in t:
        t = t.split('-')[0].strip()
    return TIER_ORDER.get(str(t).upper().strip(), 0)

correct, off1, off2, wrong = 0, 0, 0, 0
total = 0

print(f"{'TITLE':<45} | {'PRED':<4} | {'ACTUAL':<6} | MATCH")
print('-'*75)

all_samples = vault_samples + ext_samples

for row in all_samples:
    title = row.get('title', '')
    cat = row.get('category', 'Entertainment')
    chan = row.get('channel_title', 'Unknown')
    actual = str(row.get('success_tier', 'C')).upper().strip()
    
    inp = {
        'title': title, 
        'category': cat, 
        'channel_title': chan, 
        'face_count': int(float(row.get('face_count', 1))), 
        'brightness': float(row.get('brightness', 128))
    }
    
    # Critical: Feed sub_count for external samples!
    if 'sub_count' in row:
        inp['sub_count'] = row['sub_count']
        
    # Derive actual tier for external samples from view_count
    if 'view_count' in row and not row.get('success_tier'):
        vc = int(float(row.get('view_count', 0)))
        if vc >= 5000000: actual = 'S'
        elif vc >= 1000000: actual = 'A'
        elif vc >= 200000: actual = 'B'
        else: actual = 'C'

    res = engine.predict(inp)
    
    pred_full = res['tier']
    pred = pred_full.split('-')[0]
    
    diff = abs(tier_to_num(pred) - tier_to_num(actual))
    if diff == 0:
        correct += 1
        match = 'EXACT'
    elif diff == 1:
        off1 += 1
        match = 'OFF-BY-1'
    elif diff == 2:
        off2 += 1
        match = 'OFF-BY-2'
    else:
        wrong += 1
        match = 'WRONG'
        
    total += 1
    # Print every row so we can see the changes clearly
    print(f"{title[:43]:<45} | {pred:<4} | {actual:<6} | {match}")

print(f'\nTOTAL: {total} Samples')
print(f'Exact Match: {correct}/{total} ({(correct/total)*100:.1f}%)')
print(f'Within 1 Tier: {correct+off1}/{total} ({((correct+off1)/total)*100:.1f}%)')
