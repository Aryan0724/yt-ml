import { NextRequest, NextResponse } from "next/server"
import { getBackendBaseUrl, getBackendHeaders } from "@/lib/backend-config"

export async function GET(req: NextRequest) {
  try {
    const backendUrl = getBackendBaseUrl()
    const { searchParams } = new URL(req.url)
    const region = searchParams.get("region") || "IN"

    const res = await fetch(`${backendUrl}/radar/summary?region=${encodeURIComponent(region)}`, {
      cache: "no-store",
      headers: getBackendHeaders()
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
