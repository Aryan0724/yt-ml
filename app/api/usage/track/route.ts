import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { userId, scanType = "thumbnail_analysis" } = await req.json()
    if (!userId) return NextResponse.json({ error: "Missing userId." }, { status: 400 })

    // Fetch current usage
    const { data: user, error: fetchError } = await supabaseServer
      .from("beta_waitlist")
      .select("usage_remaining, daily_usage_limit, total_scans_used, niche, country, status")
      .eq("id", userId)
      .single()

    if (fetchError || !user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    if (user.status !== "approved") {
      return NextResponse.json({ error: "User is not an approved beta member." }, { status: 403 })
    }

    if (user.usage_remaining <= 0) {
      return NextResponse.json(
        { error: "Daily scan limit reached. Resets at midnight UTC.", remaining: 0 },
        { status: 429 }
      )
    }

    // Decrement usage_remaining and increment total_scans_used atomically
    const { data: updated, error: updateError } = await supabaseServer
      .from("beta_waitlist")
      .update({
        usage_remaining: user.usage_remaining - 1,
        total_scans_used: user.total_scans_used + 1,
      })
      .eq("id", userId)
      .select("usage_remaining, daily_usage_limit, total_scans_used")
      .single()

    if (updateError) throw updateError

    // Log the scan usage
    await supabaseServer.from("scan_usage_logs").insert([
      {
        user_id: userId,
        scan_type: scanType,
        niche: user.niche,
        country: user.country,
      },
    ])

    return NextResponse.json({
      success: true,
      remaining: updated?.usage_remaining ?? 0,
      limit: updated?.daily_usage_limit ?? user.daily_usage_limit,
      totalScans: updated?.total_scans_used ?? user.total_scans_used + 1,
    })
  } catch (err: any) {
    console.error("Usage Track Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
