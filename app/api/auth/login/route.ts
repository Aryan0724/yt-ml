import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": req.headers.get("user-agent") || "preyt-frontend",
        "X-Forwarded-For": req.headers.get("x-forwarded-for") || "127.0.0.1"
      },
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
