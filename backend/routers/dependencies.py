"""
backend/routers/dependencies.py

Re-exports core dependency resolvers for routers to ensure clean imports.
"""

from core.dependencies import (
    get_current_user,
    get_current_workspace,
    WorkspaceContext,
    security_scheme
)
from db.session import get_db_session
from fastapi import Depends

async def get_current_user_workspace(
    ctx: WorkspaceContext = Depends(get_current_workspace)
) -> dict:
    """Convenience dependency returning workspace_id and user_id dictionary."""
    return {
        "workspace_id": str(ctx.workspace.id),
        "user_id": str(ctx.user.id),
        "role": ctx.role,
        "workspace": ctx.workspace,
        "user": ctx.user
    }

__all__ = [
    "get_current_user",
    "get_current_workspace",
    "get_current_user_workspace",
    "WorkspaceContext",
    "security_scheme",
    "get_db_session"
]
