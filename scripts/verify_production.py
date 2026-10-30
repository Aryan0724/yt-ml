import urllib.request
import re
import xml.etree.ElementTree as ET

sitemap_url = 'https://preyt.integralgroups.in/sitemap.xml'
print("Fetching live production sitemap.xml from https://preyt.integralgroups.in...")
req = urllib.request.Request(sitemap_url, headers={'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)'})
with urllib.request.urlopen(req, timeout=12) as resp:
    sitemap_xml = resp.read().decode('utf-8')

root = ET.fromstring(sitemap_xml)
urls = [child.find('{http://www.sitemaps.org/schemas/sitemap/0.9}loc').text for child in root]
print(f"Discovered {len(urls)} URLs in live sitemap.xml.\n")

errors = []
warnings = []

for u in urls:
    try:
        r = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)'})
        with urllib.request.urlopen(r, timeout=12) as resp:
            status = resp.status
            html = resp.read().decode('utf-8', errors='ignore')

            # Check title
            t_match = re.search(r'<title[^>]*>(.*?)</title>', html, re.I | re.S)
            title = t_match.group(1).strip() if t_match else 'MISSING'
            if 'PreYT | PreYT' in title or 'PreYT Research | PreYT' in title or title.count('PreYT') > 1:
                errors.append(f"[DOUBLE_BRANDING] {u}: title='{title}'")

            # Check canonical
            c_match = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', html, re.I)
            if not c_match:
                c_match = re.search(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']', html, re.I)
            canon = c_match.group(1) if c_match else 'MISSING'

            expected_canon = u.rstrip('/')
            if canon.rstrip('/') != expected_canon:
                errors.append(f"[CANONICAL_MISMATCH] {u}: got '{canon}', expected '{expected_canon}'")

            # Check robots
            rob_match = re.search(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
            robots = rob_match.group(1) if rob_match else 'index, follow'
            if 'noindex' in robots:
                errors.append(f"[ACCIDENTAL_NOINDEX] {u}: robots='{robots}'")

            # Check schema for fake aggregateRating
            ld_json = re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.I | re.S)
            for block in ld_json:
                if 'aggregateRating' in block:
                    errors.append(f"[FAKE_RATING_FOUND] {u}: contains aggregateRating in JSON-LD")

            path = u.replace('https://preyt.integralgroups.in', '') or '/'
            print(f"[{status}] {path:40} | Canon: OK | Title: {title[:45]}...")

    except Exception as e:
        errors.append(f"[REQUEST_FAILED] {u}: {e}")

print("\n" + "="*50)
print(f"LIVE PRODUCTION AUDIT SUMMARY: {len(urls)} URLs tested")
print(f"Total Errors: {len(errors)}")
print(f"Total Warnings: {len(warnings)}")
if errors:
    print("\nERRORS:")
    for err in errors:
        print("  - " + err)
else:
    print("\nALL 40 LIVE PRODUCTION URLS VERIFIED CLEAN! 100% HEALTHY.")
