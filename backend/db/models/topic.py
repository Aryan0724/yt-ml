"""
backend/db/models/topic.py

Relational entities for market topic intelligence and historical radar snapshots.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    slug: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )
    canonical_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    category: Mapped[str] = mapped_column(
        String(100),
        default="General",
        nullable=False,
        index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    snapshots: Mapped[List["TopicSnapshot"]] = relationship(
        "TopicSnapshot",
        back_populates="topic",
        cascade="all, delete-orphan",
        order_by="desc(TopicSnapshot.captured_at)"
    )


class TopicSnapshot(Base):
    __tablename__ = "topic_snapshots"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    topic_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("topics.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    region: Mapped[str] = mapped_column(
        String(10),
        default="IN",
        nullable=False,
        index=True
    )
    time_range: Mapped[str] = mapped_column(
        String(20),
        default="12m",
        nullable=False
    )
    current_value: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )
    baseline_value: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )
    growth_rate: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False
    )
    short_term_momentum: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False
    )
    long_term_momentum: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False
    )
    volatility: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False
    )
    freshness: Mapped[float] = mapped_column(
        Float,
        default=50.0,
        nullable=False
    )
    saturation: Mapped[float] = mapped_column(
        Float,
        default=50.0,
        nullable=False
    )
    confidence: Mapped[str] = mapped_column(
        String(20),
        default="HIGH",
        nullable=False
    )
    opportunity_score: Mapped[float] = mapped_column(
        Float,
        default=50.0,
        nullable=False,
        index=True
    )
    opportunity_tier: Mapped[str] = mapped_column(
        String(20),
        default="MODERATE",
        nullable=False
    )
    classification: Mapped[str] = mapped_column(
        String(30),
        default="STABLE",
        nullable=False,
        index=True
    )
    model_version: Mapped[str] = mapped_column(
        String(20),
        default="2026-v1",
        nullable=False
    )
    why_this_matters: Mapped[Optional[str]] = mapped_column(
        String(1000),
        nullable=True
    )
    creator_opportunity: Mapped[Optional[str]] = mapped_column(
        String(1000),
        nullable=True
    )
    time_series: Mapped[List[Dict[str, Any]]] = mapped_column(
        JSONB,
        default=list,
        nullable=False
    )
    evidence: Mapped[Dict[str, Any]] = mapped_column(
        JSONB,
        default=dict,
        nullable=False
    )
    data_source: Mapped[str] = mapped_column(
        String(50),
        default="dataforseo_google_trends",
        nullable=False
    )
    captured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True
    )

    topic: Mapped["Topic"] = relationship("Topic", back_populates="snapshots")

    __table_args__ = (
        Index("ix_topic_snapshots_region_classification", "region", "classification"),
        Index("ix_topic_snapshots_region_opportunity", "region", "opportunity_score"),
    )
