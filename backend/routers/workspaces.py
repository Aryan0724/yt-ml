"""
backend/routers/workspaces.py

Workspace management router:
- List user's workspaces
- Create new workspaces
- Manage team members and roles
"""

import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db_session
from core.dependencies import get_current_user, get_current_workspace, WorkspaceContext
from db.models.user import User
from db.models.workspace import Workspace
from db.models.workspace_member import WorkspaceMember
from db.models.subscription import Subscription
from services.auth.service import AuthService

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])


class CreateWorkspaceRequest(BaseModel):
    name: str


class AddMemberRequest(BaseModel):
    email: EmailStr
    role: str = "member"


@router.get("")
async def list_user_workspaces(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    results = []
    try:
        stmt = (
            select(Workspace, WorkspaceMember.role)
            .join(WorkspaceMember, Workspace.id == WorkspaceMember.workspace_id)
            .where(WorkspaceMember.user_id == current_user.id)
            .order_by(WorkspaceMember.created_at.asc())
        )
        results = (await db.execute(stmt)).all()
    except Exception:
        from services.auth.service import auth_service
        for m in auth_service._memory_members:
            if m.user_id == current_user.id:
                ws = auth_service._memory_workspaces.get(m.workspace_id)
                if ws:
                    results.append((ws, m.role))

    return [
        {
            "id": str(ws.id),
            "name": ws.name,
            "slug": ws.slug,
            "plan_tier": ws.plan_tier,
            "role": role,
            "created_at": ws.created_at.isoformat() if hasattr(ws, 'created_at') and ws.created_at else datetime.now(timezone.utc).isoformat()
        }
        for ws, role in results
    ]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_workspace(
    req: CreateWorkspaceRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Creates a new workspace and sets the caller as Owner."""
    name = req.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Workspace name is required.")

    slug = AuthService._slugify(name)
    workspace = Workspace(
        id=uuid.uuid4(),
        name=name,
        slug=slug,
        owner_id=current_user.id,
        plan_tier="free"
    )

    # Owner membership
    member = WorkspaceMember(
        id=uuid.uuid4(),
        workspace_id=workspace.id,
        user_id=current_user.id,
        role="owner"
    )

    # Subscription
    sub = Subscription(
        id=uuid.uuid4(),
        workspace_id=workspace.id,
        plan="free",
        status="active"
    )

    try:
        db.add(workspace)
        db.add(member)
        db.add(sub)
        await db.commit()
    except Exception:
        from services.auth.service import auth_service
        auth_service._memory_workspaces[workspace.id] = workspace
        auth_service._memory_members.append(member)

    return {
        "id": str(workspace.id),
        "name": workspace.name,
        "slug": workspace.slug,
        "plan_tier": workspace.plan_tier,
        "role": "owner"
    }


@router.get("/{workspace_id}/members")
async def list_workspace_members(
    workspace_id: uuid.UUID,
    ctx: WorkspaceContext = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db_session)
):
    """Lists team members of the workspace."""
    if ctx.workspace.id != workspace_id:
        raise HTTPException(status_code=403, detail="Workspace access forbidden.")

    stmt = (
        select(WorkspaceMember, User)
        .join(User, WorkspaceMember.user_id == User.id)
        .where(WorkspaceMember.workspace_id == workspace_id)
        .order_by(WorkspaceMember.created_at.asc())
    )
    results = (await db.execute(stmt)).all()

    return [
        {
            "id": str(m.id),
            "user_id": str(u.id),
            "email": u.email,
            "full_name": u.full_name,
            "role": m.role,
            "joined_at": m.created_at.isoformat()
        }
        for m, u in results
    ]


@router.post("/{workspace_id}/members", status_code=status.HTTP_201_CREATED)
async def add_workspace_member(
    workspace_id: uuid.UUID,
    req: AddMemberRequest,
    ctx: WorkspaceContext = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db_session)
):
    """Adds or invites a user to the workspace (Admin/Owner only)."""
    if ctx.workspace.id != workspace_id:
        raise HTTPException(status_code=403, detail="Workspace access forbidden.")
    if ctx.role not in ("owner", "admin"):
        raise HTTPException(status_code=403, detail="Only owners and admins can invite members.")

    email_clean = req.email.strip().lower()
    stmt = select(User).where(User.email == email_clean)
    target_user = await db.scalar(stmt)

    if not target_user:
        raise HTTPException(status_code=404, detail="User with this email not found.")

    # Check if already a member
    mem_stmt = select(WorkspaceMember).where(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == target_user.id
    )
    existing_mem = await db.scalar(mem_stmt)
    if existing_mem:
        raise HTTPException(status_code=409, detail="User is already a member of this workspace.")

    new_mem = WorkspaceMember(
        workspace_id=workspace_id,
        user_id=target_user.id,
        role=req.role if req.role in ("admin", "member", "viewer") else "member"
    )
    db.add(new_mem)
    await db.commit()

    return {
        "success": True,
        "member_id": str(new_mem.id),
        "user_email": target_user.email,
        "role": new_mem.role
    }
