import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

function extractHandle(raw: string): string {
  if (!raw) return ""
  let s = raw.trim()
  if (s.includes("?")) s = s.split("?")[0]
  s = s.replace(/\/+$/, "")
  if (s.includes("youtube.com/")) {
    const parts = s.split("youtube.com/")
    s = parts[parts.length - 1]
      .replace(/^(c\/|user\/|channel\/)/, "")
      .replace(/^@/, "")
      .trim()
    return s
  }
  if (s.startsWith("@")) return s.slice(1)
  return s
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const rawInput = body.handle || body.channelUrl || body.channel || ""

    if (!rawInput) {
      return NextResponse.json({ error: "Missing YouTube channel handle or URL" }, { status: 400 })
    }

    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "YouTube Data API key is not configured" }, { status: 500 })
    }

    const clean = extractHandle(rawInput)

    // 1. Fetch channel metadata by handle
    let channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(clean)}&key=${apiKey}`
    let channelRes = await fetch(channelUrl, { next: { revalidate: 300 } })
    let channelData = await channelRes.json()

    // Fallback: If not found by forHandle, try searching by query
    if (!channelData.items || channelData.items.length === 0) {
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(clean)}&maxResults=1&key=${apiKey}`
      const searchRes = await fetch(searchUrl, { next: { revalidate: 300 } })
      const searchData = await searchRes.json()

      if (searchData.items && searchData.items.length > 0) {
        const foundChannelId = searchData.items[0].snippet?.channelId || searchData.items[0].id?.channelId
        if (foundChannelId) {
          channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${foundChannelId}&key=${apiKey}`
          channelRes = await fetch(channelUrl, { next: { revalidate: 300 } })
          channelData = await channelRes.json()
        }
      }
    }

    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json(
        { error: `No YouTube channel found for "@${clean}". Check the handle spelling.` },
        { status: 404 }
      )
    }

    const item = channelData.items[0]
    const snippet = item.snippet || {}
    const stats = item.statistics || {}
    const contentDetails = item.contentDetails || {}

    const channel = {
      id: item.id,
      handle: snippet.customUrl ? (snippet.customUrl.startsWith("@") ? snippet.customUrl : `@${snippet.customUrl}`) : `@${clean}`,
      title: snippet.title || clean,
      description: snippet.description || "",
      avatarUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || "",
      subscriberCount: Number(stats.subscriberCount || 0),
      videoCount: Number(stats.videoCount || 0),
      totalViews: Number(stats.viewCount || 0),
      uploadsPlaylistId: contentDetails.relatedPlaylists?.uploads || "",
      country: snippet.country || "US"
    }

    // 2. Fetch top 4 recent uploads if playlist available
    let recentVideos: any[] = []
    if (channel.uploadsPlaylistId) {
      try {
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${channel.uploadsPlaylistId}&maxResults=4&key=${apiKey}`
        const playlistRes = await fetch(playlistUrl, { next: { revalidate: 600 } })
        const playlistData = await playlistRes.json()

        if (playlistData.items && Array.isArray(playlistData.items)) {
          recentVideos = playlistData.items.map((v: any) => ({
            id: v.contentDetails?.videoId || v.id,
            title: v.snippet?.title || "Untitled Video",
            publishedAt: v.snippet?.publishedAt,
            thumbnailUrl: v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.medium?.url || ""
          }))
        }
      } catch (e) {
        console.warn("[PreYT Connect] Could not fetch recent uploads:", e)
      }
    }

    const res = NextResponse.json({
      success: true,
      channel,
      recentVideos
    })

    // Set cookie for quick sync
    res.cookies.set("preyt_yt_channel", encodeURIComponent(channel.handle), {
      path: "/",
      maxAge: 2592000,
      sameSite: "lax"
    })

    return res
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to connect YouTube channel" },
      { status: 500 }
    )
  }
}
