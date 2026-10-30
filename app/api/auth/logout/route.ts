import { NextRequest, NextResponse } from "next/server"
import { getBackendBaseUrl, getBackendHeaders } from "@/lib/backend-config"

export async function POST(req: NextRequest) {
  try {
    const backendUrl = getBackendBaseUrl()
    const body = await req.json()
    const response = await fetch(`${backendUrl}/auth/logout`, {
      method: "POST",
      headers: getBackendHeaders({ "Content-Type": "application/json" }),
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
