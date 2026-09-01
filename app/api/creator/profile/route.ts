import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 })
    }

    const response = await fetch(`${BACKEND_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "User-Agent": req.headers.get("user-agent") || "preyt-frontend",
      }
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errData.detail || "Unauthorized" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ success: true, profile: data })
  } catch (err: any) {
    console.error("Creator Profile Fetch Error:", err)
    return NextResponse.json({ error: "Failed to fetch creator session profile." }, { status: 500 })
  }
}
