import { NextResponse } from "next/server"
import { google } from "googleapis"

export const runtime = "nodejs"

export async function GET() {
  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "http://localhost:3000/api/admin/google/callback"

    if (!clientId || !clientSecret) {
      return NextResponse.json({
        success: false,
        error: "Google Client ID or Client Secret environment variables are missing."
      }, { status: 400 })
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    )

    // Generate a secure auth url requesting GSC & GA4 read-only access
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline", // Essential to get the permanent refresh token
      prompt: "consent",      // Forces consent screen to guarantee refresh token delivery
      scope: [
        "https://www.googleapis.com/auth/analytics.readonly",
        "https://www.googleapis.com/auth/webmasters.readonly"
      ]
    })

    return NextResponse.json({
      success: true,
      url
    })
  } catch (err: any) {
    console.error("Google OAuth Link Generation Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
