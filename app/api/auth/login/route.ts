import { NextRequest, NextResponse } from "next/server"
import { getBackendBaseUrl, getBackendHeaders } from "@/lib/backend-config"

export async function POST(req: NextRequest) {
  try {
    const backendUrl = getBackendBaseUrl()
    const body = await req.json()
    const response = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: getBackendHeaders({
        "Content-Type": "application/json",
        "User-Agent": req.headers.get("user-agent") || "preyt-frontend",
        "X-Forwarded-For": req.headers.get("x-forwarded-for") || "127.0.0.1"
      }),
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (err: any) {
    return NextResponse.json(
      { detail: err.message || "Failed to reach PreYT auth backend" },
      { status: 500 }
    )
  }
}
