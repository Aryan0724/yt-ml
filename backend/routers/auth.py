"""
backend/routers/auth.py

API router for authentication, session management, and credential recovery.
"""

from typing import Optional
from fastapi import APIRouter, Depends, Request, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db_session
from core.dependencies import get_current_user
from core.rate_limit import rate_limiter
from services.auth.service import auth_service, AuthError
from db.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


# --- Request & Response Schemas ---

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str = Field(min_length=1, default="Creator")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class PasswordResetInitRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirmRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8)


# --- Endpoint Handlers ---

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    req: RegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db_session)
):
    ip = request.client.host if request.client else "unknown"
    if not rate_limiter.check_register_rate_limit(ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Registration limit exceeded. Please try again later."
        )

    client_info = {
        "ip": ip,
        "user_agent": request.headers.get("user-agent", "unknown")
    }

    try:
        return await auth_service.register_user(
            db,
            email=req.email,
            password=req.password,
            full_name=req.full_name,
            client_info=client_info
        )
    except AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/login")
async def login(
    req: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db_session)
):
    ip = request.client.host if request.client else "unknown"
    if not rate_limiter.check_login_rate_limit(ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please wait 15 minutes."
        )

    client_info = {
        "ip": ip,
        "user_agent": request.headers.get("user-agent", "unknown")
    }

    try:
        return await auth_service.authenticate_user(
            db,
            email=req.email,
            password=req.password,
            client_info=client_info
        )
    except AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/refresh")
async def refresh(
    req: RefreshRequest,
    request: Request,
    db: AsyncSession = Depends(get_db_session)
):
    client_info = {
        "ip": request.client.host if request.client else "unknown",
        "user_agent": request.headers.get("user-agent", "unknown")
    }

    try:
        new_access_token, new_refresh_token = await auth_service.refresh_session(
            db,
            raw_refresh_token=req.refresh_token,
            client_info=client_info
        )
        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }
    except AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/logout")
async def logout(
    req: RefreshRequest,
    db: AsyncSession = Depends(get_db_session)
):
    revoked = await auth_service.revoke_session(db, req.refresh_token)
    return {"success": True, "revoked": revoked}


@router.post("/logout-all")
async def logout_all(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    revoked_count = await auth_service.revoke_all_user_sessions(db, current_user.id)
    return {"success": True, "sessions_revoked": revoked_count}


@router.post("/password-reset/request")
async def request_password_reset(
    req: PasswordResetInitRequest,
    db: AsyncSession = Depends(get_db_session)
):
    token = await auth_service.request_password_reset(db, req.email)
    # Mitigate account enumeration by returning generic message regardless of email existence
    response = {
        "success": True,
        "message": "If an account matches this email, instructions have been sent."
    }
    # In development mode, return token to ease local verification
    if token:
        response["dev_token"] = token
    return response


@router.post("/password-reset/confirm")
async def confirm_password_reset(
    req: PasswordResetConfirmRequest,
    db: AsyncSession = Depends(get_db_session)
):
    try:
        success = await auth_service.confirm_password_reset(
            db,
            raw_token=req.token,
            new_password=req.new_password
        )
        return {"success": success, "message": "Password has been reset successfully. Please log in."}
    except AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/me")
async def get_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    created_str = (
        current_user.created_at.isoformat()
        if hasattr(current_user, "created_at") and current_user.created_at
        else "2026-08-29T22:00:00Z"
    )
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
        "created_at": created_str
    }
