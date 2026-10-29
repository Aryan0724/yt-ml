/**
 * app/api/creator/outlier/route.ts
 * 
 * Next.js proxy for niche outlier intelligence endpoint.
 */
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const niche = searchParams.get("niche")
  const limit = searchParams.get("limit") || "10"
  const minRatio = searchParams.get("min_ratio") || "3.0"

  if (!niche) {
    return NextResponse.json({ error: "niche parameter required" }, { status: 400 })
  }

  try {
    const url = `${BACKEND_URL}/outlier/niche?niche=${encodeURIComponent(niche)}&limit=${limit}&min_ratio=${minRatio}`
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 21600 } // 6h cache
    })
    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error("[outlier/route.ts] Backend error:", err)
    return NextResponse.json({ error: "Failed to fetch outlier data" }, { status: 502 })
  }
}
