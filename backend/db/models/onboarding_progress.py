"""
backend/db/models/onboarding_progress.py

Tracks user progression through the onboarding funnel.
"""

import uuid
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from db.models.user import User


class OnboardingProgress(Base, TimestampMixin):
    __tablename__ = "onboarding_progress"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )
    authentication_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    youtube_connected: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    channel_selected: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    personalization_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    # Relationships
    user: Mapped["User"] = relationship("User", backref="onboarding_progress", uselist=False)

    def __repr__(self) -> str:
        return f"<OnboardingProgress user_id={self.user_id} yt={self.youtube_connected} done={bool(self.completed_at)}>"
