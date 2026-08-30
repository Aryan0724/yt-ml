"""
backend/repositories/base.py

Abstract Repository Interface for analysis lifecycle persistence and usage tracking.
Decouples domain business logic from specific persistence implementations.
"""

from abc import ABC, abstractmethod
from typing import Optional, Dict, Any, List


class AnalysisRepositoryABC(ABC):
    @abstractmethod
    def save_analysis(
        self,
        payload: Dict[str, Any],
        workspace_id: Optional[str] = None,
        project_id: Optional[str] = None
    ) -> bool:
        """Persists the complete analysis result into the database."""
        pass

    @abstractmethod
    def get_analysis(
        self,
        analysis_id: str,
        workspace_id: str
    ) -> Optional[Dict[str, Any]]:
        """Retrieves a single analysis belonging to the specified workspace."""
        pass

    @abstractmethod
    def list_analyses(
        self,
        workspace_id: str,
        project_id: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Lists recent analyses within the tenant workspace."""
        pass

    @abstractmethod
    def save_ai_request(self, payload: Dict[str, Any]) -> Optional[str]:
        """Records generative AI request telemetry."""
        pass

    @abstractmethod
    def save_ai_error(self, payload: Dict[str, Any]) -> bool:
        """Records AI error and fallback diagnostics."""
        pass

    @abstractmethod
    def record_usage_event(self, event: Dict[str, Any]) -> bool:
        """Appends a record to the authoritative usage ledger."""
        pass
