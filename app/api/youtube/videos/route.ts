import { NextResponse } from "next/server"

export const runtime = "nodejs"

function formatViewCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

function relativeTime(publishedAt: string): string {
  try {
    const diff = Date.now() - new Date(publishedAt).getTime()
    const days = Math.floor(diff / 86400000)
    if (days < 1) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    const weeks = Math.floor(days / 7)
    if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`
    const months = Math.floor(days / 30)
    if (months < 13) return `${months} month${months > 1 ? "s" : ""} ago`
    return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? "s" : ""} ago`
  } catch {
    return "Recently"
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const playlistId = searchParams.get("playlistId") || ""
    const maxResults = Math.min(parseInt(searchParams.get("maxResults") || "10"), 25)

    if (!playlistId) {
      return NextResponse.json({ error: "Missing playlistId" }, { status: 400 })
    }

    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 })
    }

    // ------------------------------------------------------------------
    // 1. Fetch uploads playlist items (recent videos)
    // ------------------------------------------------------------------
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(playlistId)}&maxResults=${maxResults}&key=${apiKey}`
    const playlistRes = await fetch(playlistUrl, { next: { revalidate: 3600 } })
    const playlistData = await playlistRes.json()

    if (!playlistRes.ok || playlistData.error) {
      console.error("YouTube Playlist API error:", playlistData.error)
      return NextResponse.json(
        { error: playlistData.error?.message || "Failed to fetch playlist", ytError: playlistData.error },
        { status: playlistRes.ok ? 500 : playlistRes.status }
      )
    }

    if (!playlistData.items || playlistData.items.length === 0) {
      return NextResponse.json({ success: true, videos: [] })
    }

    // Extract video IDs
    const videoIds: string[] = playlistData.items
      .map((item: any) => item.contentDetails?.videoId)
      .filter(Boolean)

    if (videoIds.length === 0) {
      return NextResponse.json({ success: true, videos: [] })
    }

    // ------------------------------------------------------------------
    // 2. Batch fetch video statistics (view count, like count, duration)
    // ------------------------------------------------------------------
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds.join(",")}&key=${apiKey}`
    const videosRes = await fetch(videosUrl, { next: { revalidate: 3600 } })
    const videosData = await videosRes.json()

    if (!videosRes.ok || videosData.error) {
      console.error("YouTube Videos API error:", videosData.error)
      return NextResponse.json(
        { error: videosData.error?.message || "Failed to fetch video stats", ytError: videosData.error },
        { status: videosRes.ok ? 500 : videosRes.status }
      )
    }

    const statsMap: Record<string, any> = {}
    for (const item of (videosData.items || [])) {
      statsMap[item.id] = {
        viewCount: parseInt(item.statistics?.viewCount || "0"),
        likeCount: parseInt(item.statistics?.likeCount || "0"),
        commentCount: parseInt(item.statistics?.commentCount || "0"),
        duration: item.contentDetails?.duration || "",
      }
    }

    // ------------------------------------------------------------------
    // 3. Build enriched video list, compute relative performance
    // ------------------------------------------------------------------
    const rawVideos: Array<{
      videoId: string
      title: string
      thumbnailUrl: string | null
      publishedAt: string
      viewCount: number
      likeCount: number
    }> = playlistData.items.map((item: any) => {
      const videoId = item.contentDetails?.videoId || ""
      const snippet = item.snippet || {}
      const stats = statsMap[videoId] || {}
      return {
        videoId,
        title: snippet.title || "Untitled",
        thumbnailUrl:
          snippet.thumbnails?.maxres?.url ||
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          null,
        publishedAt: snippet.publishedAt || snippet.videoPublishedAt || "",
        viewCount: stats.viewCount || 0,
        likeCount: stats.likeCount || 0,
      }
    })

    // Calculate average view count for relative performance
    const avgViews = rawVideos.length > 0
      ? rawVideos.reduce((sum, v) => sum + v.viewCount, 0) / rawVideos.length
      : 0

    const videos = rawVideos.map((v) => {
      const ratio = avgViews > 0 ? v.viewCount / avgViews : 1
      let status: string
      let statusColor: string
      if (ratio >= 1.5) {
        status = "OUTPERFORMED"
        statusColor = "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
      } else if (ratio >= 0.75) {
        status = "STABLE"
        statusColor = "text-blue-400 bg-blue-500/10 border border-blue-500/20"
      } else {
        status = "UNDERPERFORMING"
        statusColor = "text-rose-400 bg-rose-500/10 border border-rose-500/20"
      }

      return {
        videoId: v.videoId,
        title: v.title,
        thumbnailUrl: v.thumbnailUrl,
        publishedAt: v.publishedAt,
        viewCount: v.viewCount,
        viewCountFormatted: formatViewCount(v.viewCount),
        likeCount: v.likeCount,
        relativeTime: relativeTime(v.publishedAt),
        status,
        statusColor,
        performanceRatio: Math.round(ratio * 100) / 100,
        youtubeUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
      }
    })

    return NextResponse.json({ success: true, videos, avgViews: Math.round(avgViews) })
  } catch (err: any) {
    console.error("YouTube videos route error:", err)
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}
