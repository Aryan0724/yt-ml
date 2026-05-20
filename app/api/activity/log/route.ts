import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getLocalApplicants, addOrUpdateLocalApplicant } from "@/lib/local-db"

export async function POST(req: Request) {
  try {
    const { email, token, eventType, metadata } = await req.json()

    if (!email || !eventType) {
      return NextResponse.json({ error: "Missing email or eventType." }, { status: 400 })
    }

    // 1. Resolve user by email from local fallback first or Supabase
    let user: any = null
    const localApps = getLocalApplicants()
    const foundLocal = localApps.find((a) => a.email.toLowerCase() === email.toLowerCase())

    if (foundLocal) {
      user = foundLocal
    } else {
      try {
        const { data, error: userError } = await supabaseServer
          .from("waitlist_users")
          .select("*")
          .eq("email", email.toLowerCase())
          .single()
        
        if (data) user = data
      } catch (err: any) {
        console.warn("Supabase fetch failed during activity log, searching local registry:", err.message)
      }
    }

    if (!user) {
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

    // 4. Try log event in usage_logs table (Optional telemetry)
    try {
      await supabaseServer.from("usage_logs").insert([
        {
          user_id: user.id,
          event_type: eventType,
          timestamp: new Date().toISOString(),
          metadata: metadata || {},
        },
      ])

      // 4.1 Also write to activity_feed if it is a relevant creator action
      if (eventType === "thumbnail_analysis" || eventType === "comparison_analysis") {
        const actionMap: Record<string, string> = {
          thumbnail_analysis: "analyzed_thumbnails",
          comparison_analysis: "compared_titles"
        }
        
        await supabaseServer.from("activity_feed").insert([
          {
            user_id: user.id,
            channel_id: user.youtube_channel ? user.youtube_channel.replace("https://youtube.com/", "").replace("@", "") : null,
            country: metadata?.country || "US",
            city: metadata?.city || "Austin",
            niche: user.niche || "Gaming",
            action_type: actionMap[eventType] || "analyzed_thumbnails",
            timestamp: new Date().toISOString(),
            consent_public_showcase: metadata?.consent_public_showcase || false,
            allow_live_feed: metadata?.allow_live_feed !== undefined ? metadata.allow_live_feed : true
          }
        ])
      }
    } catch (err: any) {
      console.warn("Usage telemetry or activity feed insert failed during logging:", err.message)
    }

    // 5. Aggregate active indicators in local JSON DB fallback & Supabase
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
      // 5.1 Update in local fallback DB
      addOrUpdateLocalApplicant({
        id: user.id,
        email: user.email,
        ...updates
      })

      // 5.2 Attempt update in Supabase
      try {
        await supabaseServer
          .from("waitlist_users")
          .update(updates)
          .eq("id", user.id)
      } catch (err: any) {
        console.warn("Supabase stats increment update failed:", err.message)
      }
    }

    return NextResponse.json({ success: true, status: user.status, betaToken: user.beta_access_token })
  } catch (err: any) {
    console.error("Activity Telemetry API Error:", err)
    return NextResponse.json({ error: err.message || "Telemetry tracking failed." }, { status: 500 })
  }
}
