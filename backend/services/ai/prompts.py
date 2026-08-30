"""
prompts.py

Unified evidence prompt builder for Gemini packaging evaluation.
Enforces that Gemini interprets real evidence without inventing statistics or facts.
"""
import json
from typing import Dict, Any, List, Optional


def generate_unified_evidence_prompt(
    title: str,
    category: str,
    tier: str,
    score: int,
    thumbnail_evidence: Dict[str, Any],
    title_evidence: Dict[str, Any],
    topic_evidence: Optional[Dict[str, Any]] = None,
    channel_dna_evidence: Optional[Dict[str, Any]] = None,
    strengths: Optional[List[str]] = None,
    weaknesses: Optional[List[str]] = None
) -> str:
    """
    Constructs the prompt containing the complete evidence package for Gemini.
    """
    evidence_package = {
        "title": {
            "text": title,
            "category": category,
            **title_evidence
        },
        "thumbnail": {
            "predicted_score": score,
            "predicted_tier": tier,
            **thumbnail_evidence
        }
    }

    if topic_evidence:
        evidence_package["topic_intelligence"] = topic_evidence

    if channel_dna_evidence:
        evidence_package["channel_dna"] = channel_dna_evidence

    strengths_str = "\n".join([f"  + {s}" for s in (strengths or [])]) or "  + Standard baseline composition"
    weaknesses_str = "\n".join([f"  - {w}" for w in (weaknesses or [])]) or "  - None flagged"

    return f"""You are PreYT's Executive Creator Decision Strategist.
Your mission is to evaluate the complete packaging triad for a YouTube video concept:
1. TOPIC MOMENTUM (Search demand, velocity, and timing)
2. TITLE FRAMING (Curiosity gap, clarity, and emotional hook)
3. THUMBNAIL VISUALS (Focal point, contrast, and mobile stopping power)

==================================================
EVIDENCE PACKAGE (REAL MEASURED DATA ONLY):
==================================================
{json.dumps(evidence_package, indent=2)}

SYSTEM DETECTED VISUAL STRENGTHS:
{strengths_str}

SYSTEM DETECTED VISUAL WEAKNESSES & RISKS:
{weaknesses_str}

==================================================
INSTRUCTIONS & PRODUCT RULES:
==================================================
1. STRICT TRUTH RULE: Base your diagnosis, bottleneck isolation, and recommendations ONLY on the provided evidence. Do NOT invent fake percentages, unsubstantiated CTR lifts, or non-existent competitor statistics.
2. PRIMARY BOTTLENECK: Identify which of the 3 pillars (Topic, Title, or Thumbnail) is the single biggest bottleneck holding back this package.
3. CONCRETE ANGLES: Provide 2-3 specific, actionable title/content framing angles that bridge the topic demand with the thumbnail hook.
4. HONEST LIMITATIONS: If competitive or historical data is missing, include an honest notice in `warnings` (e.g., "Competition landscape data unavailable").

Return EXACTLY a JSON object matching the requested schema.
"""


def generate_diagnosis_prompt(
    title: str,
    category: str,
    tier: str,
    score: int,
    dna_context: str,
    historical_errors: str,
    audience_distribution: str,
    strengths_str: str,
    weaknesses_str: str,
    topic_context: str = ""
) -> str:
    """
    Backwards-compatible wrapper that routes into the unified evidence format.
    """
    return generate_unified_evidence_prompt(
        title=title,
        category=category,
        tier=tier,
        score=score,
        thumbnail_evidence={"context": dna_context},
        title_evidence={},
        strengths=[s.strip(" -") for s in strengths_str.split("\n") if s.strip()],
        weaknesses=[w.strip(" -") for w in weaknesses_str.split("\n") if w.strip()]
    )
