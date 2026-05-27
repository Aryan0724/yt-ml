import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getLocalApplicants } from "@/lib/local-db"

export const runtime = "nodejs"

// This is a public API route, no auth required. It only exposes basic public info.
export async function GET() {
  try {
    let dbApplicants: any[] = []
    try {
      const { data, error } = await supabaseServer
        .from("beta_waitlist")
        .select("youtube_channel, id")
        .eq("is_featured_in_portfolio", true)
      if (error) throw error
      dbApplicants = data || []
    } catch (err: any) {
      console.warn("Supabase fetch failed, using local JSON database only:", err.message)
    }

    const localApps = getLocalApplicants()
    
    // Merge Strategy: Combine DB + Local, avoiding duplicates
    const dbIds = new Set(dbApplicants.map(a => a.id))
    const localFiltered = localApps.filter(a => a.is_featured_in_portfolio && !dbIds.has(a.id))
    
    const combined = [...dbApplicants, ...localFiltered].filter(a => a.is_featured_in_portfolio)

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
