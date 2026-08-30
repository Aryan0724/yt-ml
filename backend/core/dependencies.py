"""
backend/core/dependencies.py

FastAPI dependency injection for authentication, tenancy, and request isolation.
Enforces multi-tenant authorization so users can only access their authorized workspaces.
"""

import uuid
from typing import Optional, NamedTuple
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import decode_access_token
from db.session import get_db_session
from db.models.user import User
from db.models.workspace import Workspace
from db.models.workspace_member import WorkspaceMember

security_scheme = HTTPBearer(auto_error=True)


class WorkspaceContext(NamedTuple):
    workspace: Workspace
    user: User
    role: str


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db_session)
) -> User:
    """Extracts and verifies the JWT bearer token, resolving the authenticated User."""
    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user_id = uuid.UUID(payload["sub"])
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed user identifier in token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = None
    try:
        user = await db.get(User, user_id)
    except Exception:
        from services.auth.service import auth_service
        user = auth_service._memory_users.get(user_id)

    if not user:
        from services.auth.service import auth_service
        user = auth_service._memory_users.get(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with token no longer exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )

    return user


async def get_current_workspace(
    x_workspace_id: Optional[str] = Header(None, alias="X-Workspace-Id"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
) -> WorkspaceContext:
    """
    Multi-tenant isolation resolver:
    - Resolves target workspace from X-Workspace-Id or falls back to user's first workspace.
    - Authoritatively checks workspace_members to ensure the user is an authorized tenant.
    """
    target_ws_id: Optional[uuid.UUID] = None

    if x_workspace_id:
        try:
            target_ws_id = uuid.UUID(x_workspace_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid X-Workspace-Id UUID header"
            )

    if target_ws_id:
        # Verify user belongs to requested workspace
        stmt = (
            select(Workspace, WorkspaceMember.role)
            .join(WorkspaceMember, Workspace.id == WorkspaceMember.workspace_id)
            .where(
                Workspace.id == target_ws_id,
                WorkspaceMember.user_id == current_user.id
            )
        )
    else:
        # Fall back to user's primary/first workspace
        stmt = (
            select(Workspace, WorkspaceMember.role)
            .join(WorkspaceMember, Workspace.id == WorkspaceMember.workspace_id)
            .where(WorkspaceMember.user_id == current_user.id)
            .order_by(WorkspaceMember.created_at.asc())
            .limit(1)
        )

    result = None
    try:
        result = (await db.execute(stmt)).first()
    except Exception:
        from services.auth.service import auth_service
        for m in auth_service._memory_members:
            if m.user_id == current_user.id:
                ws = auth_service._memory_workspaces.get(m.workspace_id)
                if ws and (target_ws_id is None or ws.id == target_ws_id):
                    result = (ws, m.role)
                    break

    if not result:
        from services.auth.service import auth_service
        for m in auth_service._memory_members:
            if m.user_id == current_user.id:
                ws = auth_service._memory_workspaces.get(m.workspace_id)
                if ws and (target_ws_id is None or ws.id == target_ws_id):
                    result = (ws, m.role)
                    break

    if not result:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not belong to this workspace."
        )

    workspace, role = result
    return WorkspaceContext(workspace=workspace, user=current_user, role=role)
