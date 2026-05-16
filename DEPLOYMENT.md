# Diamond Intelligence | Deployment Guide (Free Tier)

This platform is architected to run entirely on free-tier infrastructure. Follow these steps to deploy your production system without costs.

## 1. Frontend: Next.js (Vercel)
Vercel is the recommended platform for Next.js.
- **Provider:** [Vercel](https://vercel.com/)
- **Cost:** $0 (Hobby Tier)
- **Steps:**
  1. Connect your GitHub repository (`yt-ml`).
  2. Vercel will automatically detect the Next.js app.
  3. Add your custom domain in the project settings. Vercel provides free SSL certificates.

## 2. Backend: Python API (Render)
Render offers a reliable free tier for web services.
- **Provider:** [Render](https://render.com/)
- **Cost:** $0 (Free Tier)
- **Steps:**
  1. Create a "New Web Service" on Render.
  2. Connect the same GitHub repo.
  3. Set the **Root Directory** to `backend/`.
  4. Render will automatically detect the **Dockerfile**.
  5. Select the "Free" instance type.
  - *Note: Docker-based deployment is more stable and ensures all your ML dependencies (CatBoost, etc.) are installed correctly.*
  - *Note: Free tier instances spin down after 15 mins of inactivity. Use a free cron service like [Cron-job.org](https://cron-job.org/) to ping your API every 10 mins if you want it "always on."*

## 3. Database: Performance Vault (Supabase)
If you scale beyond the CSV-based vault, use Supabase for Postgres.
- **Provider:** [Supabase](https://supabase.com/)
- **Cost:** $0 (Free Tier)
- **Steps:**
  1. Create a new project.
  2. Use the provided Connection String in your `config.py`.

## 4. Custom Domain
- **Steps:**
  1. Point your A/CNAME records to Vercel for the frontend.
  2. (Optional) Create a subdomain `api.yourdomain.com` and point it to Render.

## Summary of Tech Stack (Zero Cost)
- **Code:** GitHub
- **Hosting (Web):** Vercel
- **Hosting (API):** Render
- **SSL:** Included (Free)
- **CI/CD:** Automated via GitHub push
