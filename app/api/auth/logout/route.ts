import { NextRequest, NextResponse } from "next/server"
import { getBackendBaseUrl, getBackendHeaders } from "@/lib/backend-config"

export const runtime = "nodejs"

function clearAllAuthCookies(response: NextResponse): void {
  const cookieNames = [
    "preyt_token",
    "preyt_yt_channel",
    "preyt_user_id",
    "preyt_session_data",
    "preyt_active_channel"
  ]

  cookieNames.forEach((name) => {
    response.cookies.set(name, "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      sameSite: "lax"
    })
  })
}

export async function POST(req: NextRequest) {
  try {
    const backendUrl = getBackendBaseUrl()
    const body = await req.json().catch(() => ({}))

    // Attempt backend session revocation without failing if offline
    try {
      if (body?.refresh_token) {
        await fetch(`${backendUrl}/auth/logout`, {
          method: "POST",
          headers: getBackendHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(3000)
        })
      }
    } catch {
      // Non-blocking best effort
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" })
    clearAllAuthCookies(response)
    return response
  } catch (err: any) {
    const response = NextResponse.json({ success: true, message: "Logged out locally" })
    clearAllAuthCookies(response)
    return response
  }
}

export async function GET(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "preyt.integralgroups.in"
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
  const baseUrl = `${proto}://${host}`

  const response = NextResponse.redirect(new URL("/login?logged_out=1", baseUrl))
  clearAllAuthCookies(response)
  return response
}
