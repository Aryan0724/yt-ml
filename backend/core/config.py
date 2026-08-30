"""
backend/core/config.py

Centralized configuration and environment settings for the PreYT SaaS platform.
Strictly enforces secrets hygiene:
- Credentials loaded from environment or .env.local
- No secrets committed to source control
- Sensitive fields masked in logs and representation
"""

import os
from typing import Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env.local", ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # --- Application Environment ---
    ENVIRONMENT: str = Field(default="development")
    PORT: int = Field(default=8000)
    FRONTEND_URL: str = Field(default="http://localhost:3000")

    # --- PostgreSQL Database ---
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://preyt:preyt_dev_password@localhost:5432/preyt",
        description="Async PostgreSQL connection URL"
    )
    DATABASE_SYNC_URL: Optional[str] = Field(
        default=None,
        description="Sync PostgreSQL connection URL for Alembic migrations"
    )
    DATABASE_POOL_SIZE: int = Field(default=20)
    DATABASE_MAX_OVERFLOW: int = Field(default=10)

    # --- Redis Cache & Rate Limiting ---
    REDIS_URL: str = Field(default="redis://localhost:6379/0")

    # --- Authentication & Session Security ---
    JWT_SECRET_KEY: str = Field(default="preyt_dev_insecure_jwt_secret_must_change_in_production_32b")
    JWT_ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=14)

    # --- Storage Subsystem ---
    STORAGE_BACKEND: str = Field(default="local")
    STORAGE_LOCAL_DIR: str = Field(default="./storage/thumbnails")

    # --- External AI & Trend Providers ---
    GEMINI_API_KEY: Optional[str] = Field(default=None)
    GEMINI_MODEL: str = Field(default="gemini-3.5-flash-lite")
    DATAFORSEO_LOGIN: Optional[str] = Field(default=None)
    DATAFORSEO_PASSWORD: Optional[str] = Field(default=None)
    DATAFORSEO_TIMEOUT: float = Field(default=15.0)
    DEFAULT_TOPIC_REGION: str = Field(default="IN")

    @field_validator("DATABASE_SYNC_URL", mode="before")
    @classmethod
    def assemble_sync_db_url(cls, v: Optional[str], info) -> str:
        if v:
            return v
        async_url = info.data.get("DATABASE_URL", "")
        if "postgresql+asyncpg://" in async_url:
            return async_url.replace("postgresql+asyncpg://", "postgresql+psycopg2://")
        return async_url

    def validate_production_secrets(self) -> None:
        """Enforces strong security constraints when running in production."""
        if self.ENVIRONMENT.lower() == "production":
            if "dev" in self.JWT_SECRET_KEY or len(self.JWT_SECRET_KEY) < 32:
                raise ValueError("Insecure JWT_SECRET_KEY detected in production. Must be at least 32 random characters.")
            if not self.GEMINI_API_KEY:
                raise ValueError("GEMINI_API_KEY is required in production.")
            if "localhost" in self.DATABASE_URL:
                raise ValueError("DATABASE_URL points to localhost in production.")

    def __repr__(self) -> str:
        """Masks sensitive credentials to prevent leaks in logs."""
        return f"<Settings env={self.ENVIRONMENT} db_configured={bool(self.DATABASE_URL)} redis_configured={bool(self.REDIS_URL)}>"


settings = Settings()
