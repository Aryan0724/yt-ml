import { NextResponse } from "next/server"
import { getLocalApplicants } from "@/lib/local-db"
import { resolveBetaAuth, normalizeAuthEmail, normalizeAuthToken } from "@/lib/beta-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email") || ""
    const token = searchParams.get("token") || ""

    const allApps = getLocalApplicants()
    const latestUsers = allApps.slice(0, 20).map(u => ({
      id: u.id,
      full_name: u.full_name,
      email: u.email,
      status: u.status,
      beta_access_token: u.beta_access_token,
      approved_at: u.approved_at,
      created_at: u.applied_at,
      daily_usage_limit: u.daily_usage_limit || 3,
      usage_remaining: u.usage_remaining || 3,
    }))

    const normalizedEmail = normalizeAuthEmail(email)
    const normalizedToken = normalizeAuthToken(token)
    const probe =
      normalizedEmail && normalizedToken
        ? await resolveBetaAuth(normalizedEmail, normalizedToken)
        : null

    return NextResponse.json({
      success: true,
      latestUsers,
      dbError: null,
      probe,
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Debug auth lookup failed." },
      { status: 500 }
    )
  }
}
