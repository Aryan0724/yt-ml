/**
 * app/api/admin/health/route.ts
 * Proxy for FastAPI /admin/system-health endpoint.
 */
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.PYTHON_BACKEND_URL || "http://localhost:8000"

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/admin/system-health`, {
      headers: { Accept: "application/json" },
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
