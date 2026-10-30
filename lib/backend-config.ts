/**
 * Centralized resolution of PreYT Python ML & Database Engine.
 * Supports:
 * 1. Explicit environment variable overrides (BACKEND_INTERNAL_URL, PYTHON_BACKEND_URL)
 * 2. Localhost development (http://127.0.0.1:8000)
 * 3. 100% Free Production Tunnel fallback (https://preyt-ml-engine.loca.lt)
 * so live Vercel deployments can communicate directly with your local PC with $0 cloud hosting cost.
 */

export function getBackendBaseUrl(): string {
  if (process.env.BACKEND_INTERNAL_URL) return process.env.BACKEND_INTERNAL_URL.replace(/\/$/, "")
  if (process.env.PYTHON_BACKEND_URL) return process.env.PYTHON_BACKEND_URL.replace(/\/$/, "")

  // When running in production on Vercel without custom URL, route to the live PC tunnel
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
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
    ...extra
  }
}
