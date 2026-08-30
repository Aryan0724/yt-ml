"""
backend/db/models/session.py

Active user sessions and hashed refresh tokens for secure token rotation and device revocation.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base

if TYPE_CHECKING:
    from db.models.user import User


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    token_hash: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        index=True,
        nullable=False,
        comment="SHA-256 hash of the cryptographic refresh token"
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        index=True,
        nullable=False
    )
    revoked_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None
    )
    ip_address: Mapped[Optional[str]] = mapped_column(
        String(45),
        nullable=True
    )
    user_agent: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    last_active_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="sessions")

    @property
    def is_active(self) -> bool:
        """Returns True if the session is not revoked and not expired."""
        now = datetime.now(timezone.utc)
        return self.revoked_at is None and self.expires_at > now

    def __repr__(self) -> str:
        return f"<Session id={self.id} user_id={self.user_id} active={self.is_active}>"
