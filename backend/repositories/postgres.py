"""
backend/repositories/postgres.py

PostgreSQL Implementation of AnalysisRepositoryABC.
Persists analysis lifecycle events and authoritative usage into PostgreSQL.
"""

import os
import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import sessionmaker, Session

from core.config import settings
from repositories.base import AnalysisRepositoryABC
from db.models.analysis import Analysis
from db.models.usage_event import UsageEvent

logger = logging.getLogger(__name__)


class PostgresRepository(AnalysisRepositoryABC):
    def __init__(self, sync_db_url: Optional[str] = None):
        url = sync_db_url or settings.DATABASE_SYNC_URL
        self.engine = None
        self.session_factory = None
        if url:
            try:
                self.engine = create_engine(
                    url,
                    pool_pre_ping=True,
                    pool_size=settings.DATABASE_POOL_SIZE,
                    max_overflow=settings.DATABASE_MAX_OVERFLOW
                )
                self.session_factory = sessionmaker(bind=self.engine, expire_on_commit=False)
                logger.info("PostgresRepository initialized with sync engine.")
            except Exception as e:
                logger.error(f"Could not connect to PostgreSQL: {e}")
                raise
        else:
            logger.error("No DATABASE_URL configured. Cannot initialize PostgresRepository.")
            raise ValueError("DATABASE_URL is required for production.")

    def save_analysis(
        self,
        payload: Dict[str, Any],
        workspace_id: Optional[str] = None,
        project_id: Optional[str] = None
    ) -> bool:
        """Persists the complete analysis record into PostgreSQL."""
        analysis_id = payload.get("analysis_id") or str(uuid.uuid4())
        ws_id = workspace_id or payload.get("workspace_id")

        if not self.session_factory or not ws_id:
            logger.error("Cannot save analysis: missing DB connection or workspace_id")
            return False

        try:
            with self.session_factory() as session:
                record = Analysis(
                    id=uuid.UUID(analysis_id),
                    workspace_id=uuid.UUID(ws_id),
                    project_id=uuid.UUID(project_id) if project_id else None,
                    title=payload.get("title", "Untitled"),
                    thumbnail_storage_key=payload.get("thumbnail_storage_key"),
                    niche=payload.get("niche", "General"),
                    region=payload.get("region", "IN"),
                    score=float(payload.get("score", 0.0)),
                    tier=payload.get("tier", "C"),
                    confidence=payload.get("confidence", "MEDIUM"),
                    status=payload.get("status", "completed"),
                    factors=payload.get("factors", {}),
                    master_report=payload.get("master_report", {}),
                    topic_intelligence=payload.get("topic_intelligence"),
                    raw_metrics=payload.get("raw_metrics", {}),
                    idempotency_key=payload.get("idempotency_key"),
                    created_at=datetime.now(timezone.utc),
                    completed_at=datetime.now(timezone.utc)
                )
                session.add(record)
                session.commit()
                return True
        except Exception as e:
            logger.error(f"PostgresRepository DB unreachable: {e}")
            return False

    def get_analysis(
        self,
        analysis_id: str,
        workspace_id: str
    ) -> Optional[Dict[str, Any]]:
        """Retrieves a single analysis by UUID within a workspace."""
        if not self.session_factory:
            return None

        try:
            with self.session_factory() as session:
                stmt = select(Analysis).where(
                    Analysis.id == uuid.UUID(analysis_id),
                    Analysis.workspace_id == uuid.UUID(workspace_id)
                )
                record = session.scalar(stmt)
                if not record:
                    return None
                return {
                    "id": str(record.id),
                    "workspace_id": str(record.workspace_id),
                    "project_id": str(record.project_id) if record.project_id else None,
                    "title": record.title,
                    "thumbnail_storage_key": record.thumbnail_storage_key,
                    "score": record.score,
                    "tier": record.tier,
                    "confidence": record.confidence,
                    "factors": record.factors,
                    "master_report": record.master_report,
                    "topic_intelligence": record.topic_intelligence,
                    "created_at": record.created_at.isoformat()
                }
        except Exception as e:
            logger.error(f"PostgresRepository DB unreachable on get: {e}")
            return None

    def list_analyses(
        self,
        workspace_id: str,
        project_id: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Lists analyses within a workspace."""
        if not self.session_factory:
            return []

        try:
            with self.session_factory() as session:
                stmt = select(Analysis).where(Analysis.workspace_id == uuid.UUID(workspace_id))
                if project_id:
                    stmt = stmt.where(Analysis.project_id == uuid.UUID(project_id))
                stmt = stmt.order_by(Analysis.created_at.desc()).limit(limit).offset(offset)
                records = session.scalars(stmt).all()
                return [
                    {
                        "id": str(r.id),
                        "title": r.title,
                        "score": r.score,
                        "tier": r.tier,
                        "confidence": r.confidence,
                        "created_at": r.created_at.isoformat()
                    }
                    for r in records
                ]
        except Exception as e:
            logger.error(f"PostgresRepository error listing analyses: {e}")
            return []

    def save_ai_request(self, payload: Dict[str, Any]) -> Optional[str]:
        """Telemetry trace for AI requests."""
        logger.debug(f"PostgresRepository AI Request: {payload.get('analysis_id')}")
        return str(uuid.uuid4())

    def save_ai_error(self, payload: Dict[str, Any]) -> bool:
        """Telemetry trace for AI errors."""
        logger.warning(f"PostgresRepository AI Error: {payload.get('error_type')}")
        return True

    def record_usage_event(self, event: Dict[str, Any]) -> bool:
        """Records an event into the authoritative usage_events table."""
        ws_id = event.get("workspace_id")
        if not self.session_factory or not ws_id:
            return False

        try:
            with self.session_factory() as session:
                record = UsageEvent(
                    workspace_id=uuid.UUID(ws_id),
                    user_id=uuid.UUID(event["user_id"]) if event.get("user_id") else None,
                    analysis_id=uuid.UUID(event["analysis_id"]) if event.get("analysis_id") else None,
                    event_type=event.get("event_type", "analysis_package"),
                    pricing_version=event.get("pricing_version", "2026-v1"),
                    gemini_input_tokens=event.get("gemini_input_tokens", 0),
                    gemini_output_tokens=event.get("gemini_output_tokens", 0),
                    gemini_cost_usd=float(event.get("gemini_cost_usd", 0.0)),
                    dataforseo_cost_usd=float(event.get("dataforseo_cost_usd", 0.0)),
                    compute_ms=int(event.get("compute_ms", 0)),
                    total_cost_usd=float(event.get("total_cost_usd", 0.0)),
                    created_at=datetime.now(timezone.utc)
                )
                session.add(record)
                session.commit()
                return True
        except Exception as e:
            logger.error(f"PostgresRepository failed to record usage event: {e}")
            return False
