import urllib.request
import xml.etree.ElementTree as ET
import re

resp = urllib.request.urlopen("http://localhost:3000/sitemap.xml")
tree = ET.fromstring(resp.read())
urls = [c.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc").text for c in tree]

print(f"Auditing {len(urls)} sitemap URLs against local dev server...\n")

double_branding = []
long_titles = []
missing_canon = []
canon_mismatch = []

for u in urls:
    local_u = u.replace("https://preyt.integralgroups.in", "http://localhost:3000")
    req = urllib.request.Request(local_u, headers={"User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"})
    with urllib.request.urlopen(req) as r:
        html = r.read().decode("utf-8")
        t_m = re.search(r"<title>(.*?)</title>", html)
        t = t_m.group(1) if t_m else "MISSING"
        c_m = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', html)
        if not c_m:
            c_m = re.search(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']', html)
        c = c_m.group(1) if c_m else "MISSING"
        
        if "| PreYT | PreYT" in t or "| PreYT Research | PreYT" in t:
            double_branding.append((u, t))
        if len(t) > 65:
            long_titles.append((u, len(t), t))
        if c == "MISSING":
            missing_canon.append(u)
        elif c.rstrip("/") != u.rstrip("/"):
            canon_mismatch.append((u, c))

print("=== VERIFICATION RESULTS ===")
print(f"Total Sitemap URLs: {len(urls)}")
print(f"Double Branding Errors: {len(double_branding)}")
for u, t in double_branding:
    print(f"  [ERROR] {u} -> {t}")

print(f"Missing Canonicals: {len(missing_canon)}")
for u in missing_canon:
    print(f"  [ERROR] {u}")

print(f"Canonical Mismatches: {len(canon_mismatch)}")
for u, c in canon_mismatch:
    print(f"  [ERROR] {u} -> canonical is {c}")

print(f"Titles > 65 Chars: {len(long_titles)}")
for u, l, t in long_titles:
    print(f"  [{l} chars] {u} -> {t}")
