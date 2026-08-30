"""
backend/db/models/analysis.py

Core video package analysis record with OpenCV factors, ML score, topic momentum, and AI decision plan.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List, TYPE_CHECKING
from sqlalchemy import String, Float, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base

if TYPE_CHECKING:
    from db.models.workspace import Workspace
    from db.models.project import Project
    from db.models.usage_event import UsageEvent


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    workspace_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("workspaces.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    project_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="SET NULL"),
        index=True,
        nullable=True
    )
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    title: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )
    thumbnail_storage_key: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        comment="Storage path or S3 key for the thumbnail image"
    )
    niche: Mapped[str] = mapped_column(
        String(100),
        default="General",
        nullable=False
    )
    region: Mapped[str] = mapped_column(
        String(10),
        default="IN",
        nullable=False
    )
    score: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False
    )
    tier: Mapped[str] = mapped_column(
        String(10),
        default="C",
        nullable=False
    )
    confidence: Mapped[str] = mapped_column(
        String(20),
        default="MEDIUM",
        nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(30),
        default="completed",
        nullable=False,
        comment="Lifecycle status: pending, processing, completed, failed"
    )
    factors: Mapped[Dict[str, Any]] = mapped_column(
        JSONB,
        default=dict,
        nullable=False,
        comment="Measured OpenCV visual factors (contrast, brightness, faces)"
    )
    master_report: Mapped[Dict[str, Any]] = mapped_column(
        JSONB,
        default=dict,
        nullable=False,
        comment="Executive verdict, bottleneck diagnosis, and actionable angles"
    )
    topic_intelligence: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSONB,
        nullable=True,
        comment="Deterministic Google Trends momentum data"
    )
    raw_metrics: Mapped[Dict[str, Any]] = mapped_column(
        JSONB,
        default=dict,
        nullable=False
    )
    idempotency_key: Mapped[Optional[str]] = mapped_column(
        String(128),
        index=True,
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        index=True,
        nullable=False
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    # Relationships
    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="analyses")
    project: Mapped[Optional["Project"]] = relationship("Project", back_populates="analyses")
    usage_events: Mapped[List["UsageEvent"]] = relationship(
        "UsageEvent",
        back_populates="analysis",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Analysis id={self.id} title={self.title[:20]} score={self.score}>"
