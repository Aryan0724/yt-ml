/**
 * Centralized resolution of PreYT Python ML & Database Engine.
 * Supports:
 * 1. Explicit environment variable overrides (BACKEND_INTERNAL_URL, PYTHON_BACKEND_URL)
 * 2. Localhost development (http://127.0.0.1:8000)
 * 3. 100% Free Production Tunnel fallback (https://preyt-ml-engine.loca.lt)
 * so live Vercel deployments can communicate directly with your local PC with $0 cloud hosting cost.
 */

export function getBackendBaseUrl(): string {
  const envUrl = process.env.BACKEND_INTERNAL_URL || process.env.PYTHON_BACKEND_URL
  const isVercel = Boolean(process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_ENV)

  // If running on Vercel and the env var points to localhost/127.0.0.1, it's impossible for Vercel cloud to reach local PC localhost directly
  if (envUrl) {
    const clean = envUrl.replace(/\/$/, "")
    const isLocalhost = clean.includes("localhost") || clean.includes("127.0.0.1") || clean.includes("0.0.0.0")
    if (!isVercel || !isLocalhost) {
      return clean
    }
  }

  // When running in production on Vercel without custom external URL, route to the live PC tunnel
  if (process.env.NODE_ENV === "production" || isVercel) {
    return "https://preyt-ml-engine.loca.lt"
  }

  return "http://127.0.0.1:8000"
}

export function getBackendCandidateUrls(): string[] {
  const primary = getBackendBaseUrl()
  const list = [
    primary,
    "https://preyt-ml-engine.loca.lt",
    "http://127.0.0.1:8000",
    "http://localhost:8000"
  ]
  return [...new Set(list)]
}

export function getBackendHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    "Bypass-Tunnel-Reminder": "true",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PreYT-Engine-Bridge/6.0",
    ...extra
  }
}
