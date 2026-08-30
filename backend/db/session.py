"""
backend/db/session.py

Database session management and connection pooling for PostgreSQL using asyncpg.
"""

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from core.config import settings

# Async engine for the FastAPI application
async_engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_pre_ping=True,
    connect_args={"timeout": 1.0},
    echo=False
)

# Async session factory
async_session_factory = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

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
