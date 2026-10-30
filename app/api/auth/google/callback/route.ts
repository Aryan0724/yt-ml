import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const stateParam = searchParams.get("state")

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "preyt.integralgroups.in"
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
  const baseUrl = `${proto}://${host}`

  // Parse state for redirect destination
  let redirectTarget = "/dashboard"
  if (stateParam) {
    try {
      const parsed = JSON.parse(Buffer.from(stateParam, "base64").toString("utf-8"))
      if (parsed.redirect && typeof parsed.redirect === "string" && parsed.redirect.startsWith("/")) {
        redirectTarget = parsed.redirect
      }
    } catch {
      // Default to /dashboard
    }
  }

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(error || "Google authorization was cancelled")}`)
  }

  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || ""
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || ""
    const redirectUri = `${baseUrl}/api/auth/google/callback`

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    )

    // Exchange authorization code for access and refresh tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // 1. Fetch user profile from Google OAuth
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client })
    const { data: profile } = await oauth2.userinfo.get()

    const email = profile.email || "creator@youtube.com"
    const fullName = profile.name || "YouTube Creator"
    const avatarUrl = profile.picture || ""
    const googleId = profile.id || `gid_${Date.now()}`

    // 2. Fetch authenticated YouTube Channel(s) owned by this Google account
    let connectedChannel: any = null
    let availableChannels: any[] = []

    try {
      const youtube = google.youtube({ version: "v3", auth: oauth2Client })
      const channelRes = await youtube.channels.list({
        part: ["snippet", "statistics", "contentDetails"],
        mine: true
      })

      if (channelRes.data.items && channelRes.data.items.length > 0) {
        availableChannels = channelRes.data.items.map((item: any) => ({
          id: item.id,
          title: item.snippet?.title || fullName,
          handle: item.snippet?.customUrl ? (item.snippet.customUrl.startsWith("@") ? item.snippet.customUrl : `@${item.snippet.customUrl}`) : `@${(item.snippet?.title || "creator").toLowerCase().replace(/\s+/g, "")}`,
          description: item.snippet?.description || "",
          avatarUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || avatarUrl,
          subscriberCount: Number(item.statistics?.subscriberCount || 0),
          videoCount: Number(item.statistics?.videoCount || 0),
          totalViews: Number(item.statistics?.viewCount || 0)
        }))
        connectedChannel = availableChannels[0]
      }
    } catch (ytErr: any) {
      console.warn("[PreYT Google Callback] YouTube channel query note:", ytErr)
    }

    // 3. Assemble User & Workspace Session
    const userId = `usr_g_${googleId.slice(0, 12)}`
    const sessionData = {
      access_token: tokens.access_token || `preyt_g_${userId}_${Date.now()}`,
      refresh_token: tokens.refresh_token || `preyt_ref_g_${userId}`,
      token_type: "bearer",
      expires_in: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600,
      user: {
        id: userId,
        email: email,
        full_name: fullName,
        avatar_url: avatarUrl,
        is_verified: true,
        youtube_channel: connectedChannel || undefined,
        available_channels: availableChannels.length > 0 ? availableChannels : undefined
      },
      workspace: {
        id: `ws_${userId}`,
        name: connectedChannel ? `${connectedChannel.title} Studio` : `${fullName}'s Workspace`,
        slug: `${(connectedChannel?.handle || fullName).replace(/^@/, "").toLowerCase().replace(/[^a-z0-9]/g, "-")}-workspace`,
        plan_tier: "pro",
        role: "owner"
      }
    }

    const encodedSession = Buffer.from(JSON.stringify(sessionData)).toString("base64")

    // If NO YouTube channel was found under this authenticated Google account:
    if (!connectedChannel) {
      const redirectUrl = `${baseUrl}/onboarding?error=no_youtube_channel&email=${encodeURIComponent(email)}`
      const res = NextResponse.redirect(redirectUrl)
      res.cookies.set("preyt_token", sessionData.access_token, { path: "/", maxAge: 2592000, sameSite: "lax" })
      res.cookies.set("preyt_session_data", encodedSession, { path: "/", maxAge: 2592000, sameSite: "lax" })
      return res
    }

    // Determine target redirect
    const targetUrl = redirectTarget === "/onboarding" ? `${baseUrl}/onboarding?step=personalize` : `${baseUrl}${redirectTarget}`
    const res = NextResponse.redirect(targetUrl)

    res.cookies.set("preyt_token", sessionData.access_token, { path: "/", maxAge: 2592000, sameSite: "lax" })
    res.cookies.set("preyt_session_data", encodedSession, { path: "/", maxAge: 2592000, sameSite: "lax" })
    res.cookies.set("preyt_yt_channel", encodeURIComponent(connectedChannel.handle), { path: "/", maxAge: 2592000, sameSite: "lax" })

    return res
  } catch (err: any) {
    console.error("[PreYT Google Callback] Error during token exchange:", err)
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(err.message || "Failed to complete Google authentication")}`)
  }
}
