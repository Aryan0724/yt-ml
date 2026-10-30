/**
 * app/api/admin/health/route.ts
 * Proxy for FastAPI /admin/system-health endpoint.
 */
import { NextResponse } from "next/server"
import { getBackendBaseUrl, getBackendHeaders } from "@/lib/backend-config"

export async function GET() {
  try {
    const backendUrl = getBackendBaseUrl()
    const res = await fetch(`${backendUrl}/admin/system-health`, {
      headers: getBackendHeaders({ Accept: "application/json" }),
      next: { revalidate: 30 }
    })
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch health from backend" }, { status: res.status })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: "Backend unreachable", detail: err.message }, { status: 502 })
  }
}
