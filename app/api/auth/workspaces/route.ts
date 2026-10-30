import { NextRequest, NextResponse } from "next/server"
import { getBackendBaseUrl, getBackendHeaders } from "@/lib/backend-config"

export async function GET(req: NextRequest) {
  try {
    const backendUrl = getBackendBaseUrl()
    const authHeader = req.headers.get("authorization")
    const response = await fetch(`${backendUrl}/workspaces`, {
      method: "GET",
      headers: getBackendHeaders(authHeader ? { Authorization: authHeader } : {})
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (err: any) {
    return NextResponse.json(
      { detail: err.message || "Failed to fetch workspaces" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const backendUrl = getBackendBaseUrl()
    const authHeader = req.headers.get("authorization")
    const body = await req.json()
    const response = await fetch(`${backendUrl}/workspaces`, {
      method: "POST",
      headers: getBackendHeaders({
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {})
      }),
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (err: any) {
    return NextResponse.json(
      { detail: err.message || "Failed to create workspace" },
      { status: 500 }
    )
  }
}
