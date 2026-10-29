/**
 * app/api/admin/metrics/route.ts
 * Proxy for FastAPI /admin/calibration-metrics endpoint.
 */
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.PYTHON_BACKEND_URL || "http://localhost:8000"

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/admin/calibration-metrics`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 }
    })
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch metrics from backend" }, { status: res.status })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: "Backend unreachable", detail: err.message }, { status: 502 })
  }
}
