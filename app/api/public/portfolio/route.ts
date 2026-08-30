import { NextResponse } from "next/server"
import { getLocalApplicants } from "@/lib/local-db"

export const runtime = "nodejs"

// Public API route exposing featured creator portfolio showcase
export async function GET() {
  try {
    const localApps = getLocalApplicants()
    const combined = localApps.filter(a => a.is_featured_in_portfolio)

    // Extract names and format
    const featured = combined.map(row => {
      let rawName = row.youtube_channel || ""
      
      // Clean up URL-based handles if they entered a link
      if (rawName.includes("youtube.com/")) {
        const parts = rawName.split("youtube.com/")
        rawName = parts[parts.length - 1]
          .replace(/^(c\/|user\/|channel\/)/, "")
          .replace(/^@/, "")
          .trim()
      } else if (rawName.startsWith("@")) {
        rawName = rawName.slice(1)
      }
      
      return {
        name: rawName
      }
    })

    return NextResponse.json({ success: true, featured })
  } catch (err: any) {
    console.error("[public/portfolio] error:", err)
    return NextResponse.json({ error: "Failed to load featured portfolio" }, { status: 500 })
  }
}
