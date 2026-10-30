/**
 * Centralized resolution of PreYT Python ML & Database Engine.
 * Supports:
 * 1. 100% Free Production PC Tunnel (https://preyt-ml-engine.loca.lt)
 *    so live Vercel deployments (https://preyt.integralgroups.in) route all heavy
 *    ML workloads & database operations directly to the user's local PC hardware with $0 cloud cost.
 * 2. Local development on http://127.0.0.1:8000.
 * 3. Automatic filtering of stale/decommissioned VPS IPs (e.g. 62.72.13.149) and local addresses in cloud environments.
 */

export function getBackendBaseUrl(): string {
  const envUrl = process.env.BACKEND_INTERNAL_URL || process.env.PYTHON_BACKEND_URL
  const isVercel = Boolean(process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_ENV)

  // In production / on Vercel:
  // Route all traffic directly to the user's local PC engine via free tunnel unless explicitly overridden with a fresh external host.
  if (isVercel || process.env.NODE_ENV === "production") {
    if (envUrl) {
      const clean = envUrl.replace(/\/$/, "")
      const isStale = clean.includes("62.72.13.149") || clean.includes("localhost") || clean.includes("127.0.0.1")
      if (!isStale && clean.startsWith("http")) {
        return clean
      }
    }
    return "https://preyt-ml-engine.loca.lt"
  }

  // In local development, use localhost
  if (envUrl && !envUrl.includes("62.72.13.149")) {
    return envUrl.replace(/\/$/, "")
  }
  return "http://127.0.0.1:8000"
}

export function getBackendCandidateUrls(): string[] {
  const primary = getBackendBaseUrl()
  const isVercel = Boolean(process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_ENV)

  if (isVercel) {
    return [
      primary,
      "https://preyt-ml-engine.loca.lt"
    ].filter((u, i, self) => self.indexOf(u) === i)
  }

  return [
    primary,
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "https://preyt-ml-engine.loca.lt"
  ].filter((u, i, self) => self.indexOf(u) === i)
}

export function getBackendHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    "Bypass-Tunnel-Reminder": "true",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PreYT-Engine-Bridge/6.0",
    ...extra
  }
}
