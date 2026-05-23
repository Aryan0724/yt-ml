import { NextResponse } from "next/server"

export const runtime = "nodejs"

// -----------------------------------------------------------------------
// Helper: extract the bare handle from any channel URL format
// Supports: @handle, youtube.com/@handle, youtube.com/c/name, etc.
// -----------------------------------------------------------------------
function extractHandle(raw: string): string {
  if (!raw) return ""
  let s = raw.trim()
  // Strip query parameters
  if (s.includes("?")) {
    s = s.split("?")[0]
  }
  // Strip trailing slashes
  s = s.replace(/\/+$/, "")
  // youtube.com/... URL
  if (s.includes("youtube.com/")) {
    const parts = s.split("youtube.com/")
    s = parts[parts.length - 1]
      .replace(/^(c\/|user\/|channel\/)/, "")
      .replace(/^@/, "")
      .trim()
    return s
  }
  // @handle bare
  if (s.startsWith("@")) return s.slice(1)
  return s
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const rawHandle = searchParams.get("handle") || ""

    if (!rawHandle) {
      return NextResponse.json({ error: "Missing channel handle" }, { status: 400 })
    }

    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 })
    }

    const handle = extractHandle(rawHandle)

    // ------------------------------------------------------------------
    // 1. Fetch channel metadata using forHandle (supports @handle format)
    // ------------------------------------------------------------------
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`
    const channelRes = await fetch(channelUrl, { next: { revalidate: 3600 } })
    const channelData = await channelRes.json()

    if (!channelRes.ok || channelData.error) {
      console.error("YouTube Channel API error:", channelData.error)
      return NextResponse.json(
        { error: channelData.error?.message || "YouTube API error", ytError: channelData.error },
        { status: channelRes.ok ? 500 : channelRes.status }
      )
    }

    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json({ error: `No channel found for handle: @${handle}` }, { status: 404 })
    }

    const channel = channelData.items[0]
    const snippet = channel.snippet || {}
    const stats = channel.statistics || {}
    const contentDetails = channel.contentDetails || {}

    const uploadsPlaylistId = contentDetails.relatedPlaylists?.uploads || null

    return NextResponse.json({
      success: true,
      channel: {
        id: channel.id,
        handle: handle,
        title: snippet.title || handle,
        description: (snippet.description || "").slice(0, 200),
        avatarUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || null,
        subscriberCount: parseInt(stats.subscriberCount || "0"),
        videoCount: parseInt(stats.videoCount || "0"),
        totalViews: parseInt(stats.viewCount || "0"),
        uploadsPlaylistId,
        country: snippet.country || null,
        publishedAt: snippet.publishedAt || null,
      }
    })
  } catch (err: any) {
    console.error("YouTube channel route error:", err)
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}
