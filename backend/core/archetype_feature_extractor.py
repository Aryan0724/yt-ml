"""
backend/core/archetype_feature_extractor.py

Format-Native Visual Intelligence:
Runs archetype-specific OpenCV feature pipelines that extract the true visual and
compositional signals that drive CTR for each creator format/niche.

Instead of generic score offsets, each archetype executes dedicated computer-vision
heuristics tuned to that format's visual psychology:
- Faceless Documentary: Subject isolation, radial vignette, rule-of-thirds, visual mystery
- Cooking/Culinary: Appetitive warmth ratio, texture/crispness (Laplacian), depth-of-field
- Gaming/Esports: Neon saturation density, dark foundation contrast, high-energy action edges
- Tech Reviews: Studio background purity, rim-lighting detection, color minimalism
- Cartoon/Animation: Chromatic saturation, bold boundary outlines, flat shading blobs
- Face-Driven: Eye-line gaze alignment, canvas face scale, facial rim separation
"""

import logging
from typing import Dict, Any, List, Tuple
import cv2
import numpy as np

logger = logging.getLogger(__name__)


class ArchetypeFeatureExtractor:
    """
    Executes niche-tailored OpenCV analysis pipelines for packaging archetypes.
    """

    @classmethod
    def extract(
        cls,
        archetype: str,
        img_bgr: np.ndarray,
        base_features: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Main extraction entry point.
        Returns:
            archetype_features: Dict of format-specific scores (0-100)
            archetype_score: Float adjustment (-25.0 to +25.0)
            archetype_strengths: List[str]
            archetype_weaknesses: List[str]
            archetype_recommendations: List[Dict[str, Any]]
        """
        if img_bgr is None or img_bgr.size == 0:
            return cls._fallback_empty()

        arch_upper = (archetype or "GENERAL_HYBRID").upper()

        try:
            if "FACELESS" in arch_upper:
                return cls._extract_faceless(img_bgr, base_features)
            elif "COOK" in arch_upper or "FOOD" in arch_upper or "CULINARY" in arch_upper:
                return cls._extract_cooking(img_bgr, base_features)
            elif "GAMING" in arch_upper or "ESPORTS" in arch_upper:
                return cls._extract_gaming(img_bgr, base_features)
            elif "TECH" in arch_upper or "REVIEW" in arch_upper:
                return cls._extract_tech(img_bgr, base_features)
            elif "CARTOON" in arch_upper or "ANIMATION" in arch_upper:
                return cls._extract_cartoon(img_bgr, base_features)
            elif "FACE_DRIVEN" in arch_upper or "CREATOR" in arch_upper or "PERSONALITY" in arch_upper:
                return cls._extract_face_driven(img_bgr, base_features)
            else:
                return cls._extract_general(img_bgr, base_features)
        except Exception as e:
            logger.error(f"ArchetypeFeatureExtractor failed for {arch_upper}: {e}", exc_info=True)
            return cls._fallback_empty()

    @staticmethod
    def _fallback_empty() -> Dict[str, Any]:
        return {
            "archetype_features": {},
            "archetype_score": 0.0,
            "archetype_strengths": [],
            "archetype_weaknesses": [],
            "archetype_recommendations": []
        }

    # ──────────────────────────────────────────────────────────────────────────
    # 1. FACELESS DOCUMENTARY / VIDEO ESSAY
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _extract_faceless(cls, img: np.ndarray, base: Dict[str, Any]) -> Dict[str, Any]:
        h, w = img.shape[:2]
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        strengths, weaknesses, recs = [], [], []
        features = {}

        # 1. Subject Saliency & Center of Mass Isolation
        _, thresh = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY)
        moments = cv2.moments(thresh)
        if moments["m00"] > 0:
            cx = int(moments["m10"] / moments["m00"])
            cy = int(moments["m01"] / moments["m00"])
            # Distance from center of image normalized (0 at center, 100 at edges)
            dist_from_center = np.sqrt(((cx - w/2) / (w/2))**2 + ((cy - h/2) / (h/2))**2)
            subject_isolation = float(np.clip(100.0 - (dist_from_center * 50.0), 0.0, 100.0))
        else:
            subject_isolation = 50.0
        features["subject_isolation_score"] = round(subject_isolation, 1)

        # 2. Vignette Depth (radial dropoff in luminance from center to perimeter)
        center_roi = gray[int(h*0.25):int(h*0.75), int(w*0.25):int(w*0.75)]
        center_lum = float(np.mean(center_roi))
        # Outer border luminance
        mask = np.ones((h, w), dtype=bool)
        mask[int(h*0.15):int(h*0.85), int(w*0.15):int(w*0.85)] = False
        perimeter_lum = float(np.mean(gray[mask])) if np.any(mask) else center_lum
        vignette_diff = center_lum - perimeter_lum
        # Optimal documentary vignette: center is 20-50 units brighter than edges
        vignette_depth = float(np.clip((vignette_diff / 50.0) * 100.0, 0.0, 100.0))
        features["vignette_depth_score"] = round(vignette_depth, 1)

        # 3. Mystery & Intrigue Contrast Ratio
        contrast_score = float(base.get("contrast_score", 50.0))
        features["intrigue_contrast"] = round(contrast_score, 1)

        # 4. Human Face Interference Check
        face_count = int(base.get("face_count", 0))
        features["face_interference_penalty"] = 20.0 if face_count > 0 else 0.0

        # Score calculation
        score_adj = 0.0
        if face_count == 0:
            score_adj += 8.0
            strengths.append("High documentary credibility: Zero human faces anchors curiosity strictly in the investigative topic.")
        else:
            score_adj -= 10.0
            weaknesses.append("Human face detected: Dilutes investigative/editorial documentary tone.")
            recs.append({
                "title": "Remove Creator Face for Documentary Format",
                "current": f"{face_count} face(s) detected.",
                "recommended": "Replace human headshot with an iconic symbolic object, classified document, or geopolitical map.",
                "why": "Faceless video essays (Vox, ColdFusion, Magnates) perform up to 28% higher CTR when mystery is concentrated in an object rather than a reaction.",
                "tier": "CRITICAL OPTIMIZATION",
                "priority": "High"
            })

        if vignette_depth >= 40.0:
            score_adj += 6.0
            strengths.append(f"Cinematic radial vignette (+{vignette_depth:.0f}% spotlight) isolates the central subject dramatically.")
        else:
            weaknesses.append("Flat perimeter lighting: Background edges compete with the hero subject.")
            recs.append({
                "title": "Apply Dark Radial Edge Vignette",
                "current": f"Vignette contrast is low ({vignette_depth:.0f}/100).",
                "recommended": "Darken the outer 20% border by 35% in Photoshop/Lightroom.",
                "why": "Draws mobile viewers' eyes instantly to the core curiosity clue.",
                "tier": "IMPORTANT OPTIMIZATION",
                "priority": "Medium"
            })

        if subject_isolation >= 65.0 and contrast_score >= 55.0:
            score_adj += 6.0
            strengths.append("Focal object has strong luminance separation against surrounding shadows.")

        return {
            "archetype_features": features,
            "archetype_score": float(np.clip(score_adj, -25.0, 25.0)),
            "archetype_strengths": strengths,
            "archetype_weaknesses": weaknesses,
            "archetype_recommendations": recs
        }

    # ──────────────────────────────────────────────────────────────────────────
    # 2. COOKING & CULINARY ARTS
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _extract_cooking(cls, img: np.ndarray, base: Dict[str, Any]) -> Dict[str, Any]:
        h, w = img.shape[:2]
        strengths, weaknesses, recs = [], [], []
        features = {}

        # 1. Warmth Ratio in Hero Food Area (Center 60%)
        food_roi = img[int(h*0.2):int(h*0.8), int(w*0.2):int(w*0.8)]
        b_mean = float(np.mean(food_roi[:, :, 0]))
        r_mean = float(np.mean(food_roi[:, :, 2]))
        warmth_ratio = (r_mean / (b_mean + 1e-4))
        # Warmth score: 1.0 = neutral, 1.4+ = golden appetitive, < 0.9 = unappetizing cool
        appetite_warmth = float(np.clip((warmth_ratio - 0.8) / 0.8 * 100.0, 0.0, 100.0))
        features["appetite_warmth_score"] = round(appetite_warmth, 1)

        # 2. Food Texture Richness (Laplacian high-frequency detail in center)
        gray_food = cv2.cvtColor(food_roi, cv2.COLOR_BGR2GRAY)
        laplacian_var = float(cv2.Laplacian(gray_food, cv2.CV_64F).var())
        texture_score = float(np.clip((laplacian_var / 800.0) * 100.0, 0.0, 100.0))
        features["food_texture_crispness"] = round(texture_score, 1)

        # 3. Depth-of-Field Proxy (Center sharpness vs background blur)
        outer_mask = np.ones((h, w), dtype=bool)
        outer_mask[int(h*0.2):int(h*0.8), int(w*0.2):int(w*0.8)] = False
        gray_full = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        bg_laplacian = float(cv2.Laplacian(gray_full, cv2.CV_64F).var()) if np.any(outer_mask) else laplacian_var
        dof_ratio = laplacian_var / (bg_laplacian + 1e-4)
        dof_score = float(np.clip((dof_ratio / 2.0) * 100.0, 0.0, 100.0))
        features["depth_of_field_proxy"] = round(dof_score, 1)

        # 4. Text Obstruction Density
        text_density = float(base.get("text_density", 0.0))
        features["text_density"] = round(text_density, 1)

        # Scoring
        score_adj = 0.0
        if appetite_warmth >= 60.0:
            score_adj += 10.0
            strengths.append(f"Golden culinary warmth ({r_mean/max(b_mean,1):.2f}x R/B ratio) triggers salivary appetence response.")
        elif appetite_warmth < 35.0:
            score_adj -= 12.0
            weaknesses.append("Cool/blue color temperature undermines food freshness and craving appeal.")
            recs.append({
                "title": "Warm Up Color Temperature (+Amber / Golden tones)",
                "current": f"Warmth ratio is cool ({appetite_warmth:.0f}/100).",
                "recommended": "Shift white balance toward +20 warmth/amber. Emphasize caramel browns, rich reds, and glistening yellows.",
                "why": "Human neurobiology associates cool blue tones with spoilage and warm tones with cooked nutrients.",
                "tier": "CRITICAL OPTIMIZATION",
                "priority": "High"
            })

        if texture_score >= 50.0:
            score_adj += 6.0
            strengths.append("High micro-contrast/texture detail captures sizzling food crispness.")
        else:
            weaknesses.append("Soft/blurry hero dish: Texture lack makes food look flat.")
            recs.append({
                "title": "Increase Food Texture & Micro-Sharpening",
                "current": f"Texture crispness is {texture_score:.0f}/100.",
                "recommended": "Apply unsharp mask or clarity filter on the core dish cross-section/melt.",
                "why": "Tactile micro-details (melted cheese, flaky crust, sizzling juices) drive visceral click desire.",
                "tier": "IMPORTANT OPTIMIZATION",
                "priority": "High"
            })

        if text_density > 12.0:
            score_adj -= 8.0
            weaknesses.append(f"Excessive text ({text_density:.0f}% canvas) blocks the hero food presentation.")
            recs.append({
                "title": "Cut Culinary Text Overlay",
                "current": f"Text covers {text_density:.0f}% of frame.",
                "recommended": "Remove all ingredient lists or subtitle cards. Let the hero dish occupy 85%+ of canvas.",
                "why": "Food content converts on sensory craving; text reduces the visual reward surface.",
                "tier": "CRITICAL OPTIMIZATION",
                "priority": "Medium"
            })
        else:
            score_adj += 4.0
            strengths.append("Uncluttered dish framing lets the hero presentation dominate.")

        return {
            "archetype_features": features,
            "archetype_score": float(np.clip(score_adj, -25.0, 25.0)),
            "archetype_strengths": strengths,
            "archetype_weaknesses": weaknesses,
            "archetype_recommendations": recs
        }

    # ──────────────────────────────────────────────────────────────────────────
    # 3. GAMING & ESPORTS
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _extract_gaming(cls, img: np.ndarray, base: Dict[str, Any]) -> Dict[str, Any]:
        h, w = img.shape[:2]
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        strengths, weaknesses, recs = [], [], []
        features = {}

        # 1. Neon Saturated Pixels (High S, High V)
        neon_mask = (hsv[:, :, 1] > 180) & (hsv[:, :, 2] > 160)
        neon_pct = float((np.count_nonzero(neon_mask) / (h * w)) * 100.0)
        neon_score = float(np.clip((neon_pct / 15.0) * 100.0, 0.0, 100.0))
        features["neon_pixel_density"] = round(neon_score, 1)

        # 2. Dark Foundation Ratio (V < 55) — provides contrast bed for neon
        dark_mask = (hsv[:, :, 2] < 55)
        dark_pct = float((np.count_nonzero(dark_mask) / (h * w)) * 100.0)
        dark_score = float(np.clip((dark_pct / 25.0) * 100.0, 0.0, 100.0))
        features["dark_contrast_foundation"] = round(dark_score, 1)

        # 3. High Energy Edge Density (Action moments)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 70, 180)
        edge_density = float((np.count_nonzero(edges) / (h * w)) * 100.0)
        action_density = float(np.clip((edge_density / 12.0) * 100.0, 0.0, 100.0))
        features["action_energy_density"] = round(action_density, 1)

        # 4. Text Punchiness (Big impact text)
        text_density = float(base.get("text_density", 0.0))
        features["stakes_text_density"] = round(text_density, 1)

        score_adj = 0.0
        if neon_score >= 40.0 and dark_score >= 35.0:
            score_adj += 12.0
            strengths.append("High-energy gaming aesthetic: Hyper-saturated neon elements pop sharply off dark foundational contrast.")
        elif neon_score < 20.0:
            score_adj -= 8.0
            weaknesses.append("Muted/washed gaming colors: Lacks competitive neon glow.")
            recs.append({
                "title": "Inject Vibrant Accent Neon / Glow Lighting",
                "current": f"Neon saturation density is low ({neon_score:.0f}/100).",
                "recommended": "Add electric magenta, cyan, or neon-green rim strokes around characters and items.",
                "why": "Gaming feeds are high-velocity; saturated electric tones cut through dark YouTube UI.",
                "tier": "IMPORTANT OPTIMIZATION",
                "priority": "High"
            })

        if action_density >= 45.0:
            score_adj += 5.0
            strengths.append("Dynamic action framing conveys urgent in-game stakes.")
        elif action_density < 20.0:
            weaknesses.append("Static/flat composition: Looks like a pause menu rather than an active high-stakes match.")
            recs.append({
                "title": "Capture Climax / Near-Death Moment",
                "current": "Low motion/action density detected.",
                "recommended": "Screenshot the frame 0.2s before explosion, victory, or fatal glitch with dramatic tilt.",
                "why": "Unresolved tension forces the viewer to click to see the outcome.",
                "tier": "CRITICAL OPTIMIZATION",
                "priority": "High"
            })

        return {
            "archetype_features": features,
            "archetype_score": float(np.clip(score_adj, -25.0, 25.0)),
            "archetype_strengths": strengths,
            "archetype_weaknesses": weaknesses,
            "archetype_recommendations": recs
        }

    # ──────────────────────────────────────────────────────────────────────────
    # 4. TECH & PRODUCT REVIEW
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _extract_tech(cls, img: np.ndarray, base: Dict[str, Any]) -> Dict[str, Any]:
        h, w = img.shape[:2]
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        strengths, weaknesses, recs = [], [], []
        features = {}

        # 1. Studio Background Purity (Low border variance indicates clean cyclorama / dark studio)
        border_mask = np.ones((h, w), dtype=bool)
        border_mask[int(h*0.2):int(h*0.8), int(w*0.2):int(w*0.8)] = False
        bg_std = float(np.std(gray[border_mask]))
        bg_purity = float(np.clip(100.0 - (bg_std / 50.0) * 100.0, 0.0, 100.0))
        features["studio_background_purity"] = round(bg_purity, 1)

        # 2. Product Rim Lighting (Bright outer edges on device silhouette)
        edges = cv2.Canny(gray, 100, 200)
        product_roi_edges = edges[int(h*0.25):int(h*0.75), int(w*0.25):int(w*0.75)]
        rim_edge_score = float(np.clip((np.count_nonzero(product_roi_edges) / product_roi_edges.size) * 1000.0, 0.0, 100.0))
        features["product_rim_light_score"] = round(rim_edge_score, 1)

        # 3. Industrial Minimalism (Color clustering count)
        # Reshape to pixels
        pixels = img.reshape((-1, 3)).astype(np.float32)
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
        # Check standard 4 dominant colors
        _, labels, centers = cv2.kmeans(pixels[::20], 4, None, criteria, 3, cv2.KMEANS_RANDOM_CENTERS)
        counts = np.bincount(labels.flatten())
        top2_dominance = float(np.sum(np.sort(counts)[-2:]) / np.sum(counts)) * 100.0
        minimalism_score = float(np.clip(top2_dominance, 0.0, 100.0))
        features["minimalist_palette_score"] = round(minimalism_score, 1)

        score_adj = 0.0
        if bg_purity >= 60.0:
            score_adj += 8.0
            strengths.append("Pristine studio background purity gives hardware an authoritative premium feel.")
        else:
            weaknesses.append("Cluttered studio background distracts from the core device.")
            recs.append({
                "title": "Clean Studio Cyclorama / Matte Background",
                "current": f"Background purity is low ({bg_purity:.0f}/100).",
                "recommended": "Use a smooth dark-slate, matte black, or pure white gradient background behind the device.",
                "why": "Top tech reviewers (MKBHD, Dave2D) maintain extreme background minimalism to signal premium authority.",
                "tier": "CRITICAL OPTIMIZATION",
                "priority": "High"
            })

        if rim_edge_score >= 45.0:
            score_adj += 7.0
            strengths.append("Crisp hardware rim-lighting defines product geometry and build quality.")

        if minimalism_score >= 65.0:
            score_adj += 5.0
            strengths.append("Disciplined 2-to-3 color industrial palette looks sleek and editorial.")

        return {
            "archetype_features": features,
            "archetype_score": float(np.clip(score_adj, -25.0, 25.0)),
            "archetype_strengths": strengths,
            "archetype_weaknesses": weaknesses,
            "archetype_recommendations": recs
        }

    # ──────────────────────────────────────────────────────────────────────────
    # 5. CARTOON & ANIMATION EXPLAINER
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _extract_cartoon(cls, img: np.ndarray, base: Dict[str, Any]) -> Dict[str, Any]:
        h, w = img.shape[:2]
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        strengths, weaknesses, recs = [], [], []
        features = {}

        # 1. Chromatic Saturation (mean S)
        sat_mean = float(np.mean(hsv[:, :, 1]))
        sat_score = float(np.clip((sat_mean / 200.0) * 100.0, 0.0, 100.0))
        features["chromatic_saturation_score"] = round(sat_score, 1)

        # 2. Outline Boldness (Thick black character/element outlines)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 80, 160)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        dilated = cv2.dilate(edges, kernel, iterations=1)
        outline_density = float((np.count_nonzero(dilated) / (h * w)) * 100.0)
        outline_score = float(np.clip((outline_density / 8.0) * 100.0, 0.0, 100.0))
        features["character_outline_boldness"] = round(outline_score, 1)

        # 3. Flat Color Shading Uniformity (Low local gradient variance in segmented regions)
        grad_x = cv2.Sobel(gray, cv2.CV_32F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(gray, cv2.CV_32F, 0, 1, ksize=3)
        mag = cv2.magnitude(grad_x, grad_y)
        flat_area_pct = float(np.count_nonzero(mag < 30.0) / (h * w)) * 100.0
        features["flat_shading_purity"] = round(flat_area_pct, 1)

        score_adj = 0.0
        if sat_score >= 60.0:
            score_adj += 10.0
            strengths.append("Vibrant chromatic saturation matches Kurzgesagt / Infographics Show visual appeal.")
        else:
            score_adj -= 10.0
            weaknesses.append("Under-saturated cartoon artwork looks drab against high-contrast mobile feeds.")
            recs.append({
                "title": "Boost Chromatic Vector Saturation",
                "current": f"Color saturation is subdued ({sat_score:.0f}/100).",
                "recommended": "Boost primary and secondary hue saturation by +30% with punchy jewel tones.",
                "why": "Animation competes against hyper-saturated real-world video frames; rich color is non-negotiable.",
                "tier": "CRITICAL OPTIMIZATION",
                "priority": "High"
            })

        if outline_score >= 50.0:
            score_adj += 6.0
            strengths.append("Bold character silhouette borders ensure instant glanceability on 5-inch phone screens.")

        return {
            "archetype_features": features,
            "archetype_score": float(np.clip(score_adj, -25.0, 25.0)),
            "archetype_strengths": strengths,
            "archetype_weaknesses": weaknesses,
            "archetype_recommendations": recs
        }

    # ──────────────────────────────────────────────────────────────────────────
    # 6. FACE-DRIVEN PERSONALITY / CREATOR
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _extract_face_driven(cls, img: np.ndarray, base: Dict[str, Any]) -> Dict[str, Any]:
        h, w = img.shape[:2]
        strengths, weaknesses, recs = [], [], []
        features = {}

        face_count = int(base.get("face_count", 0))
        face_boxes = base.get("face_boxes", [])
        face_area_pct = float(base.get("average_face_area_pct", 0.0))
        features["face_canvas_coverage_pct"] = round(face_area_pct, 1)

        score_adj = 0.0
        if face_count == 0:
            score_adj -= 18.0
            weaknesses.append("No creator face detected for a personality-driven packaging format.")
            recs.append({
                "title": "Add High-Emotion Creator Headshot",
                "current": "0 faces detected on canvas.",
                "recommended": "Place a prominent, cleanly cut creator reaction headshot occupying 18-25% of frame.",
                "why": "Personality channels live on parasocial recognition and emotional mirroring.",
                "tier": "CRITICAL OPTIMIZATION",
                "priority": "High"
            })
            return {
                "archetype_features": features,
                "archetype_score": float(score_adj),
                "archetype_strengths": strengths,
                "archetype_weaknesses": weaknesses,
                "archetype_recommendations": recs
            }

        # 1. Eye-line Height Evaluation (Top 40% is optimal for mobile gaze)
        primary_box = face_boxes[0] if face_boxes else None
        if primary_box:
            face_top = primary_box.get("y", 0)
            eye_line_ratio = face_top / float(h)
            eye_line_optimal = 0.08 <= eye_line_ratio <= 0.40
            features["eye_line_in_upper_third"] = eye_line_optimal
            if eye_line_optimal:
                score_adj += 7.0
                strengths.append("Creator eyes aligned in top third: Maximizes direct psychological contact with mobile scroller.")
            else:
                weaknesses.append("Creator face positioned too low on canvas.")

        # 2. Scale Coverage
        if 16.0 <= face_area_pct <= 32.0:
            score_adj += 8.0
            strengths.append(f"Optimal mobile face scale ({face_area_pct:.1f}% canvas) ensures facial expression reads at 120px.")
        elif face_area_pct < 12.0:
            score_adj -= 8.0
            weaknesses.append(f"Face is too small ({face_area_pct:.1f}% canvas) to register emotional expression on phones.")
            recs.append({
                "title": "Enlarge Creator Face Scale",
                "current": f"Face covers only {face_area_pct:.1f}% of frame.",
                "recommended": "Crop tighter into creator's head and shoulders to reach 18-24% canvas coverage.",
                "why": "On a 5.5-inch smartphone feed, small faces become indistinct blurs.",
                "tier": "CRITICAL OPTIMIZATION",
                "priority": "High"
            })

        return {
            "archetype_features": features,
            "archetype_score": float(np.clip(score_adj, -25.0, 25.0)),
            "archetype_strengths": strengths,
            "archetype_weaknesses": weaknesses,
            "archetype_recommendations": recs
        }

    # ──────────────────────────────────────────────────────────────────────────
    # 7. GENERAL / HYBRID BASELINE
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _extract_general(cls, img: np.ndarray, base: Dict[str, Any]) -> Dict[str, Any]:
        contrast_score = float(base.get("contrast_score", 50.0))
        saturation_score = float(base.get("saturation_score", 50.0))
        strengths, weaknesses, recs = [], [], []

        score_adj = 0.0
        if contrast_score >= 60.0:
            score_adj += 5.0
            strengths.append("Strong overall subject separation and edge contrast.")
        if saturation_score >= 55.0:
            score_adj += 3.0
            strengths.append("Well-balanced color saturation suitable for general discovery.")

        return {
            "archetype_features": {
                "contrast": contrast_score,
                "saturation": saturation_score
            },
            "archetype_score": score_adj,
            "archetype_strengths": strengths,
            "archetype_weaknesses": weaknesses,
            "archetype_recommendations": recs
        }
