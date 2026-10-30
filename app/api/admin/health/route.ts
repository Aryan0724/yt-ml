/**
 * app/api/admin/health/route.ts
 * Proxy for FastAPI /admin/system-health endpoint.
 */
import { NextResponse } from "next/server"
import { getBackendBaseUrl, getBackendHeaders } from "@/lib/backend-config"

export async function GET() {
  const backendUrl = getBackendBaseUrl()
  try {
    const res = await fetch(`${backendUrl}/admin/system-health`, {
      headers: getBackendHeaders({ Accept: "application/json" }),
      cache: "no-store"
    })
    if (!res.ok) {
      return NextResponse.json({
        error: "Failed to fetch health from backend",
        status: res.status,
        attemptedUrl: `${backendUrl}/admin/system-health`
      }, { status: res.status })
    }
    const data = await res.json()
    return NextResponse.json({ ...data, source: backendUrl })
  } catch (err: any) {
    return NextResponse.json({
      error: "Backend unreachable",
      detail: err?.message || String(err),
      attemptedUrl: `${backendUrl}/admin/system-health`
    }, { status: 502 })
  }
}
