"""
backend/db/models/usage_event.py

The Authoritative Economic Ledger. Records exact resource consumption and versioned pricing for every operation.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base

if TYPE_CHECKING:
    from db.models.workspace import Workspace
    from db.models.analysis import Analysis


class UsageEvent(Base):
    __tablename__ = "usage_events"

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
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    analysis_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("analyses.id", ondelete="SET NULL"),
        nullable=True
    )
    event_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="analysis_package, topic_search, ai_interpretation"
    )
    pricing_version: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Traceable pricing configuration version, e.g. 2026-v1"
    )
    gemini_input_tokens: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    gemini_output_tokens: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    gemini_cost_usd: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False
    )
    dataforseo_cost_usd: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False
    )
    compute_ms: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    total_cost_usd: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        index=True,
        nullable=False
    )

    # Relationships
    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="usage_events")
    analysis: Mapped[Optional["Analysis"]] = relationship("Analysis", back_populates="usage_events")

    def __repr__(self) -> str:
        return f"<UsageEvent ws={self.workspace_id} type={self.event_type} cost=${self.total_cost_usd:.4f}>"
