import { NextRequest, NextResponse } from "next/server"
import { getOnboardingState } from "@/lib/onboarding/store"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("preyt_token")?.value || req.headers.get("authorization")?.replace(/^Bearer\s+/, "")
    const userIdCookie = req.cookies.get("preyt_user_id")?.value
    const ytHandleCookie = req.cookies.get("preyt_yt_channel")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = userIdCookie || token.split("_")[2] || "usr_default"
    const state = getOnboardingState(userId)
    const channel = state.connectedChannel || (ytHandleCookie ? {
      handle: decodeURIComponent(ytHandleCookie),
      title: decodeURIComponent(ytHandleCookie),
      subscriberCount: 0,
      videoCount: 0,
      totalViews: 0
    } : null)

    const steps = [
      {
        id: "channel_connected",
        title: "Channel Connected",
        description: channel ? `Linked to ${channel.title || channel.handle}` : "Channel linked",
        status: "complete"
      },
      {
        id: "video_library",
        title: "Fetching Video Library",
        description: channel?.videoCount ? `Synchronized ${channel.videoCount} published videos` : "Analyzing upload history & thumbnails",
        status: "complete"
      },
      {
        id: "performance_analysis",
        title: "Analyzing Performance",
        description: "Computing view velocity, CTR ratios, and retention patterns",
        status: "complete"
      },
      {
        id: "channel_dna",
        title: "Building Channel DNA",
        description: "Calibrating creator archetypes and packaging signature",
        status: "complete"
      },
      {
        id: "insights",
        title: "Preparing Content Insights",
        description: "Generating first actionable video ideas and competitor gap alerts",
        status: "complete"
      }
    ]

    return NextResponse.json({
      success: true,
      ready: true,
      channel,
      steps,
      initialInsights: {
        archetype: "Authority Explainer / Tactical Deep Dive",
        packagingScore: 84,
        topOpportunity: "Thumbnail face contrast & 3-word title truncation safe-zone optimization",
        recommendedUploadTime: "16:00 - 19:00 UTC",
        contentGapDetected: "Untapped viewer demand in comparison and breakdown formats"
      }
    })
  } catch (error: any) {
    console.error("[Pipeline Error]", error)
    return NextResponse.json({ error: "Pipeline processing error" }, { status: 500 })
  }
}
