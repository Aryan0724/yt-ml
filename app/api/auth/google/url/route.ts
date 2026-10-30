import { NextResponse } from "next/server"
import { google } from "googleapis"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const redirectParam = searchParams.get("redirect") || "/onboarding"

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || ""
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || ""

    const isPlaceholder = !clientId || clientId.includes("your-google-client-id") || clientId.length < 10

    if (isPlaceholder) {
      return NextResponse.json({
        configured: false,
        message: "Google Cloud OAuth credentials (GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET) are not configured in environment variables."
      })
    }

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "preyt.integralgroups.in"
    const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
    const redirectUri = `${proto}://${host}/api/auth/google/callback`

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    )

    // Request full YouTube read-only access along with basic profile & email
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/youtube.readonly"
    ]

    const statePayload = Buffer.from(JSON.stringify({ redirect: redirectParam })).toString("base64")

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent select_account",
      state: statePayload,
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
