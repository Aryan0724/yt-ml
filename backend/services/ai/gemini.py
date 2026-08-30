import os
from google import genai
from google.genai import types
from pydantic import ValidationError
from .provider import AIProvider
from .schemas import EnhancementResult

# Model is configuration, not business logic.
# Set GEMINI_MODEL in .env.local to change models without touching this file.
# Verified active models: gemini-3.5-flash-lite, gemini-3.1-flash-lite
_DEFAULT_MODEL = "gemini-3.5-flash-lite"


class GeminiProvider(AIProvider):
    def __init__(self):
        self._model_name = os.environ.get("GEMINI_MODEL", _DEFAULT_MODEL)
        self.client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    @property
    def provider_name(self) -> str:
        return "gemini"

    @property
    def model_name(self) -> str:
        return self._model_name

    def generate_enhancement(self, prompt: str) -> EnhancementResult:
        response = self.client.models.generate_content(
            model=self._model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=EnhancementResult,
                temperature=0.2,
            )
        )

        if response.text:
            return EnhancementResult.model_validate_json(response.text)
        else:
            raise ValueError("Gemini returned an empty response")
