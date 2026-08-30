import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel

class EvaluationScores(BaseModel):
    relevance: float
    completeness: float
    specificity: float
    clarity: float
    actionability: float

class LLMJudge:
    def __init__(self, model_name: str = None):
        self.model_name = model_name or os.environ.get("GEMINI_MODEL", "gemini-3.5-flash-lite")
        self.client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        
    def evaluate(self, prompt: str, ai_output: str) -> EvaluationScores:
        eval_prompt = f"""You are an expert YouTube Strategist judging the quality of an AI-generated Video Optimization Report.
Please evaluate the report based on these 5 criteria on a scale of 1.0 to 5.0:

1. Relevance: Does the output make sense for the given context?
2. Completeness: Does it address both the diagnosis and optimization plan?
3. Specificity: Is the advice specific to this particular niche, or generic?
4. Clarity: Is the writing clear, concise, and easy to read?
5. Actionability: (MOST IMPORTANT) Can a creator immediately DO something with this output? A vague 'Improve the title' is a 1. 'Change the title to create an open loop by adding a question mark' is a 5.

Return exactly a JSON object matching the requested schema.

=== SYSTEM PROMPT / CONTEXT GIVEN TO AI ===
{prompt}

=== AI OUTPUT ===
{ai_output}
"""
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=eval_prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=EvaluationScores,
                    temperature=0.1
                )
            )
            if response.text:
                return EvaluationScores.model_validate_json(response.text)
        except Exception as e:
            pass
            
        # Fallback to zeros if judge fails
        return EvaluationScores(relevance=0, completeness=0, specificity=0, clarity=0, actionability=0)
