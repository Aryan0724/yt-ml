import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getLocalApplicants, addOrUpdateLocalApplicant } from "@/lib/local-db"
import { resolveBetaAuth, normalizeAuthEmail, normalizeAuthToken } from "@/lib/beta-auth"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { email, token, eventType, metadata } = await req.json()

    if (!email || !eventType) {
      return NextResponse.json({ error: "Missing email or eventType." }, { status: 400 })
    }

    const normalizedEmail = normalizeAuthEmail(email)
    const normalizedToken = normalizeAuthToken(token)
    console.log("[activity/log] auth lookup", {
      email,
      normalizedEmail,
      tokenPrefix: normalizedToken ? `${normalizedToken.slice(0, 8)}...` : "",
      eventType,
    })

    const authResult = await resolveBetaAuth(normalizedEmail, normalizedToken)
    console.log("[activity/log] auth lookup result", authResult.debug)

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
          .from("beta_waitlist")
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
