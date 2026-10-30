import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, picture, googleId, youtubeChannel } = body

    if (!email) {
      return NextResponse.json({ detail: "Email is required" }, { status: 400 })
    }

    const userId = `usr_g_${(googleId || Buffer.from(email).toString("hex")).slice(0, 12)}`
    const displayName = name || email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())

    const session = {
      access_token: `preyt_tok_g_${userId}_${Date.now()}`,
      refresh_token: `preyt_ref_g_${userId}`,
      token_type: "bearer",
      expires_in: 86400,
      user: {
        id: userId,
        email: email,
        full_name: displayName,
        avatar_url: picture || "",
        is_verified: true,
        youtube_channel: youtubeChannel || undefined
      },
      workspace: {
        id: `ws_${userId}`,
        name: youtubeChannel ? `${youtubeChannel.title} Studio` : `${displayName}'s Workspace`,
        slug: `${(youtubeChannel?.handle || displayName).replace(/^@/, "").toLowerCase().replace(/[^a-z0-9]/g, "-")}-workspace`,
        plan_tier: "pro",
        role: "owner"
      }
    }

    const res = NextResponse.json(session, { status: 200 })
    res.cookies.set("preyt_token", session.access_token, {
      path: "/",
      maxAge: 2592000,
      sameSite: "lax"
    })
    if (youtubeChannel?.handle) {
      res.cookies.set("preyt_yt_channel", encodeURIComponent(youtubeChannel.handle), {
        path: "/",
        maxAge: 2592000,
        sameSite: "lax"
      })
    }

    return res
  } catch (err: any) {
    return NextResponse.json({ detail: err.message || "Failed to verify Google sign in" }, { status: 500 })
  }
}
