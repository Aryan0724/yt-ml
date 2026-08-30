import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const region = searchParams.get("region") || "IN"

    const res = await fetch(`${BACKEND_URL}/radar/summary?region=${encodeURIComponent(region)}`, {
      cache: "no-store"
    })
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch summary" }, { status: res.status })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to reach radar service" },
      { status: 502 }
    )
  }
}
