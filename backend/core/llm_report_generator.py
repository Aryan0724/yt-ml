import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Try loading .env.local
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env.local'))

# Setup Gemini API key. Ensure GEMINI_API_KEY is in environment or .env.local
api_key = os.environ.get("GEMINI_API_KEY")

class LLMReportGenerator:
    def __init__(self):
        self.model_name = "gemini-2.5-flash"
        self.enabled = bool(os.environ.get("GEMINI_API_KEY"))
        if self.enabled:
            # We enforce JSON output structure to guarantee clean integration.
            self.client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    def generate_master_report(self, raw_input, score, tier, strengths, weaknesses, dna_profile=None):
        """
        Generates a unified, dead-simple master report containing exactly what went wrong, 
        competitor strategies, exact steps to fix, and a simple DNA summary.
        """
        if not self.enabled:
            return {
                "diagnosis": {
                    "root_cause": "The AI could not analyze the image right now.",
                    "severity": "Medium",
                    "evidence": "We couldn't connect to the AI.",
                    "expected_consequence": "Cannot project engagement without data."
                },
                "optimization_plan": [
                    {
                        "priority": 1,
                        "action": "Increase brightness",
                        "rationale": "Competitors are using brighter colors."
                    }
                ]
            }
            
        title = raw_input.get("title", "Unknown Title")
        category = raw_input.get("category", "Unknown Category")
        
        dna_context = ""
        historical_errors = "None"
        audience_distribution = "Unknown"
        
        if dna_profile:
            dna_context = f"- Channel Identity: {dna_profile.get('channel_behavior_profile', {}).get('channel_identity', 'Standard')}"
            historical_errors = dna_profile.get('historical_errors', 'None')
            audience_distribution = dna_profile.get('audience_distribution', 'Unknown')

        strengths_str = "\n".join([f" - {s}" for s in strengths]) if strengths else " - None"
        weaknesses_str = "\n".join([f" - {w}" for w in weaknesses]) if weaknesses else " - None"

        prompt = f"""You are an elite YouTube Strategist serving as a 'Diagnosis Engine'. 
Your job is to look at a video idea's algorithmic breakdown and generate a structured diagnosis and optimization plan.

Video Context:
- Title: "{title}"
- Niche/Category: {category}
- AI Predicted Tier: {tier} (Score: {score}/100)
{dna_context}

Historical Channel Data:
- Known Past Mistakes: {historical_errors}
- Audience Demographics: {audience_distribution}

System Detected Strengths:
{strengths_str}

System Detected Flaws & Behavioral Risks:
{weaknesses_str}

Return EXACTLY a JSON object with the following schema:
{{
  "diagnosis": {{
    "root_cause": "<Identify the fundamental psychological or visual issue, not just a symptom. 1 sentence.>",
    "severity": "<Critical | High | Medium | Low>",
    "evidence": "<Explicitly state the exact System Detected Flaws that prove this root cause.>",
    "expected_consequence": "<Explain how this will impact CTR or retention.>"
  }},
  "optimization_plan": [
    {{
      "priority": 1,
      "action": "<A highly specific step the creator must take to fix the root cause.>",
      "rationale": "<Why this works in the '{category}' niche.>"
    }},
    {{
      "priority": 2,
      "action": "<Another specific step.>",
      "rationale": "<Reasoning.>"
    }}
  ]
}}

Return ONLY a valid JSON object. Do not include markdown formatting like ```json.
"""
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                )
            )
            
            master_report = json.loads(response.text)
            return master_report
        except Exception as e:
            print(f"Master Report LLM Generation Failed: {e}")
            return {
                "diagnosis": {
                    "root_cause": "We couldn't connect to the AI to find the main issue.",
                    "severity": "Medium",
                    "evidence": "The connection to the deep logic engine timed out.",
                    "expected_consequence": "Cannot project engagement without data."
                },
                "optimization_plan": [
                    {
                        "priority": 1,
                        "action": "Check your title length",
                        "rationale": "Shorter titles often perform better."
                    }
                ]
            }
