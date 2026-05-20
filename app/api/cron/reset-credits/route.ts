import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

// Vercel Cron Job — runs at midnight UTC daily
// Schedule configured in vercel.json: "0 0 * * *"
export async function GET(req: Request) {
  // Basic protection — only allow Vercel cron or manual admin calls
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET || "ap_cron_2026"
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch all approved users
    const { data: users, error: fetchError } = await supabaseServer
      .from("beta_waitlist")
      .select("id, daily_usage_limit")
      .eq("status", "approved")

    if (fetchError) throw fetchError

    if (!users || users.length === 0) {
      return NextResponse.json({ success: true, message: "No approved users to reset.", reset: 0 })
    }

    // Reset each user's usage_remaining to their daily_usage_limit
    const updates = users.map((user) =>
      supabaseServer
        .from("beta_waitlist")
        .update({ usage_remaining: user.daily_usage_limit })
        .eq("id", user.id)
    )

    await Promise.all(updates)

    console.log(`[CRON] Reset usage_remaining for ${users.length} approved beta users.`)
    return NextResponse.json({ success: true, reset: users.length })
  } catch (err: any) {
    console.error("Cron Reset Credits Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
