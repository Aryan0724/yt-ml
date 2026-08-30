"""
backend/core/security.py

Cryptographic security module:
- Bcrypt password hashing (work factor 12)
- SHA-256 token hashing (no raw refresh tokens stored in database)
- JWT access token minting and signature verification
"""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import bcrypt
import jwt
from core.config import settings


def hash_password(password: str) -> str:
    """Hashes a plaintext password using bcrypt with salt rounds."""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plaintext password against its bcrypt hash in constant time."""
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


def generate_secure_token(length_bytes: int = 32) -> str:
    """Generates an opaque, cryptographically random URL-safe token."""
    return secrets.token_urlsafe(length_bytes)


def hash_token(raw_token: str) -> str:
    """Computes a SHA-256 hex digest of a token before database persistence."""
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()


def create_access_token(
    user_id: str,
    email: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Creates a signed JWT access token.
    Default validity: 30 minutes.
    """
    now = datetime.now(timezone.utc)
    delta = expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = now + delta

    payload: Dict[str, Any] = {
        "sub": str(user_id),
        "email": email.lower(),
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "jti": secrets.token_hex(8)
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodes and validates a JWT access token.
    Returns the decoded payload dict or None if invalid/expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except (jwt.PyJWTError, Exception):
        return None
