import { NextResponse } from "next/server"
import { getLocalApplicants, saveLocalApplicants } from "@/lib/local-db"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: "Missing userId." }, { status: 400 })

    const localApps = getLocalApplicants()
    const idx = localApps.findIndex((a) => a.id === userId || a.email.toLowerCase() === String(userId).toLowerCase())

    if (idx === -1) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    const user = localApps[idx]

    if (user.status !== "approved") {
      return NextResponse.json({ error: "User is not an approved beta member." }, { status: 403 })
    }

    const remaining = user.usage_remaining ?? user.daily_usage_limit ?? 3
    if (remaining <= 0) {
      return NextResponse.json(
        { error: "Daily scan limit reached. Resets at midnight UTC.", remaining: 0 },
        { status: 429 }
      )
    }

    user.usage_remaining = remaining - 1
    user.total_analyses = (user.total_analyses || 0) + 1
    user.last_analysis_at = new Date().toISOString()
    localApps[idx] = user
    saveLocalApplicants(localApps)

    return NextResponse.json({
      success: true,
      remaining: user.usage_remaining,
      limit: user.daily_usage_limit || 3,
      totalScans: user.total_analyses,
    })
  } catch (err: any) {
    console.error("Usage Track Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
