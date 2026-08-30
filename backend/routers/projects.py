"""
backend/routers/projects.py

Project management router grouping video package analyses by channel, playlist, or series.
"""

import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db_session
from core.dependencies import get_current_workspace, WorkspaceContext
from db.models.project import Project
from db.models.analysis import Analysis

router = APIRouter(prefix="/projects", tags=["Projects"])


class CreateProjectRequest(BaseModel):
    name: str
    description: Optional[str] = None
    channel_id: Optional[str] = None


@router.get("")
async def list_workspace_projects(
    ctx: WorkspaceContext = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db_session)
):
    projects = []
    try:
        stmt = (
            select(Project)
            .where(Project.workspace_id == ctx.workspace.id)
            .order_by(Project.created_at.desc())
        )
        projects = (await db.scalars(stmt)).all()
    except Exception:
        from services.auth.service import auth_service
        projects = [p for p in auth_service._memory_projects if p.workspace_id == ctx.workspace.id]

    return [
        {
            "id": str(p.id),
            "name": p.name,
            "description": p.description,
            "channel_id": p.channel_id,
            "created_at": p.created_at.isoformat() if hasattr(p, 'created_at') and p.created_at else "2026-08-29T22:00:00Z"
        }
        for p in projects
    ]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_project(
    req: CreateProjectRequest,
    ctx: WorkspaceContext = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db_session)
):
    """Creates a new project in the active workspace."""
    name = req.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Project name is required.")

    project = Project(
        id=uuid.uuid4(),
        workspace_id=ctx.workspace.id,
        name=name,
        description=req.description.strip() if req.description else None,
        channel_id=req.channel_id.strip() if req.channel_id else None
    )

    try:
        db.add(project)
        await db.commit()
    except Exception:
        from services.auth.service import auth_service
        auth_service._memory_projects.append(project)

    return {
        "id": str(project.id),
        "name": project.name,
        "description": project.description,
        "channel_id": project.channel_id,
        "created_at": "2026-08-29T22:00:00Z"
    }


@router.get("/{project_id}/analyses")
async def list_project_analyses(
    project_id: uuid.UUID,
    ctx: WorkspaceContext = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db_session)
):
    """Lists all analyses associated with a specific project."""
    stmt = (
        select(Analysis)
        .where(
            Analysis.project_id == project_id,
            Analysis.workspace_id == ctx.workspace.id
        )
        .order_by(Analysis.created_at.desc())
    )
    analyses = (await db.scalars(stmt)).all()

    return [
        {
            "id": str(a.id),
            "title": a.title,
            "score": a.score,
            "tier": a.tier,
            "confidence": a.confidence,
            "created_at": a.created_at.isoformat()
        }
        for a in analyses
    ]
