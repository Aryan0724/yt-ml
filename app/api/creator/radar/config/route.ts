import { NextResponse } from "next/server"
import { getBackendBaseUrl, getBackendHeaders } from "@/lib/backend-config"

export async function GET() {
  try {
    const backendUrl = getBackendBaseUrl()
    const res = await fetch(`${backendUrl}/radar/config`, {
      cache: "no-store",
      headers: getBackendHeaders()
    })
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch config" }, { status: res.status })
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
