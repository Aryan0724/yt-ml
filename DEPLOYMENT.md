# Diamond Intelligence | Deployment Guide (VPS)

This platform is architected to run entirely on a self-hosted Virtual Private Server (VPS) alongside Vercel for the frontend, ensuring full data ownership and avoiding BaaS lock-in.

## Architecture Overview

```text
                    INTERNET
                       │
                       ▼
                Cloudflare / HTTPS
                       │
                       ▼
                 ┌───────────┐
                 │  Next.js  │
                 │ Frontend  │ (Vercel)
                 └─────┬─────┘
                       │
                       ▼
                 ┌───────────┐
                 │  FastAPI  │
                 │   API     │ (VPS Docker)
                 └─────┬─────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     PostgreSQL      Redis       File Storage
      Database       Cache        / Thumbnails
```

## 1. Frontend: Next.js (Vercel)
- **Provider:** [Vercel](https://vercel.com/)
- **Steps:**
  1. Connect your GitHub repository.
  2. Configure environment variables (e.g. `NEXT_PUBLIC_APP_URL`, `BACKEND_INTERNAL_URL`).
  3. Add your custom domain in the project settings. Vercel provides free SSL certificates.

## 2. Backend: FastAPI + Postgres + Redis (VPS)
We use a Docker Compose architecture to run the intelligence pipeline.

### Prerequisites
- A VPS running Ubuntu 22.04+
- Docker and Docker Compose installed

### Steps:
1. Clone the repository to your VPS.
2. Navigate to the `backend/` directory.
3. Create a `.env.local` file with your credentials (JWT Secrets, Database Passwords, Gemini API Keys, DataForSEO keys).
4. Build and start the services:
```bash
docker-compose up -d --build
```
5. Apply database migrations:
```bash
docker-compose exec api alembic upgrade head
```

### Services Deployed
- **api**: FastAPI running on port `8000`.
- **postgres**: PostgreSQL 16 database for user auth, waitlist, workspaces, and analytics.
- **redis**: Redis 7 cache for rate limiting, session caching, and background queues.

## 3. Custom Domain & Reverse Proxy
- Use Cloudflare to point a subdomain (e.g., `api.preyt.com`) to your VPS IP.
- Configure Nginx or Caddy on your VPS to reverse proxy traffic from port 80/443 to the FastAPI container on port 8000.

## Summary of Tech Stack
- **Frontend Code:** Next.js (Vercel)
- **Backend API:** FastAPI (Docker)
- **Database:** PostgreSQL (Docker)
- **Cache:** Redis (Docker)
- **AI/ML:** Gemini + OpenCV (Python Backend)
