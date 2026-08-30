from abc import ABC, abstractmethod
from .schemas import EnhancementResult

class AIProvider(ABC):
    """Abstract base class for AI providers"""
    
    @abstractmethod
    def generate_enhancement(self, prompt: str) -> EnhancementResult:
        """
        Takes a prompt and returns a strictly typed EnhancementResult.
        Must raise exceptions on API failure or validation failure.
        """
        pass
    
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Name of the provider (e.g., 'gemini')"""
        pass

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Name of the specific model (e.g., 'gemini-2.5-flash')"""
        pass
