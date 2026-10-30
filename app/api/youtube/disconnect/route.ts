import { NextRequest, NextResponse } from "next/server"
import { updateOnboardingState } from "@/lib/onboarding/store"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("preyt_token")?.value
    const userId = req.cookies.get("preyt_user_id")?.value || (token ? token.split("_")[2] : null)

    if (userId) {
      updateOnboardingState(userId, {
        youtubeConnected: false,
        channelSelected: false,
        connectedChannel: null
      })
    }

    const res = NextResponse.json({ success: true, message: "Channel disconnected successfully." })

    // Clear cookie
    res.cookies.set("preyt_yt_channel", "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0)
    })

    return res
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to disconnect channel." }, { status: 500 })
  }
}
