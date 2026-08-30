import { NextResponse } from "next/server"
import { addOrUpdateLocalApplicant } from "@/lib/local-db"
import { resolveBetaAuth, normalizeAuthEmail, normalizeAuthToken } from "@/lib/beta-auth"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { email, token, eventType } = await req.json()

    if (!email || !eventType) {
      return NextResponse.json({ error: "Missing email or eventType." }, { status: 400 })
    }

    const normalizedEmail = normalizeAuthEmail(email)
    const normalizedToken = normalizeAuthToken(token)

    const authResult = await resolveBetaAuth(normalizedEmail, normalizedToken)

    if (!authResult.ok) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.error,
          reason: authResult.status,
          debug: authResult.debug,
        },
        { status: authResult.status === "not_found" ? 404 : authResult.status === "pending" ? 403 : 401 }
      )
    }

    const user = authResult.user
    const updates: Record<string, any> = {}
    const nowStr = new Date().toISOString()

    if (eventType === "login") {
      updates.total_logins = (user.total_logins || 0) + 1
      updates.last_login = nowStr
    } else if (eventType === "thumbnail_analysis" || eventType === "comparison_analysis") {
      updates.total_analyses = (user.total_analyses || 0) + 1
      updates.last_analysis_at = nowStr
    }

    if (Object.keys(updates).length > 0) {
      addOrUpdateLocalApplicant({
        id: user.id,
        email: user.email,
        ...updates
      })
    }

    return NextResponse.json({ success: true, status: user.status, betaToken: user.beta_access_token })
  } catch (err: any) {
    console.error("Activity Telemetry API Error:", err)
    return NextResponse.json({ error: err.message || "Telemetry tracking failed." }, { status: 500 })
  }
}
