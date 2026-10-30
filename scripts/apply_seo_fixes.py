import os

replacements = [
    (
        "app/blog/[slug]/page.tsx",
        "title: `${post.title} | PreYT Research`,",
        "title: post.title,"
    ),
    (
        "app/blog/category/[category]/page.tsx",
        "title: `${category.name} Guides & Research | PreYT`,",
        "title: `${category.name} Guides & Research`,"
    ),
    (
        "app/youtube-packaging/[niche]/page.tsx",
        "title: `${niche.name} YouTube Packaging Blueprint & CTR Benchmarks | PreYT`,",
        "title: `${niche.name} YouTube Packaging & CTR Guide`,"
    ),
    (
        "app/tools/youtube-feed-preview/page.tsx",
        'title: "Free YouTube Thumbnail Previewer & Mobile Feed Tester | PreYT",',
        'title: "Free YouTube Thumbnail Previewer & Mobile Feed Tester",'
    ),
    (
        "app/tools/youtube-feed-preview/page.tsx",
        'description: "Test your YouTube thumbnail and title draft in a live simulated YouTube feed before publishing. Check mobile character cutoffs, dark mode contrast, and timestamp safe areas.",',
        'description: "Test your YouTube thumbnail and title draft in a simulated live feed before publishing. Check mobile cutoffs, dark mode contrast, and timestamp safe areas.",'
    ),
    (
        "app/youtube-thumbnail-analyzer/page.tsx",
        'title: "Free YouTube Thumbnail Analyzer | Check Contrast & Safe Zones (PreYT)",',
        'title: "Free YouTube Thumbnail Analyzer: Contrast & Safe Zones",'
    ),
    (
        "app/youtube-title-analyzer/page.tsx",
        'title: "Free YouTube Title Analyzer | Mobile Cutoffs & Curiosity Score (PreYT)",',
        'title: "Free YouTube Title Analyzer: Mobile Cutoffs & Score",'
    ),
    (
        "app/youtube-video-idea-generator/page.tsx",
        'title: "Free YouTube Video Idea Generator | High-CTR Concepts (PreYT)",',
        'title: "Free YouTube Video Idea Generator: High-CTR Concepts",'
    ),
    (
        "app/youtube-content-gap-finder/page.tsx",
        'title: "Free YouTube Content Gap Finder | Discover Underserved Niches (PreYT)",',
        'title: "Free YouTube Content Gap Finder: Underserved Topics",'
    ),
    (
        "app/youtube-thumbnail-tester/page.tsx",
        'title: "Free YouTube Thumbnail Tester | Compare A/B Variants (PreYT)",',
        'title: "Free YouTube Thumbnail Tester: Compare A/B Variants",'
    ),
    (
        "app/vs/vidiq/page.tsx",
        'title: "PreYT vs vidIQ: Pre-Upload Packaging vs Post-Upload Tag Optimization (2026 Comparison)",',
        'title: "PreYT vs vidIQ: Pre-Upload Packaging vs Tag Tools",'
    ),
    (
        "app/vs/vidiq/page.tsx",
        'description: "An objective comparison of PreYT and vidIQ. Discover why modern YouTube recommendation algorithms prioritize visual glanceability and packaging over keyword meta tags.",',
        'description: "Objective comparison of PreYT and vidIQ. Discover why modern YouTube algorithms prioritize visual glanceability over keyword tags.",'
    ),
    (
        "app/vs/1of10/page.tsx",
        'title: "PreYT vs 1of10: Outlier Discovery & Computer Vision Packaging Comparison (2026)",',
        'title: "PreYT vs 1of10: Outlier Discovery & CV Analytics",'
    ),
    (
        "app/vs/1of10/page.tsx",
        'description: "An objective architectural comparison between PreYT and 1of10. Discover how PreYT combines outlier detection with OpenCV computer vision and perceptual hash saturation defense.",',
        'description: "Objective comparison between PreYT and 1of10. Discover how PreYT combines outlier detection with OpenCV computer vision and saturation defense.",'
    ),
    (
        "app/pricing/page.tsx",
        'title: "Pricing Plans — YouTube Packaging Intelligence",',
        'title: "Pricing Plans: YouTube Packaging Intelligence",'
    ),
    (
        "app/features/page.tsx",
        'title: "PreYT Features — YouTube Content Analysis Tools",',
        'title: "Features: YouTube Packaging & Analysis Tools",'
    ),
    (
        "app/about/page.tsx",
        'title: "About PreYT — Our Approach to YouTube Intelligence",',
        'title: "About PreYT: YouTube Packaging Intelligence",'
    ),
    (
        "app/changelog/page.tsx",
        'title: "Changelog & Release Notes — YouTube Analytics Platform",',
        'title: "Platform Changelog & Release Notes",'
    ),
    (
        "app/waitlist/layout.tsx",
        'title: "Join the PreYT Creator Waitlist — Early Access Rollout",',
        'title: "Join Creator Waitlist: Priority Early Access",'
    ),
    (
        "app/integral-groups/page.tsx",
        'title: "Integral Groups Studio — The Systems Architecture Studio Behind PreYT",',
        'title: "Integral Groups: Studio Behind PreYT",'
    ),
    (
        "app/legal/terms/page.tsx",
        'canonical: "/legal/terms",',
        'canonical: "https://preyt.integralgroups.in/legal/terms",'
    ),
    (
        "app/legal/privacy/page.tsx",
        'canonical: "/legal/privacy",',
        'canonical: "https://preyt.integralgroups.in/legal/privacy",'
    ),
    (
        "app/legal/privacy/page.tsx",
        'description: "Comprehensive privacy policy detailing PreYT and Integral Groups\' data protection practices under the Digital Personal Data Protection Act 2023 (DPDP Act, India), GDPR, and YouTube API Services Developer Policies.",',
        'description: "Privacy policy detailing PreYT and Integral Groups data protection practices under the DPDP Act 2023, GDPR, and YouTube API Developer Policies.",'
    ),
    (
        "app/legal/cookies/page.tsx",
        'canonical: "/legal/cookies",',
        'canonical: "https://preyt.integralgroups.in/legal/cookies",'
    ),
    (
        "app/spec/[id]/page.tsx",
        '    title: `${cleanTitle} — Packaging Audit Spec | PreYT`,',
        '    title: `${cleanTitle} — Packaging Audit Spec | PreYT`,\n    robots: {\n      index: false,\n      follow: false,\n    },'
    )
]

for file_path, target, replacement in replacements:
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    if target in content:
        new_content = content.replace(target, replacement, 1)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Applied fix to {file_path}")
    else:
        print(f"Target NOT found in {file_path}: {target[:40]}...")

# Update footer internal links
with open("components/landing/footer.tsx", "r", encoding="utf-8") as f:
    footer = f.read()

t1 = """            <li>
              <Link href="/youtube-packaging/tech-reviews" className="hover:text-[#EE1122] transition-colors">
                Tech Reviews
              </Link>
            </li>"""

r1 = """            <li>
              <Link href="/youtube-packaging/tech-reviews" className="hover:text-[#EE1122] transition-colors">
                Tech Reviews
              </Link>
            </li>
            <li>
              <Link href="/youtube-packaging/anime-animation" className="hover:text-[#EE1122] transition-colors">
                Anime Blueprint
              </Link>
            </li>
            <li>
              <Link href="/youtube-packaging/personality-vlog" className="hover:text-[#EE1122] transition-colors">
                Vlog Blueprint
              </Link>
            </li>"""

t2 = """            <li>
              <Link href="/blog" className="hover:text-[#EE1122] transition-colors">
                Resources &amp; Blog
              </Link>
            </li>"""

r2 = """            <li>
              <Link href="/about" className="hover:text-[#EE1122] transition-colors">
                About PreYT
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-[#EE1122] transition-colors">
                Resources &amp; Blog
              </Link>
            </li>"""

t3 = """            <li>
              <Link href="/legal/cookies" className="hover:text-[#EE1122] transition-colors">
                Cookie Policy
              </Link>
            </li>"""

r3 = """            <li>
              <Link href="/legal/cookies" className="hover:text-[#EE1122] transition-colors">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link href="/integral-groups" className="hover:text-[#EE1122] transition-colors">
                Integral Groups
              </Link>
            </li>"""

if t1 in footer and t2 in footer and t3 in footer:
    footer = footer.replace(t1, r1, 1).replace(t2, r2, 1).replace(t3, r3, 1)
    with open("components/landing/footer.tsx", "w", encoding="utf-8") as f:
        f.write(footer)
    print("Updated footer internal linking successfully!")
else:
    print("Could not match footer blocks")
