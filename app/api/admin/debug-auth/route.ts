import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { resolveBetaAuth, normalizeAuthEmail, normalizeAuthToken } from "@/lib/beta-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email") || ""
    const token = searchParams.get("token") || ""

    const { data: latestUsers, error } = await supabaseServer
      .from("beta_waitlist")
      .select("id, full_name, email, status, beta_access_token, approved_at, created_at, daily_usage_limit, usage_remaining")
      .order("created_at", { ascending: false })
      .limit(20)

    const normalizedEmail = normalizeAuthEmail(email)
    const normalizedToken = normalizeAuthToken(token)
    const probe =
      normalizedEmail && normalizedToken
        ? await resolveBetaAuth(normalizedEmail, normalizedToken)
        : null

    return NextResponse.json({
      success: true,
      latestUsers: latestUsers || [],
      dbError: error ? { message: error.message, code: error.code } : null,
      probe,
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Debug auth lookup failed." },
      { status: 500 }
    )
  }
}
