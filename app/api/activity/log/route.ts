import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const { email, token, eventType, metadata } = await req.json()

    if (!email || !eventType) {
      return NextResponse.json({ error: "Missing email or eventType." }, { status: 400 })
    }

    // 1. Resolve user by email first to check their status
    const { data: user, error: userError } = await supabaseServer
      .from("waitlist_users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "No waitlist application found with this email.", status: "not_found" }, { status: 401 })
    }

    // 2. Enforce Status triages
    if (user.status === "pending") {
      return NextResponse.json({ error: "Application is still under review.", status: "pending" }, { status: 403 })
    }

    if (user.status === "rejected" || user.status === "suspended") {
      return NextResponse.json({ error: "Access pass is suspended or expired.", status: user.status }, { status: 403 })
    }

    // 3. If token is supplied, validate it
    if (token && user.beta_access_token !== token) {
      return NextResponse.json({ error: "Invalid beta access pass token.", status: "unauthorized" }, { status: 401 })
    }

    // 4. Log event in usage_logs
    const { error: logError } = await supabaseServer.from("usage_logs").insert([
      {
        user_id: user.id,
        event_type: eventType,
        timestamp: new Date().toISOString(),
        metadata: metadata || {},
      },
    ])

    if (logError) {
      console.error("Telemetry insert error:", logError)
    }

    // 5. Aggregate active indicators in waitlist_users
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
      const { error: updateError } = await supabaseServer
        .from("waitlist_users")
        .update(updates)
        .eq("id", user.id)

      if (updateError) {
        console.error("Stats increment failed:", updateError)
      }
    }

    return NextResponse.json({ success: true, status: user.status, betaToken: user.beta_access_token })
  } catch (err: any) {
    console.error("Activity Telemetry API Error:", err)
    return NextResponse.json({ error: err.message || "Telemetry tracking failed." }, { status: 500 })
  }
}
