"""
backend/db/session.py

Database session management and connection pooling supporting both PostgreSQL (asyncpg)
and local zero-cost SQLite (aiosqlite) with automated schema compilation.
"""

import os
from typing import AsyncGenerator
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from core.config import settings

# Teach SQLite dialect how to handle PostgreSQL JSONB and UUID types for 100% local operation
@compiles(JSONB, "sqlite")
def compile_jsonb_sqlite(type_, compiler, **kw):
    return "JSON"

@compiles(UUID, "sqlite")
def compile_uuid_sqlite(type_, compiler, **kw):
    return "CHAR(36)"

# Ensure storage directory exists if using local sqlite file
if "sqlite" in settings.DATABASE_URL:
    db_path = settings.DATABASE_URL.replace("sqlite+aiosqlite:///", "").replace("sqlite:///", "")
    if db_path and not db_path.startswith(":memory:"):
        db_dir = os.path.dirname(os.path.abspath(db_path))
        if db_dir:
            os.makedirs(db_dir, exist_ok=True)

# Build engine configuration based on dialect
is_sqlite = "sqlite" in settings.DATABASE_URL
engine_kwargs = {"echo": False}

if not is_sqlite:
    engine_kwargs.update({
        "pool_size": settings.DATABASE_POOL_SIZE,
        "max_overflow": settings.DATABASE_MAX_OVERFLOW,
        "pool_pre_ping": True,
        "connect_args": {"timeout": 1.0}
    })
else:
    engine_kwargs.update({
        "connect_args": {"check_same_thread": False}
    })

# Async engine for the FastAPI application
async_engine = create_async_engine(settings.DATABASE_URL, **engine_kwargs)
engine = async_engine  # Alias for backward compatibility

# Async session factory
async_session_factory = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def init_db():
    """Create all tables on application startup if using local sqlite."""
    from db.base import Base
    import db.models  # Ensure all models are registered
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency yielding an isolated transactional AsyncSession per request.
    Rolls back automatically on exception.
    """
    async with async_session_factory() as session:
        try:
            yield session
            try:
                await session.commit()
            except Exception:
                pass
        except Exception:
            try:
                await session.rollback()
            except Exception:
                pass
            raise
        finally:
            try:
                await session.close()
            except Exception:
                pass

# Compatibility alias
get_db = get_db_session
