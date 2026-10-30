import urllib.request
import xml.etree.ElementTree as ET
import re
import json

tree = ET.parse('public/sitemap.xml')
root = tree.getroot()
urls = [child.find('{http://www.sitemaps.org/schemas/sitemap/0.9}loc').text for child in root]

headers = {'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'}

print(f"Auditing {len(urls)} sitemap URLs against live production (https://preyt.integralgroups.in)...\n")

results = []
for u in urls:
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            status = resp.status
            html = resp.read().decode('utf-8', errors='ignore')
            
            canonical_match = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', html, re.I)
            if not canonical_match:
                canonical_match = re.search(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']', html, re.I)
            canon_val = canonical_match.group(1) if canonical_match else 'MISSING'
            
            robots_match = re.search(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
            robots_val = robots_match.group(1) if robots_match else 'DEFAULT (index,follow)'
            
            title_match = re.search(r'<title[^>]*>(.*?)</title>', html, re.I | re.S)
            title_val = title_match.group(1).strip() if title_match else 'MISSING'
            
            desc_match = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
            desc_val = desc_match.group(1).strip() if desc_match else 'MISSING'

            h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.I | re.S)
            h1_val = re.sub(r'<[^<]+?>', '', h1_match.group(1)).strip() if h1_match else 'MISSING'
            
            # JSON-LD count
            ld_json_blocks = re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.I | re.S)
            schemas = []
            for block in ld_json_blocks:
                try:
                    data = json.loads(block)
                    if isinstance(data, dict):
                        if '@graph' in data and isinstance(data['@graph'], list):
                            schemas.extend([item.get('@type', 'Unknown') for item in data['@graph']])
                        else:
                            schemas.append(data.get('@type', 'Unknown'))
                    elif isinstance(data, list):
                        schemas.extend([item.get('@type', 'Unknown') for item in data if isinstance(item, dict)])
                except Exception:
                    schemas.append('INVALID_JSON')

            match = 'MATCH' if canon_val.rstrip('/') == u.rstrip('/') else f'MISMATCH ({canon_val})'
            
            row = {
                'url': u,
                'status': status,
                'canonical': canon_val,
                'canonical_match': match,
                'robots': robots_val,
                'title': title_val,
                'description': desc_val,
                'h1': h1_val,
                'schemas': schemas
            }
            results.append(row)
            print(f"[{status}] {u}")
            print(f"  Canonical: {match}")
            print(f"  Robots:    {robots_val}")
            print(f"  Title:     {title_val[:60]}")
            print(f"  H1:        {h1_val[:60]}")
            print(f"  Schemas:   {', '.join(schemas) if schemas else 'None'}\n")
    except Exception as e:
        print(f"[ERR] {u} -> {e}\n")
        results.append({'url': u, 'status': 'ERR', 'error': str(e)})

with open('scripts/audit_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print("Audit complete! Saved to scripts/audit_results.json")
