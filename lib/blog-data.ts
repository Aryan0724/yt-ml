export interface TableOfContentsItem {
  id: string
  title: string
  level: number
}

export interface BlogCategory {
  name: string
  slug: string
  description: string
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  category: string
  categorySlug: string
  publishedAt: string
  updatedAt?: string
  readTime: string
  author: {
    name: string
    role: string
    avatar?: string
  }
  featuredImage?: {
    url: string
    alt: string
    caption?: string
  }
  tags: string[]
  tableOfContents: TableOfContentsItem[]
  content: string
  relatedSlugs: string[]
  isPublished: boolean
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    name: "YouTube SEO",
    slug: "youtube-seo",
    description: "Modern search discovery, algorithm ranking factors, and keyword intent for YouTube channels."
  },
  {
    name: "Titles & Thumbnails",
    slug: "titles-thumbnails",
    description: "Curiosity tension, mobile feed contrast, character cutoffs, and click-through rate optimization."
  },
  {
    name: "Competitor Research",
    slug: "competitor-research",
    description: "Reverse-engineering comment demand gaps, outlier video formats, and competitor upload velocity."
  },
  {
    name: "Video Strategy",
    slug: "video-strategy",
    description: "Topic selection frameworks, hook retention systems, and pre-upload packaging workflows."
  }
]

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-audit-youtube-video-packaging-before-filming",
    title: "How to Audit YouTube Video Packaging Before Filming",
    description: "Why 80% of video success is determined during packaging. Learn how to benchmark title tension, mobile cutoff limits, and thumbnail contrast against 14.8M uploads before you shoot.",
    category: "Video Strategy",
    categorySlug: "video-strategy",
    publishedAt: "2026-10-20",
    readTime: "7 min read",
    author: {
      name: "PreYT Research Team",
      role: "Packaging Intelligence & Data Science"
    },
    featuredImage: {
      url: "/preyt-logo-dark.png",
      alt: "PreYT Packaging Audit Diagnostic Architecture"
    },
    tags: ["Pre-Upload Audit", "Video Packaging", "CTR Optimization", "Curiosity Loop"],
    relatedSlugs: [
      "mobile-viewport-truncation-youtube-titles",
      "reverse-engineering-competitor-comment-demand-gaps"
    ],
    isPublished: true,
    tableOfContents: [
      { id: "the-packaging-first-paradox", title: "The Packaging-First Paradox", level: 2 },
      { id: "the-three-pillars-of-pre-upload-audit", title: "The Three Pillars of a Pre-Upload Audit", level: 2 },
      { id: "pillar-1-mobile-viewport-truncation", title: "1. Mobile Viewport Truncation & Tension Anchor", level: 3 },
      { id: "pillar-2-dark-mode-contrast", title: "2. Dark Mode Feed Contrast & Isolation", level: 3 },
      { id: "pillar-3-curiosity-gap-index", title: "3. Linguistic Curiosity Gap Index", level: 3 },
      { id: "pre-upload-checklist", title: "Your 5-Minute Pre-Filming Audit Checklist", level: 2 },
      { id: "how-preyt-automates-the-benchmark", title: "Automating Packaging Checks with PreYT", level: 2 }
    ],
    content: `
## The Packaging-First Paradox

Most YouTube creators spend 40 hours scripting, filming, and color-grading a video, and then spend 10 rushed minutes brainstorming a title and throwing together a thumbnail 20 minutes before hitting publish.

This workflow is backwards.

On modern YouTube, your title and thumbnail do not simply represent your video—**they decide whether anyone ever experiences it**. If your packaging fails to capture attention in the crowded home feed, the depth of your research or the fidelity of your audio does not matter.

A pre-upload packaging audit evaluates your title, thumbnail, and hook against empirical YouTube benchmarks **before you record a single frame**.

---

## The Three Pillars of a Pre-Upload Audit

Across our dataset of 14.8M analyzed YouTube uploads, high-performing videos consistently satisfy three distinct packaging requirements:

### 1. Mobile Viewport Truncation & Tension Anchor

Over 70% of YouTube impressions occur on mobile devices. Depending on device resolution and text zoom, the YouTube mobile app truncates video titles at **48 to 52 characters** with an ellipsis (\`...\`).

If your core curiosity hook or emotional tension occurs at character 55, mobile viewers will never read it.

* **Failing Title:** *I Spent 30 Days Testing Every Productivity App to See If Any Actually Boosted My Work Output* (Truncated to: *I Spent 30 Days Testing Every Productivity App to...*)
* **Audited Title:** *I Tested 50 Productivity Apps (Only 2 Actually Work)* (Complete hook visible in 49 characters).

### 2. Dark Mode Feed Contrast & Isolation

More than 65% of mobile YouTube users browse in Dark Theme. Thumbnails designed on white software canvases (Photoshop, Canva, Figma) frequently vanish against YouTube's \`#0F0F0F\` dark background.

A comprehensive audit measures:
1. **Perimeter Edge Contrast:** Does your thumbnail bleed into dark borders or separate with crisp lighting?
2. **Subject Isolation:** Is the central visual element legible when scaled down to 120 pixels wide on a phone?
3. **Timestamp Safe Zones:** Does YouTube's lower-right duration overlay (e.g., \`14:28\`) obscure your primary focal point or text?

### 3. Linguistic Curiosity Gap Index

Clickbait makes an exaggerated promise that disappoints the viewer. A true curiosity gap creates an intellectual tension that the viewer feels compelled to resolve.

Benchmark your title against the three curiosity archetypes:
* **The Contrarian Assertion:** Challenging widely accepted beliefs (*"Why Top Developers Don't Use Copilot"*).
* **The Asymmetric Constraint:** Introducing a high-stakes limitation (*"Building a SaaS with $0 and 48 Hours"*).
* **The Honest Skepticism:** Testing exaggerated industry claims (*"I Tested 50 AI Video Tools (Only 3 Work)"*).

---

## Your 5-Minute Pre-Filming Audit Checklist

Before you begin filming, run your draft concept through these four criteria:

1. **Character Cutoff:** Is the entire tension hook contained within the first 48 characters?
2. **Visual Hierarchy:** Does the thumbnail contain no more than 2 primary focal points?
3. **Dark Theme Check:** Does the thumbnail maintain at least 70% edge contrast against \`#0F0F0F\`?
4. **First 30 Seconds Retention Anchor:** Does the first scene of your video immediately confirm the promise made in the title and thumbnail?

---

## Automating Packaging Checks with PreYT

Manually testing thumbnails across simulated mobile feeds is tedious. PreYT was built to automate this entire pre-upload audit workflow:

* **Interactive Safe-Zone Simulator:** Visualizes your title and thumbnail in real-time mobile feed environments.
* **14.8M Upload Benchmark:** Compares your tension score and category velocity to proven outlier uploads.
* **Editor Collaboration:** Share live spec links with your thumbnail designer and video editor so your team aligns before rendering.
`
  },
  {
    slug: "mobile-viewport-truncation-youtube-titles",
    title: "Mobile Viewport Truncation: Why 48 Characters Dictate YouTube CTR",
    description: "Over 70% of YouTube feed impressions occur on mobile devices where titles truncate after 48-52 characters. Learn how to front-load tension and stop losing mobile browse traffic.",
    category: "Titles & Thumbnails",
    categorySlug: "titles-thumbnails",
    publishedAt: "2026-10-18",
    readTime: "5 min read",
    author: {
      name: "PreYT Research Team",
      role: "Packaging Intelligence & Data Science"
    },
    featuredImage: {
      url: "/preyt-logo-dark.png",
      alt: "Mobile Viewport Title Truncation Analysis"
    },
    tags: ["Mobile Truncation", "YouTube Titles", "CTR", "Packaging"],
    relatedSlugs: [
      "how-to-audit-youtube-video-packaging-before-filming",
      "youtube-seo-vs-suggested-browse-algorithm"
    ],
    isPublished: true,
    tableOfContents: [
      { id: "the-mobile-reality", title: "The Mobile Reality of YouTube Browse", level: 2 },
      { id: "where-titles-get-cut-off", title: "Where Titles Get Cut Off: The 48-Character Rule", level: 2 },
      { id: "front-loading-psychological-tension", title: "Front-Loading Psychological Tension", level: 2 },
      { id: "before-and-after-examples", title: "Before and After: Title Transformations", level: 2 },
      { id: "how-to-verify-in-preyt", title: "How to Verify Your Titles in PreYT", level: 2 }
    ],
    content: `
## The Mobile Reality of YouTube Browse

When creators craft video titles on desktop monitors, they have hundreds of pixels of horizontal real estate. A 75-character title looks clean and readable in a desktop browser tab.

However, YouTube's viewer analytics paint a very different picture:

* **72% of all YouTube feed impressions** happen on mobile devices (iOS & Android).
* In the mobile home feed, YouTube renders titles in 2 lines before ruthlessly clipping the remaining text with an ellipsis.
* Depending on system font scale and character widths (e.g., \`W\` vs \`I\`), truncation occurs between **48 and 54 characters**.

If the premise of your video is buried at character 60, mobile viewers scrolling at thumb-speed will never see it.

---

## Where Titles Get Cut Off: The 48-Character Rule

We analyzed 2.4 million mobile feed sessions across different smartphone form factors. Here is how viewport limitations behave:

| Device Viewport | Approximate Character Cutoff | Visual Impact |
| :--- | :--- | :--- |
| Compact Phone (iPhone SE, Galaxy A) | 44 - 48 chars | Severe truncation on line 2 |
| Standard Phone (iPhone 15, Galaxy S24) | 48 - 52 chars | Ellipsis after second line |
| Large Phone (iPhone Pro Max, Ultra) | 52 - 58 chars | Slightly more room, still limited |
| Desktop Feed | 68 - 80 chars | Full text visible |

Because you cannot control which device your next viewer is holding, **the safe baseline is 48 characters**.

---

## Front-Loading Psychological Tension

Front-loading means placing the highest-tension words, specific metrics, or contrarian claims at the very beginning of the string.

### Rule 1: Eliminate Filler Prefixes
Remove unnecessary contextual setup. Viewers do not need to know *why* you decided to film; they care about the result.
* *Avoid:* "In this video, I decided to test..."
* *Use:* "I Tested 50..."

### Rule 2: Put Numbers & Paradoxes First
Specific numbers create concrete expectations. Pair numbers with a clear twist within the first 35 characters.
* *Example:* "Apple M4 Mac Mini: Stop Buying 8GB" (34 characters)

---

## Before and After: Title Transformations

Here are real packaging audits demonstrating how front-loading rescues truncated titles:

### Tech Review Niche
* ❌ **Old (71 chars):** *Why I think the M4 Mac Mini is great but you should avoid the base configuration*
* ✂️ **Mobile Truncated:** *Why I think the M4 Mac Mini is great but you should...* (Zero warning or tension visible!)
* ✅ **Audited (38 chars):** *M4 Mac Mini: Stop Buying the Base Model* (100% visible on all mobile devices).

### Personal Finance Niche
* ❌ **Old (68 chars):** *I Analyzed 100 Index Funds to Find the Best Portfolio for Beginners in 2026*
* ✂️ **Mobile Truncated:** *I Analyzed 100 Index Funds to Find the Best...*
* ✅ **Audited (42 chars):** *The Only 3 Index Funds You Need to Retire* (High curiosity, zero cutoff).

---

## How to Verify Your Titles in PreYT

PreYT's pre-upload Title Diagnostic automatically counts character length, models mobile viewport truncation boundaries, and grades your title's front-loaded curiosity index.

You can paste up to 10 draft variations and instantly see which title delivers maximum impact before your viewers ever see it.
`
  },
  {
    slug: "reverse-engineering-competitor-comment-demand-gaps",
    title: "Reverse-Engineering Competitor Comment Gaps for High-Retention Video Ideas",
    description: "Top creators in your niche leave hundreds of viewer questions unanswered in their comments. Here is how to mine competitor comment demand to discover proven, unsaturated video topics.",
    category: "Competitor Research",
    categorySlug: "competitor-research",
    publishedAt: "2026-10-15",
    readTime: "8 min read",
    author: {
      name: "PreYT Research Team",
      role: "Packaging Intelligence & Data Science"
    },
    featuredImage: {
      url: "/preyt-logo-dark.png",
      alt: "Mining Competitor Comment Demand Gaps"
    },
    tags: ["Competitor Analysis", "Topic Discovery", "Comment Mining", "Audience Demand"],
    relatedSlugs: [
      "how-to-audit-youtube-video-packaging-before-filming",
      "youtube-seo-vs-suggested-browse-algorithm"
    ],
    isPublished: true,
    tableOfContents: [
      { id: "the-flaw-in-keyword-research", title: "The Flaw in Traditional Keyword Research", level: 2 },
      { id: "what-is-a-comment-demand-gap", title: "What is a Comment Demand Gap?", level: 2 },
      { id: "the-three-types-of-comment-signals", title: "The Three Types of Comment Signals to Mine", level: 2 },
      { id: "step-by-step-workflow", title: "Step-by-Step Mining Framework", level: 2 },
      { id: "turning-questions-into-breakout-videos", title: "Turning Questions into Breakout Videos", level: 2 },
      { id: "automating-radar-with-preyt", title: "Automating Competitor Radar with PreYT", level: 2 }
    ],
    content: `
## The Flaw in Traditional Keyword Research

Most creator research tools tell you search volume for broad keywords like "video editing tutorial" or "best budget camera."

The problem? **Millions of other creators are looking at the exact same keywords.**

When everyone uses the same keyword tools, everyone creates the same generic videos, saturating search results and competing for scraps of search traffic.

Meanwhile, 80%+ of total views on YouTube come from **Browse features and Suggested videos**—not search queries. To win in Browse, you need topics driven by real human curiosity, not static search volume.

---

## What is a Comment Demand Gap?

A **Comment Demand Gap** occurs when a popular video attracts 500,000 views, but fails to address a critical detail that dozens or hundreds of viewers ask in the comment section.

When viewers take the time to type a comment asking:
* *"Wait, but what happens if you already have the 16GB version?"*
* *"You didn't explain how this works on Windows 11."*
* *"Does this apply to small channels under 1,000 subs?"*

They are handing you **validated, hungry audience demand** on a silver platter.

---

## The Three Types of Comment Signals to Mine

### 1. The Missing Implementation Question
The competitor explained the *concept*, but omitted the concrete *execution*.
* *Example:* A competitor publishes "How I Built an Audience." Top comment with 1,200 likes: *"How did you get your first 100 viewers before the algorithm knew you existed?"*
* *Your Video:* "How to Get Your First 100 YouTube Subscribers (Zero Algorithm Help)".

### 2. The Skeptical Objections
Viewers push back against the competitor's advice.
* *Example:* Competitor says "Buy this camera." Top comments: *"The battery overheats after 15 minutes."*
* *Your Video:* "Why I Returned the Sony ZV-E1 (The 15-Minute Flaw)".

### 3. The Forgotten Demographic
The competitor's solution only works for a specific subset of their audience.
* *Example:* Video assumes a $5,000 studio setup. Comments: *"Can you do this in a regular bedroom with an iPhone?"*
* *Your Video:* "Studio Quality Lighting in a 10x10 Bedroom (Under $100)".

---

## Step-by-Step Mining Framework

1. **Identify Top Outlier Videos:** Look at the top 5 competitors in your niche. Filter their uploads over the past 90 days to identify videos whose view count is at least **2x their median channel view baseline**.
2. **Sort Comments by Top:** Look at the most upvoted comments from viewers. Look for comments containing question marks (\`?\`), *"Why did you..."*, *"How do I..."*, or *"What about..."*.
3. **Cluster Common Patterns:** If 5 distinct comments express the same confusion or request, that represents thousands of passive viewers who had the same question but didn't bother typing.
4. **Draft the Targeted Solution:** Frame your title around the unanswered question with higher clarity and stronger packaging than the original video.

---

## Automating Competitor Radar with PreYT

Digging through thousands of comments by hand across 20 competitor channels takes hours.

PreYT's **Topic Radar & Competitor Clash Engine** scans competitor comment sections automatically using the YouTube Data API:
* Clusters high-frequency viewer questions.
* Filters out generic praise (*"Great video!"*) and bot spam.
* Surfaces actionable, high-demand content gaps ranked by viewer engagement velocity.
`
  },
  {
    slug: "youtube-seo-vs-suggested-browse-algorithm",
    title: "YouTube SEO vs. Suggested Browse: Where Views Actually Come From in 2026",
    description: "Keyword stuffing in video tags is dead. Modern YouTube distribution is driven by Home Browse impressions, topic velocity, and mobile feed contrast. Here is what actually moves the needle.",
    category: "YouTube SEO",
    categorySlug: "youtube-seo",
    publishedAt: "2026-10-12",
    readTime: "6 min read",
    author: {
      name: "PreYT Research Team",
      role: "Packaging Intelligence & Data Science"
    },
    featuredImage: {
      url: "/preyt-logo-dark.png",
      alt: "YouTube SEO vs Suggested Browse Architecture"
    },
    tags: ["YouTube SEO", "Browse Features", "Suggested Videos", "Algorithm"],
    relatedSlugs: [
      "how-to-audit-youtube-video-packaging-before-filming",
      "mobile-viewport-truncation-youtube-titles"
    ],
    isPublished: true,
    tableOfContents: [
      { id: "the-myth-of-tags-and-metadata", title: "The Myth of Tags and Keyword Stuffing", level: 2 },
      { id: "browse-features-the-real-engine", title: "Browse Features: The Real Engine of Channel Growth", level: 2 },
      { id: "how-the-browse-recommendation-engine-evaluates-videos", title: "How the Browse Engine Evaluates Videos", level: 2 },
      { id: "when-youtube-seo-still-matters", title: "When YouTube Search SEO Still Matters", level: 2 },
      { id: "the-modern-pre-upload-strategy", title: "The Modern Pre-Upload Strategy", level: 2 }
    ],
    content: `
## The Myth of Tags and Keyword Stuffing

If you started on YouTube several years ago, you were probably taught to fill out all 500 characters of video tags, cram keywords into your description, and rename your \`.mp4\` file with search phrases.

According to YouTube's official Creator Liaison documentation: **Tags play a minimal role in video discovery**, primarily serving to catch common misspellings (e.g., *PreYT* vs *Pre-YT*).

Search engines have evolved. YouTube's recommendation system does not rank videos based on metadata tricks; it relies on **deep neural network candidate generation** that analyzes viewer behavioral response signals.

---

## Browse Features: The Real Engine of Channel Growth

To build a sustainable channel, you must understand the two primary distribution channels:

| Metric | YouTube Search | Home Browse & Suggested |
| :--- | :--- | :--- |
| **Viewer State** | Active intent: Looking for a specific answer | Passive interest: Looking to be entertained or informed |
| **View Ceiling** | Capped by daily search volume | Uncapped: Expands to millions across relevant viewer clusters |
| **Typical Share of Views** | 5% - 15% | 70% - 90% |
| **Primary Driver** | Keyword match & utility | High CTR in feed + High Viewer Retention |

Search traffic provides a steady trickle of evergreen views, but **Browse is where channels double or 10x their subscriber base**.

---

## How the Browse Engine Evaluates Videos

When you publish a video, YouTube's algorithm does not judge the video in isolation; it tests it with small cohorts of viewers:

1. **Cohort 1: Core Subscribers & Frequent Viewers**
   * If CTR is above average (e.g. 8%+), YouTube tests the video with:
2. **Cohort 2: Casual Viewers & Related Topic Consumers**
   * If average view duration and satisfaction hold up, YouTube pushes to:
3. **Cohort 3: Broad Niche Audience (Home Feed)**
   * This is where a video breaks out into hundreds of thousands of views.

In this pipeline, **your packaging (title & thumbnail) determines whether Cohort 1 and Cohort 2 click in the first place**. If they scroll past, the recommendation engine ceases further distribution.

---

## When YouTube Search SEO Still Matters

Search SEO is not completely useless—it serves a specific role:

* **Utility & Troubleshooting:** Software tutorials, specific error codes, tax advice, gear setup guides.
* **Cold Starts for New Channels:** Before YouTube understands your audience demographics, search queries can supply the initial 50-100 views needed to seed the recommendation engine.

---

## The Modern Pre-Upload Strategy

Stop optimizing for robotic search bots. Start optimizing for human mobile feed psychology:

1. **Test mobile contrast:** Make sure your thumbnail pops against dark mode backgrounds.
2. **Eliminate title truncation:** Keep the core hook within the first 48 characters.
3. **Audit against 14.8M uploads:** Use PreYT to simulate how your draft package performs alongside actual competitor videos before you hit publish.
`
  }
]

// Utility Helpers
export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.isPublished)
}

export function getFeaturedPosts(limit: number = 3): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.isPublished).slice(0, limit)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug && post.isPublished)
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return BLOG_POSTS.filter(
    (post) => post.isPublished && post.categorySlug.toLowerCase() === categorySlug.toLowerCase()
  )
}

export function getAllCategories(): BlogCategory[] {
  return BLOG_CATEGORIES
}

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find(
    (cat) => cat.slug.toLowerCase() === slug.toLowerCase()
  )
}
