"""
backend/main.py

PreYT SaaS Core FastAPI Application.
Coordinates modular domain routers:
- Authentication & Identity (/auth)
- Multi-tenant Workspaces (/workspaces)
- Channel Projects (/projects)
- Package Analysis (/analyze)
- Creator Radar (/radar)
- Idea Intelligence (/ideas)
- Closed-Loop Admin & Model Telemetry (/admin)
- Platform Health & Diagnostics (/health)
"""

import os
from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from routers.auth import router as auth_router
from routers.workspaces import router as workspaces_router
from routers.projects import router as projects_router
from routers.analyze import router as analyze_router
from routers.health import router as health_router
from routers.radar import router as radar_router
from routers.waitlist import router as waitlist_router
from routers.ideas import router as ideas_router
from routers.admin import router as admin_router
from routers.outlier import router as outlier_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup validation of production secrets
    settings.validate_production_secrets()
    # Initialize database tables locally if using SQLite
    from db.session import init_db
    try:
        await init_db()
        print("[PreYT Database] Local DB initialized successfully.")
    except Exception as e:
        print(f"[PreYT Database] Local DB initialization note: {e}")
    yield
    # Graceful shutdown handling


app = FastAPI(
    title="PreYT SaaS Core API",
    description="Pre-Publish Creator Decision Intelligence Platform",
    version="6.0.0",
    lifespan=lifespan
)

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register domain routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(workspaces_router)
app.include_router(projects_router)
app.include_router(analyze_router)
app.include_router(radar_router)
app.include_router(waitlist_router)
app.include_router(ideas_router)
app.include_router(admin_router)
app.include_router(outlier_router)

@app.get("/")
async def root():
    return {"status": "ok", "service": "PreYT Creator Intelligence Engine", "version": "6.0.0"}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", settings.PORT))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
