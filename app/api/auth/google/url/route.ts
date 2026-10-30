import { NextResponse } from "next/server"
import { google } from "googleapis"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || ""
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || ""

    const isPlaceholder = !clientId || clientId.includes("your-google-client-id") || clientId.length < 10

    if (isPlaceholder) {
      return NextResponse.json({
        configured: false,
        message: "Google OAuth credentials not configured yet in environment."
      })
    }

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "preyt.integralgroups.in"
    const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || `${proto}://${host}/api/auth/google/callback`

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    )

    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/youtube.readonly"
    ]

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "select_account",
      include_granted_scopes: true
    })

    return NextResponse.json({
      configured: true,
      url: authUrl
    })
  } catch (error: any) {
    return NextResponse.json(
      { configured: false, error: error.message || "Failed to generate Google auth URL" },
      { status: 500 }
    )
  }
}
