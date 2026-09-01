# PreYT Production Runbook

This guide covers the deployment and end-to-end testing of PreYT on the production VPS (`preyt.integralgroups.in`).

## 1. Initial VPS Setup
Access your VPS via SSH and install Docker & Docker Compose:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose-v2

# Start and enable Docker
sudo systemctl enable docker
sudo systemctl start docker
```

## 2. Deploying PreYT

Clone the repository to the VPS (or deploy via CI/CD):
```bash
git clone <your-repo-url> /opt/preyt
cd /opt/preyt
```

Copy the environment template and fill in your real production secrets:
```bash
cp .env.example .env
nano .env
```
*(Ensure `GEMINI_API_KEY` and `DATAFORSEO_LOGIN`/`PASSWORD` are accurately provided)*

Boot the infrastructure:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Initialize the Database Schema:
```bash
# Run Alembic migrations inside the API container
docker exec -it preyt-api alembic upgrade head
```

## 3. End-to-End Production Verification

Now that the system is live on `https://preyt.integralgroups.in`, perform the exact verification sequence:

### Step A: Authentication & Workspace
1. **Signup:** Create a new user account. Verify that PostgreSQL creates the User and Workspace records.
2. **Login:** Authenticate and ensure the session is actively tracking via cookies.

### Step B: The Creator Radar (Phase 7.5)
1. Navigate to **Radar** (`/dashboard`).
2. Verify the live trends populate based on DataForSEO metrics.
3. Check the "Measured" timestamp pill to ensure freshness data flows properly from the backend.
4. Ensure the topic classification strictly adheres to: `BREAKING`, `OPPORTUNITY`, `SATURATING`, `RISING`, `TRENDING`, `COOLING`, or `STABLE`.

### Step C: Idea Intelligence (Phase 8)
1. Select a topic from the Radar (e.g., "AI Agents").
2. The browser will route to `/dashboard/ideas?topic=ai-agents`.
3. Click **Generate Buildable Angles**.
4. Verify Gemini returns 3-5 distinct, data-backed ideas without hallucinating metrics.
5. Verify that ideas save into PostgreSQL (`ideas` table).

### Step D: The Handoff
1. Click **Analyze Package** on one of the generated ideas.
2. The browser routes to `/dashboard/analyze?title=...&topic=...`.
3. Ensure the Title and Topic fields are automatically pre-filled.

### Step E: Package Analysis & Telemetry
1. Upload a Thumbnail variant for the selected idea.
2. Run the Analysis.
3. Navigate to **History** (`/dashboard/history` or similar) to ensure the analysis result saved persistently.
4. Verify your Token Usage is incremented in PostgreSQL (`usage_events`).

### Step F: Clean Exit
1. Logout of the application.
2. Log back in to confirm session state resumes cleanly.

---
**Deployment Success Criteria:**
If steps A-F complete without synthetic data fallbacks, without mock DB saves, and without Supabase interventions, the platform is officially Production-Ready.
