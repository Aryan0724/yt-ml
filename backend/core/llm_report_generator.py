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
    
    def generate_intelligent_improvements(self, raw_input, improvements):
        """
        Takes the base heuristic improvements and uses the LLM to rewrite the 'why' 
        and 'recommended' sections intelligently based on the video context.
        """
        if not self.enabled or not improvements:
            return improvements
            
        title = raw_input.get("title", "Unknown Title")
        category = raw_input.get("category", "Unknown Category")
        channel = raw_input.get("channel_title", "Unknown Channel")
        
        # Prepare the base improvements as JSON string
        base_improvements_json = json.dumps(improvements, indent=2)
        
        prompt = f"""You are a master YouTube Strategist for Diamond Intelligence.
Your job is to analyze the following algorithmic flags (improvements) for a video and provide a highly intelligent, contextual explanation for EACH improvement.

Context:
- Video Title: {title}
- Channel: {channel}
- Niche/Category: {category}

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

    def generate_executive_summary(self, raw_input, score, tier, safe_breakout, strengths, weaknesses):
        """Generates a dynamic 2-3 sentence executive strategy summary."""
        if not self.enabled:
            return ""
            
        title = raw_input.get("title", "Unknown Title")
        category = raw_input.get("category", "Unknown Category")
        
        prompt = f"""You are the Diamond Intelligence AI. Write a concise 2-sentence executive summary for the creator.
Context:
- Title: {title}
- Category: {category}
- Predicted Score: {score}/100 (Tier {tier})
- Top Strength: {strengths[0] if strengths else 'None'}
- Top Weakness: {weaknesses[0] if weaknesses else 'None'}

Be direct, strategic, and professional. Do not use generic phrases. Tell them what the fundamental opportunity or risk is.
"""
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return ""
