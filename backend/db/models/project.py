"""
backend/db/models/project.py

Project model grouping video package analyses by channel or series.
"""

import uuid
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from db.models.workspace import Workspace
    from db.models.analysis import Analysis


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

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
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    channel_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )

    # Relationships
    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="projects")
    analyses: Mapped[List["Analysis"]] = relationship(
        "Analysis",
        back_populates="project",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Project id={self.id} name={self.name} ws={self.workspace_id}>"
