"""
backend/db/models/subscription.py

Subscription and plan entitlement tier status for workspaces.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from db.models.workspace import Workspace


class Subscription(Base, TimestampMixin):
    __tablename__ = "subscriptions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    workspace_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("workspaces.id", ondelete="CASCADE"),
        unique=True,
        index=True,
        nullable=False
    )
    stripe_customer_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )
    stripe_subscription_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )
    plan: Mapped[str] = mapped_column(
        String(50),
        default="free",
        nullable=False,
        comment="free, pro, studio"
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default="active",
        nullable=False,
        comment="active, past_due, canceled"
    )
    current_period_start: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    current_period_end: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    cached_analyses_used: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        comment="Performance cache counter. Authoritative usage is always counted from usage_events"
    )

    # Relationships
    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="subscription")

    def __repr__(self) -> str:
        return f"<Subscription ws={self.workspace_id} plan={self.plan} status={self.status}>"
