import { NextRequest, NextResponse } from "next/server"
import { verifyOtp } from "@/lib/auth/otp"
import crypto from "crypto"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = body?.email
    const code = body?.code

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required." },
        { status: 400 }
      )
    }

    const verification = verifyOtp(email, code)
    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error || "Invalid verification code." },
        { status: 400 }
      )
    }

    // Code is valid! Issue session for this creator
    const cleanEmail = email.toLowerCase().trim()
    const emailPrefix = cleanEmail.split("@")[0]
    const userId = `usr_${crypto.createHash("md5").update(cleanEmail).digest("hex").slice(0, 12)}`
    const fullName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)

    const sessionData = {
      access_token: `preyt_tok_${userId}_${Date.now()}`,
      refresh_token: `preyt_ref_${userId}_${Date.now()}`,
      token_type: "bearer",
      expires_in: 86400,
      user: {
        id: userId,
        email: cleanEmail,
        full_name: fullName,
        avatar_url: "",
        is_verified: true
      },
      workspace: {
        id: `ws_${userId}`,
        name: `${fullName}'s Workspace`,
        slug: `${emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, "-")}-workspace`,
        plan_tier: "pro",
        role: "owner"
      },
      onboarding: {
        authentication_completed: true,
        youtube_connected: false,
        channel_selected: false,
        personalization_completed: false,
        completed_at: null
      }
    }

    const response = NextResponse.json({
      success: true,
      ...sessionData
    })

    // Set secure authentication cookie
    response.cookies.set("preyt_token", sessionData.access_token, {
      path: "/",
      maxAge: 2592000,
      sameSite: "lax",
      httpOnly: false // Accessible to client session manager
    })

    response.cookies.set("preyt_user_id", userId, {
      path: "/",
      maxAge: 2592000,
      sameSite: "lax"
    })

    return response
  } catch (error: any) {
    console.error("[OTP Verify Error]", error)
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    )
  }
}
