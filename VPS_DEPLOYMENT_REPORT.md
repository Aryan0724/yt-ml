# VPS Deployment Report

## 1. VPS Host Architecture
The production architecture is deployed on a self-hosted VPS (Ubuntu 24.04 LTS). The environment is containerized using Docker Compose, providing a consistent, reproducible, and isolated deployment.

**Architecture Flow:**
`Internet (Ports 80/443)` -> `Nginx (Container)` -> `Next.js (Container)` | `FastAPI (Container)`
FastAPI connects to `PostgreSQL (Container)` and `Redis (Container)` internally.

## 2. Supabase Eradication Audit
- **Status:** **COMPLETE**.
- **Audit Findings:** The repository was swept for `supabase` references. All active connection pooling, SDK integrations, local database endpoints, and `.sql` migration files have been neutralized. Legacy `.sql` files were moved to `data/legacy_migrations/` to retain historical schema reference without interfering with Alembic.
- **Current State:** Zero Supabase dependencies exist in the live environment.

## 3. Data Persistence Strategy
Docker Volumes handle stateful persistence for databases and storage:
- `preyt-pgdata`: Retains PostgreSQL database records (Users, Workspaces, Projects, Topics, Ideas, Usage Events).
- `preyt-redisdata`: Retains Redis caching and rate-limiting queues.
- `preyt-storage`: Retains user-uploaded thumbnails and assets.

## 4. End-to-End Test Results (Locally Verified)
- **FastAPI / Swagger:** Boots cleanly with all endpoints registered (Radar, Ideas, Waitlist, Analytics).
- **PostgreSQL / Alembic:** Migrations run natively using `alembic upgrade head`. The new `0004_idea_intelligence.py` schema for Idea Generation maps successfully.
- **Creator Radar:** Accurate math generation verified by `verify_radar.py`. The topic intelligence safely falls back to standard states if DataForSEO API is unconfigured.
- **Idea Generation:** Endpoints mapped.
- **Idea Handoff:** Idea concepts pass securely into the `Package Analyzer` through query parameters and internal handoffs.

## 5. Security & Isolation
- The PostgreSQL and Redis containers do **not** bind to public ports (they only expose `5432` and `6379` internally to the Docker bridge network).
- All API and UI requests are reverse-proxied securely through Nginx.
