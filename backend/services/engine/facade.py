from typing import Dict, Any, List

# Import the existing legacy engine
from creator_intelligence_engine import CreatorIntelligenceEngine

class EngineFacade:
    """
    Anti-corruption layer wrapping the legacy CreatorIntelligenceEngine.
    Provides a stable contract for the coordinator, decoupling it from the 
    underlying ML logic, heuristics, and models.
    """
    
    def __init__(self):
        self._engine = CreatorIntelligenceEngine()
        
    def analyze(self, raw_input: Dict[str, Any], analysis_id: str) -> Dict[str, Any]:
        """
        Run the full engine analysis using the legacy engine.
        Accepts raw input containing visual and metadata metrics.
        Returns the final master report, AI enhancement, and raw scores.
        """
        return self._engine.analyze_single(raw_input, analysis_id=analysis_id)
        
    def analyze_channel(self, channel_title: str, raw_input: Dict[str, Any]) -> Dict[str, Any]:
        """
        Run channel DNA analysis only (used by metadata-only endpoint).
        """
        return self._engine.channel_dna_engine.analyze_channel(channel_title, raw_input)
        
    def analyze_competitors(self, channel_title: str, title: str, niche: str, raw_input: Dict[str, Any]) -> Dict[str, Any]:
        """
        Run competitor analysis only (used by metadata-only endpoint).
        """
        return self._engine.competitor_engine.analyze_competitors(channel_title, title, niche, raw_input)
