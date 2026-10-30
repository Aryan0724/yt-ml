"""
backend/db/models/user_preference.py

Stores user onboarding personalization responses and platform preferences.
"""

import uuid
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from db.models.user import User


class UserPreference(Base, TimestampMixin):
    __tablename__ = "user_preferences"

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
    creator_category: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    primary_goal: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    publishing_frequency: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )

    # Relationships
    user: Mapped["User"] = relationship("User", backref="preferences", uselist=False)

    def __repr__(self) -> str:
        return f"<UserPreference user_id={self.user_id} category={self.creator_category} goal={self.primary_goal}>"
