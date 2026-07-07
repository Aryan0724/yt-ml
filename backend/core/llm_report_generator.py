import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Try loading .env.local
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env.local'))

# Setup Gemini API key. Ensure GEMINI_API_KEY is in environment or .env.local
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class LLMReportGenerator:
    def __init__(self):
        self.model_name = "gemini-2.5-flash"
        self.enabled = bool(os.environ.get("GEMINI_API_KEY"))
        if self.enabled:
            # We enforce JSON output structure to guarantee clean integration.
            self.model = genai.GenerativeModel(self.model_name)
    
    def generate_intelligent_improvements(self, raw_input, improvements, dna_profile=None):
        """
        Takes the base heuristic improvements and uses the LLM to rewrite the 'why' 
        and 'recommended' sections intelligently based on the video context and channel DNA.
        """
        if not self.enabled or not improvements:
            return improvements
            
        title = raw_input.get("title", "Unknown Title")
        category = raw_input.get("category", "Unknown Category")
        channel = raw_input.get("channel_title", "Unknown Channel")
        
        # Prepare the base improvements as JSON string
        base_improvements_json = json.dumps(improvements, indent=2)
        
        # Prepare DNA context if available
        dna_context = ""
        if dna_profile:
            dna_context = f"""
Channel DNA Context:
- Channel Identity: {dna_profile.get('channel_behavior_profile', {}).get('channel_identity', 'Unknown')}
- Audience Preferences: {dna_profile.get('channel_behavior_profile', {}).get('audience_preference', 'Unknown')}
- Dominant Style: {dna_profile.get('channel_behavior_profile', {}).get('dominant_thumbnail_style', 'Unknown')}
"""

        prompt = f"""You are a master YouTube Strategist for Diamond Intelligence.
Your job is to analyze the following algorithmic flags (improvements) for a video and provide a highly intelligent, contextual explanation for EACH improvement.

Video Context:
- Video Title: {title}
- Channel: {channel}
- Niche/Category: {category}
{dna_context}

Base Improvements Flagged by our Heuristic Engine:
{base_improvements_json}

For each improvement in the list, return a JSON object with:
1. "title": Keep the original title or make it slightly more compelling.
2. "tier": Keep the exact original tier.
3. "current": A crisp 1-sentence summary of the current state.
4. "recommended": A highly actionable, specific step to fix it (tailored to {category}).
5. "why": A deeply psychological, strategic explanation of WHY this matters for audience retention and CTR. Make it sound intelligent, not robotic.
6. "improvement": Keep the original improvement percentage.

Respond ONLY with a valid JSON array of objects. Do not include markdown formatting (like ```json), just the raw JSON array.
"""
        try:
            response = self.model.generate_content(
                prompt,
                request_options={"timeout": 8},
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json"
                )
            )
            
            enhanced_improvements = json.loads(response.text)
            
            # Fallback to ensure we don't break the app if the LLM output is malformed
            if isinstance(enhanced_improvements, list) and len(enhanced_improvements) > 0:
                return enhanced_improvements
                
        except Exception as e:
            print(f"LLM Generation Failed, falling back to heuristics: {e}")
            pass
            
        return improvements

    def generate_executive_summary(self, raw_input, score, tier, safe_breakout, strengths, weaknesses, dna_profile=None):
        """Generates a dynamic 2-3 sentence executive strategy summary."""
        if not self.enabled:
            return ""
            
        title = raw_input.get("title", "Unknown Title")
        category = raw_input.get("category", "Unknown Category")
        
        dna_context = ""
        if dna_profile:
            dna_context = f"- Channel DNA: Audience strongly prefers {dna_profile.get('channel_behavior_profile', {}).get('audience_preference', 'standard formats')}."
        
        prompt = f"""You are the Diamond Intelligence AI. Write a concise 2-sentence executive strategy summary for this YouTube video.
Context:
- Title: {title}
- Category: {category}
- Predicted Score: {score}/100 (Tier {tier})
- Top Strength: {strengths[0] if strengths else 'None'}
- Top Weakness: {weaknesses[0] if weaknesses else 'None'}
{dna_context}

Be direct, strategic, and professional. Do not use generic phrases. Tell them what the fundamental opportunity or risk is, taking their audience preferences into account if provided.
"""
        try:
            response = self.model.generate_content(prompt, request_options={"timeout": 8})
            return response.text.strip()
        except Exception as e:
            return ""

    def generate_dna_alignment_insight(self, raw_input, dna_profile, tier):
        """Generates a 1-2 sentence insight about how well this matches their historic channel DNA."""
        if not self.enabled or not dna_profile:
            return ""
            
        title = raw_input.get("title", "Unknown Title")
        match_score = dna_profile.get("style_match_percentage", 50)
        identity = dna_profile.get("channel_behavior_profile", {}).get("channel_identity", "creator")
        
        prompt = f"""You are an elite YouTube analyst. 
The creator is uploading a video titled: "{title}".
Their historic channel identity is: "{identity}".
The AI determined that this new video's style matches their historical DNA at exactly {match_score}%.
The overall predicted performance tier is {tier}.

Write exactly 1-2 sentences explaining what this {match_score}% DNA match means for their core subscribers. 
If the match is high (>80%), tell them the core audience will easily recognize and click.
If it's low (<50%), warn them that they might alienate core viewers unless it's a breakout attempt.
Make it sound intelligent, strategic, and direct. Do not say "Based on the data".
"""
        try:
            response = self.model.generate_content(prompt, request_options={"timeout": 8})
            return response.text.strip()
        except Exception as e:
            return ""

    def generate_action_plan(self, raw_input, tier, strengths, weaknesses):
        """Generates 3 highly specific, actionable steps the user must take right now."""
        if not self.enabled:
            return []
            
        title = raw_input.get("title", "Unknown Title")
        category = raw_input.get("category", "Unknown Category")
        
        prompt = f"""You are the Diamond Intelligence AI.
The user is preparing to publish a YouTube video.
- Title: "{title}"
- Category: {category}
- Predicted Tier: {tier}
- Top Strength: {strengths[0] if strengths else 'None'}
- Top Weakness: {weaknesses[0] if weaknesses else 'None'}

Your job is to tell the user EXACTLY what to do and how to do it before publishing.
Return EXACTLY 3 actionable bullet points. Do not use generic advice. Give them hard instructions (e.g., "Change the text color to neon green", "Remove the word 'Tutorial' from the title").
Return ONLY a valid JSON array of 3 strings. Example: ["Step 1", "Step 2", "Step 3"]. Do not include markdown formatting.
"""
        try:
            response = self.model.generate_content(
                prompt,
                request_options={"timeout": 8},
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json"
                )
            )
            action_plan = json.loads(response.text)
            if isinstance(action_plan, list):
                return action_plan[:3]
        except Exception as e:
            pass
        return []
