import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const response = await fetch(`${BACKEND_URL}/workspaces`, {
      method: "GET",
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {})
      }
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
    const authHeader = req.headers.get("authorization")
    const body = await req.json()
    const response = await fetch(`${BACKEND_URL}/workspaces`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {})
      },
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
