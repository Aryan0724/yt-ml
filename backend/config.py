"""
config.py — Central configuration for the YouTube Regional Engagement Dataset pipeline.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ── API ───────────────────────────────────────────────────────────────────────
YOUTUBE_API_KEY: str = os.getenv("YOUTUBE_API_KEY", "")
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

# ── Collection settings ───────────────────────────────────────────────────────
MAX_RESULTS_PER_QUERY: int = 50   # videos per search page (API maximum)
MAX_PAGES_PER_QUERY: int = 4      # pages of pagination per query
                                  # Budget: 20 queries × 4 pages × 100 units = 8,000 units
                                  # + videos.list (~80 units) ≈ 8,080 total / 10,000 cap
BATCH_SIZE: int = 50              # max IDs per videos.list call (API limit)
MIN_VIEW_COUNT: int = 1_000       # filter threshold

# ── Output ────────────────────────────────────────────────────────────────────
OUTPUT_FILE: str = "youtube_regional_engagement_dataset.csv"

CSV_COLUMNS = [
    "video_id",
    "title",
    "published_at",
    "view_count",
    "like_count",
    "comment_count",
    "engagement_score",
    "region",
    "category",
    "language",
    "thumbnail_url",
]

# ── Query → Metadata mapping ──────────────────────────────────────────────────
# Format: "query string": (region, category, language)
QUERY_MAP: dict[str, tuple[str, str, str]] = {
    # North — Hindi
    "hindi education 2024":  ("North", "Education",     "Hindi"),
    "hindi comedy video":    ("North", "Entertainment", "Hindi"),
    "hindi gaming gameplay": ("North", "Gaming",        "Hindi"),
    "hindi news today":      ("North", "News",          "Hindi"),
    "hindi vlog":            ("North", "Vlogs",         "Hindi"),

    # South — Tamil / Telugu
    "tamil education":       ("South", "Education",     "Tamil"),
    "tamil comedy":          ("South", "Entertainment", "Tamil"),
    "telugu gaming":         ("South", "Gaming",        "Telugu"),
    "tamil news":            ("South", "News",          "Tamil"),
    "tamil vlog":            ("South", "Vlogs",         "Tamil"),

    # East — Bengali
    "bengali education":     ("East",  "Education",     "Bengali"),
    "bengali news":          ("East",  "News",          "Bengali"),
    "bengali entertainment": ("East",  "Entertainment", "Bengali"),
    "bengali vlogs":         ("East",  "Vlogs",         "Bengali"),
    "bengali education":     ("East",  "Education",     "Bengali"),

    # West — Marathi / Gujarati
    "marathi news":          ("West",  "News",          "Marathi"),
    "marathi comedy":        ("West",  "Entertainment", "Marathi"),
    "marathi vlogs":         ("West",  "Vlogs",         "Marathi"),
    "marathi education":     ("West",  "Education",     "Marathi"),
}

# Language → BCP-47 relevance code for search.list
LANGUAGE_RELEVANCE_MAP: dict[str, str] = {
    "Hindi":    "hi",
    "Tamil":    "ta",
    "Telugu":   "te",
    "Bengali":  "bn",
    "Marathi":  "mr",
    "Gujarati": "gu",
}
