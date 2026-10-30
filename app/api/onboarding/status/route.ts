import { NextRequest, NextResponse } from "next/server"
import { getOnboardingState } from "@/lib/onboarding/store"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("preyt_token")?.value || req.headers.get("authorization")?.replace(/^Bearer\s+/, "")
    const userIdCookie = req.cookies.get("preyt_user_id")?.value
    const ytHandleCookie = req.cookies.get("preyt_yt_channel")?.value

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const userId = userIdCookie || token.split("_")[2] || "usr_default"
    const state = getOnboardingState(userId)

    // Check if channel is already stored in cookie or session
    if (!state.youtubeConnected && ytHandleCookie) {
      state.youtubeConnected = true
      state.channelSelected = true
      if (!state.connectedChannel) {
        state.connectedChannel = {
          id: "yt_" + decodeURIComponent(ytHandleCookie).replace(/[^a-zA-Z0-9]/g, ""),
          title: decodeURIComponent(ytHandleCookie),
          handle: decodeURIComponent(ytHandleCookie).startsWith("@") ? decodeURIComponent(ytHandleCookie) : `@${decodeURIComponent(ytHandleCookie)}`,
          avatarUrl: "",
          subscriberCount: 0,
          videoCount: 0,
          totalViews: 0
        }
      }
    }

    return NextResponse.json({
      authenticated: true,
      onboarding: state
    })
  } catch (error: any) {
    console.error("[Onboarding Status Error]", error)
    return NextResponse.json({ error: "Failed to retrieve onboarding status" }, { status: 500 })
  }
}
