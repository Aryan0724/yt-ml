import { NextRequest, NextResponse } from "next/server"
import { getOnboardingState, updateOnboardingState } from "@/lib/onboarding/store"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("preyt_token")?.value || req.headers.get("authorization")?.replace(/^Bearer\s+/, "")
    const userIdCookie = req.cookies.get("preyt_user_id")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = userIdCookie || token.split("_")[2] || "usr_default"
    const body = await req.json()
    const { creatorCategory, primaryGoal, publishingFrequency } = body

    const updated = updateOnboardingState(userId, {
      personalizationCompleted: true,
      completedAt: new Date().toISOString(),
      preferences: {
        creatorCategory: creatorCategory || "Technology",
        primaryGoal: primaryGoal || "Improve CTR",
        publishingFrequency: publishingFrequency || "Weekly"
      }
    })

    return NextResponse.json({
      success: true,
      onboarding: updated
    })
  } catch (error: any) {
    console.error("[Preferences Error]", error)
    return NextResponse.json({ error: "Failed to save personalization preferences" }, { status: 500 })
  }
}
