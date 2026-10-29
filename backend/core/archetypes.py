"""
backend/core/archetypes.py

Packaging Archetype Engine:
Provides channel-format-specific visual & psychological evaluation models.
Ensures faceless channels, cartoon/animation, cooking, gaming, tech, and face-driven
creators are evaluated against their niche's true high-converting packaging meta.
"""

from enum import Enum
from typing import Dict, Any, List, Tuple


class PackagingArchetype(str, Enum):
    FACE_DRIVEN_CREATOR = "FACE_DRIVEN_CREATOR"
    FACELESS_DOCUMENTARY = "FACELESS_DOCUMENTARY"
    CARTOON_ANIMATION = "CARTOON_ANIMATION"
    COOKING_CULINARY = "COOKING_CULINARY"
    GAMING_ESPORTS = "GAMING_ESPORTS"
    TECH_PRODUCT_REVIEW = "TECH_PRODUCT_REVIEW"
    GENERAL_HYBRID = "GENERAL_HYBRID"


ARCHETYPE_METADATA = {
    PackagingArchetype.FACELESS_DOCUMENTARY: {
        "name": "Faceless Documentary / Video Essay",
        "description": "Information-driven essays (Vox, Magnates Media, Polymatter). Evaluates subject isolation, visual mystery, and dark vignettes without penalizing lack of human faces.",
        "face_required": False,
        "max_recommended_text_words": 3,
        "primary_driver": "Curiosity Gap & Information Asymmetry"
    },
    PackagingArchetype.FACE_DRIVEN_CREATOR: {
        "name": "Face-Driven Personality / Vlog",
        "description": "Creator-led entertainment and vlogs (MrBeast, Ali Abdaal). Evaluates eye-line gaze, facial scaling (>18% canvas), and high-contrast reaction intensity.",
        "face_required": True,
        "max_recommended_text_words": 4,
        "primary_driver": "Emotional Mirroring & Relatability"
    },
    PackagingArchetype.CARTOON_ANIMATION: {
        "name": "Cartoon & Animation Explainer",
        "description": "Vector/3D animated channels (Kurzgesagt, Infographics Show). Evaluates bold outline clarity, character silhouette recognition, and vibrant saturation.",
        "face_required": False,
        "max_recommended_text_words": 2,
        "primary_driver": "Surreal Visual Metaphor & High Contrast"
    },
    PackagingArchetype.COOKING_CULINARY: {
        "name": "Cooking & Culinary Arts",
        "description": "Food & recipe channels (Babish, Tasty). Evaluates appetizing color warmth (+warmth ratio), macro dish focus, and minimal text overlay.",
        "face_required": False,
        "max_recommended_text_words": 2,
        "primary_driver": "Sensory Appetence & Macro Presentation"
    },
    PackagingArchetype.GAMING_ESPORTS: {
        "name": "Gaming & Esports",
        "description": "Gameplay, challenges, and speedruns. Evaluates high-stakes in-game moments, neon/ambient contrast, and clean UI overlays.",
        "face_required": False,
        "max_recommended_text_words": 3,
        "primary_driver": "High-Stakes Tension & In-Game Stakes"
    },
    PackagingArchetype.TECH_PRODUCT_REVIEW: {
        "name": "Tech & Product Reviews",
        "description": "Hardware, teardowns, and setup showcases (MKBHD, Dave2D). Evaluates studio product rim lighting, minimal spec callouts, and clean background separation.",
        "face_required": False,
        "max_recommended_text_words": 3,
        "primary_driver": "Industrial Elegance & Generational Contrast"
    },
    PackagingArchetype.GENERAL_HYBRID: {
        "name": "General Hybrid Channel",
        "description": "Balanced baseline evaluating contrast, typography, and topic momentum.",
        "face_required": False,
        "max_recommended_text_words": 4,
        "primary_driver": "Clear Narrative Packaging"
    }
}


def detect_archetype_from_metadata(category: str, title: str, raw_factors: dict) -> PackagingArchetype:
    """
    Intelligently infers packaging archetype if not explicitly set by the creator.
    """
    cat_lower = (category or "").lower()
    title_lower = (title or "").lower()

    if any(k in cat_lower for k in ["cook", "food", "recipe", "kitchen", "bake", "chef"]):
        return PackagingArchetype.COOKING_CULINARY

    if any(k in cat_lower for k in ["animation", "cartoon", "anime", "illustration"]) or \
       any(k in title_lower for k in ["animation", "animated", "kurzgesagt"]):
        return PackagingArchetype.CARTOON_ANIMATION

    if any(k in cat_lower for k in ["gaming", "game", "esports", "minecraft", "roblox"]):
        return PackagingArchetype.GAMING_ESPORTS

    if any(k in cat_lower for k in ["tech", "technology", "gadget", "software", "hardware"]):
        return PackagingArchetype.TECH_PRODUCT_REVIEW

    if any(k in cat_lower for k in ["documentary", "history", "essay", "finance", "economy", "case study", "mystery"]) or \
       any(k in title_lower for k in ["rise and fall", "downfall", "how they did it", "the truth about", "exposed"]):
        return PackagingArchetype.FACELESS_DOCUMENTARY

    # If faces detected and prominent, classify as face-driven
    if raw_factors.get("face_count", 0) > 0 and raw_factors.get("average_face_area_pct", 0) > 10.0:
        return PackagingArchetype.FACE_DRIVEN_CREATOR

    return PackagingArchetype.GENERAL_HYBRID


class ArchetypeEvaluator:
    """
    Evaluates packaging against archetype-specific visual & psychological criteria.
    """

    @staticmethod
    def evaluate(archetype: PackagingArchetype, raw_input: Dict[str, Any]) -> Tuple[float, List[str], List[str], List[Dict[str, Any]]]:
        """
        Returns:
            - score_adjustment: positive boost or penalty offset
            - strengths: list of archetype-specific strengths
            - weaknesses: list of archetype-specific weaknesses
            - recommendations: list of actionable recommendations
        """
        score_adj = 0.0
        strengths = []
        weaknesses = []
        recommendations = []

        face_count = raw_input.get("face_count", 0)
        face_area_pct = raw_input.get("average_face_area_pct", 0.0)
        contrast_score = raw_input.get("contrast_score", 50.0)
        saturation_score = raw_input.get("saturation_score", 50.0)
        warmth_score = raw_input.get("warmth_score", 0.0)
        text_density = raw_input.get("text_density", 0.0)
        clutter_rating = raw_input.get("clutter_level_rating", 5.0)
        title = raw_input.get("title", "")

        # --- 1. FACELESS DOCUMENTARY ---
        if archetype == PackagingArchetype.FACELESS_DOCUMENTARY:
            # Reward clean composition without faces
            if face_count == 0:
                score_adj += 8.0
                strengths.append("High documentary credibility: Zero face distractions anchors curiosity in subject matter.")
            else:
                score_adj -= 5.0
                weaknesses.append("Human face presence may dilute investigative documentary tone.")
                recommendations.append({
                    "title": "Shift to Subject/Symbolic Focus",
                    "current": "Human face presence detected.",
                    "recommended": "Use an iconic silhouette, confidential dossier, or map/object hero element.",
                    "why": "Top investigative video essays (Vox, ColdFusion) rely on conceptual curiosity rather than creator reactions.",
                    "tier": "CRITICAL OPTIMIZATION",
                    "priority": "High"
                })

            if contrast_score > 60.0 and clutter_rating < 6.0:
                score_adj += 7.0
                strengths.append("Strong subject isolation: Clean contrast outlines draw instant focus to central mystery.")
            elif contrast_score < 45.0:
                score_adj -= 8.0
                weaknesses.append("Low subject separation diminishes documentary visual drama.")
                recommendations.append({
                    "title": "Apply Dark Radial Vignette",
                    "current": f"Contrast score is low ({int(contrast_score)}/100).",
                    "recommended": "Darken background perimeter by 30% to spotlight the key subject.",
                    "why": "Directing the viewer's eye to a single illuminated focal element drives faster comprehension.",
                    "tier": "CRITICAL OPTIMIZATION",
                    "priority": "High"
                })

        # --- 2. COOKING & CULINARY ---
        elif archetype == PackagingArchetype.COOKING_CULINARY:
            # Appetite appeal is heavily driven by color temperature and macro framing
            if warmth_score > 8.0:
                score_adj += 10.0
                strengths.append("Warm color temperature enhances culinary appetite appeal and mouth-watering aesthetic.")
            elif warmth_score < -10.0:
                score_adj -= 10.0
                weaknesses.append("Cold/blue color temperature diminishes food appeal.")
                recommendations.append({
                    "title": "Warm Up Color Temperature",
                    "current": "Cool/blue tones dominate image.",
                    "recommended": "Increase color temperature towards warm amber/golden tones (+15 warmth in Lightroom).",
                    "why": "Human visual perception associates golden/warm tones with freshness and cooked food.",
                    "tier": "CRITICAL OPTIMIZATION",
                    "priority": "High"
                })

            if text_density > 15.0:
                score_adj -= 8.0
                weaknesses.append("Heavy text overlay obscures the hero dish presentation.")
                recommendations.append({
                    "title": "Minimize Culinary Text",
                    "current": f"Text density is high ({int(text_density)}%).",
                    "recommended": "Remove all explanatory subtitles; let the finished dish fill 80% of the frame.",
                    "why": "Food content converts on sensory craving. Words block the visual payoff.",
                    "tier": "IMPORTANT OPTIMIZATION",
                    "priority": "High"
                })
            else:
                score_adj += 5.0
                strengths.append("Unobstructed dish composition maximizes appetence.")

        # --- 3. CARTOON & ANIMATION ---
        elif archetype == PackagingArchetype.CARTOON_ANIMATION:
            if saturation_score > 65.0:
                score_adj += 10.0
                strengths.append("Vibrant chromatic saturation matches top animation explainer standards (Kurzgesagt style).")
            elif saturation_score < 40.0:
                score_adj -= 10.0
                weaknesses.append("Subdued/flat colors weaken animated thumb prominence in mobile feeds.")
                recommendations.append({
                    "title": "Boost Animation Saturation",
                    "current": f"Color saturation is low ({int(saturation_score)}/100).",
                    "recommended": "Boost primary color saturation by 25% and ensure character line-art has clean black outlines.",
                    "why": "Animated thumbnails compete against real-world video frames; high saturation is required to stand out.",
                    "tier": "CRITICAL OPTIMIZATION",
                    "priority": "High"
                })

        # --- 4. FACE-DRIVEN PERSONALITY ---
        elif archetype == PackagingArchetype.FACE_DRIVEN_CREATOR:
            if face_count == 0:
                score_adj -= 15.0
                weaknesses.append("No human face detected for a personality-driven channel.")
                recommendations.append({
                    "title": "Add Creator Focal Face",
                    "current": "Zero faces found on canvas.",
                    "recommended": "Crop creator headshot tightly (occupying 18-25% of frame) with high eye-line contact.",
                    "why": "Personality channels convert on viewer parasocial connection and mirror-neuron reaction.",
                    "tier": "CRITICAL OPTIMIZATION",
                    "priority": "High"
                })
            elif face_area_pct >= 15.0:
                score_adj += 10.0
                strengths.append(f"Optimal creator face scaling ({face_area_pct:.1f}% canvas coverage) maximizes mobile feed eye contact.")
            else:
                score_adj -= 8.0
                weaknesses.append(f"Face crop is too small ({face_area_pct:.1f}% frame) for mobile glanceability.")
                recommendations.append({
                    "title": "Enlarge Creator Face Scale",
                    "current": f"Face occupies only {face_area_pct:.1f}% of frame.",
                    "recommended": "Enlarge face crop by 40% and align eyes in top third of thumbnail.",
                    "why": "On a 5.5-inch phone screen, small faces become indistinct blurs.",
                    "tier": "CRITICAL OPTIMIZATION",
                    "priority": "High"
                })

        # --- 5. TECH & PRODUCT REVIEW ---
        elif archetype == PackagingArchetype.TECH_PRODUCT_REVIEW:
            if contrast_score > 55.0 and clutter_rating < 5.0:
                score_adj += 9.0
                strengths.append("Studio product isolation: Clean rim lighting separates hardware cleanly from background.")
            if text_density > 20.0:
                score_adj -= 6.0
                weaknesses.append("Excessive text clutters industrial hardware aesthetic.")

        # --- 6. GAMING & ESPORTS ---
        elif archetype == PackagingArchetype.GAMING_ESPORTS:
            if saturation_score > 60.0 and contrast_score > 60.0:
                score_adj += 8.0
                strengths.append("High-energy gaming contrast: Dynamic neon lighting matches competitive esports feed expectations.")

        return score_adj, strengths, weaknesses, recommendations
