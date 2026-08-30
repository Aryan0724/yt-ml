"""
backend/db/models/workspace.py

Workspace tenancy boundary model. Every analysis and usage event belongs to a workspace.
"""

import uuid
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from db.models.workspace_member import WorkspaceMember
    from db.models.project import Project
    from db.models.analysis import Analysis
    from db.models.usage_event import UsageEvent
    from db.models.subscription import Subscription


class Workspace(Base, TimestampMixin):
    __tablename__ = "workspaces"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    slug: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False
    )
    plan_tier: Mapped[str] = mapped_column(
        String(50),
        default="free",
        nullable=False,
        comment="Current entitlement tier: free, pro, studio"
    )

    # Relationships
    members: Mapped[List["WorkspaceMember"]] = relationship(
        "WorkspaceMember",
        back_populates="workspace",
        cascade="all, delete-orphan"
    )
    projects: Mapped[List["Project"]] = relationship(
        "Project",
        back_populates="workspace",
        cascade="all, delete-orphan"
    )
    analyses: Mapped[List["Analysis"]] = relationship(
        "Analysis",
        back_populates="workspace",
        cascade="all, delete-orphan"
    )
    usage_events: Mapped[List["UsageEvent"]] = relationship(
        "UsageEvent",
        back_populates="workspace",
        cascade="all, delete-orphan"
    )
    subscription: Mapped[Optional["Subscription"]] = relationship(
        "Subscription",
        back_populates="workspace",
        uselist=False,
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Workspace id={self.id} slug={self.slug} tier={self.plan_tier}>"
