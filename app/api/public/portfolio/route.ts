import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export const runtime = "nodejs"

// This is a public API route, no auth required. It only exposes basic public info.
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("beta_waitlist")
      .select("youtube_channel")
      .eq("is_featured_in_portfolio", true)
      
    if (error) {
      throw error
    }

    // Extract names and format
    const featured = (data || []).map(row => {
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
