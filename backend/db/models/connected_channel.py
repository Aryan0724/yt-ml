"""
backend/db/models/connected_channel.py

Represents YouTube channels connected to PreYT creator accounts.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, BigInteger, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from db.models.user import User


class ConnectedChannel(Base, TimestampMixin):
    __tablename__ = "connected_channels"

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
    youtube_channel_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True
    )
    channel_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    channel_handle: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True
    )
    thumbnail_url: Mapped[Optional[str]] = mapped_column(
        String(1024),
        nullable=True
    )
    subscriber_count: Mapped[int] = mapped_column(
        BigInteger,
        default=0,
        nullable=False
    )
    video_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    total_views: Mapped[int] = mapped_column(
        BigInteger,
        default=0,
        nullable=False
    )
    uploads_playlist_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    connection_status: Mapped[str] = mapped_column(
        String(50),
        default="active",
        nullable=False
    )
    is_primary: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    connected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", backref="connected_channels")

    __table_args__ = (
        Index("ix_user_yt_channel", "user_id", "youtube_channel_id", unique=True),
    )

    def __repr__(self) -> str:
        return f"<ConnectedChannel id={self.id} handle={self.channel_handle} user_id={self.user_id}>"
