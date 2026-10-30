"""
backend/db/models/oauth_connection.py

Stores OAuth 2.0 access and refresh tokens for connected providers (e.g. YouTube).
Encrypted at rest to protect creator authorization credentials.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from db.models.user import User


class OAuthConnection(Base, TimestampMixin):
    __tablename__ = "oauth_connections"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    provider: Mapped[str] = mapped_column(
        String(50),
        default="google_youtube",
        nullable=False
    )
    provider_account_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )
    encrypted_access_token: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )
    encrypted_refresh_token: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    token_type: Mapped[str] = mapped_column(
        String(50),
        default="bearer",
        nullable=False
    )
    scopes: Mapped[Optional[str]] = mapped_column(
        String(512),
        nullable=True
    )
    expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    # Relationships
    user: Mapped["User"] = relationship("User", backref="oauth_connections")

    __table_args__ = (
        Index("ix_user_provider", "user_id", "provider", unique=True),
    )

    def __repr__(self) -> str:
        return f"<OAuthConnection id={self.id} user_id={self.user_id} provider={self.provider}>"
