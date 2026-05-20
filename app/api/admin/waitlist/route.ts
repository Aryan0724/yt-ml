import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const statusFilter = searchParams.get("status") || ""
    const nicheFilter = searchParams.get("niche") || ""
    const countryFilter = searchParams.get("country") || ""
    const sortBy = searchParams.get("sortBy") || "created_at_desc"
    const minSubs = parseInt(searchParams.get("minSubs") || "0")
    const maxSubs = parseInt(searchParams.get("maxSubs") || "999999999")

    let query = supabaseServer.from("beta_waitlist").select("*")

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter)
    }
    if (nicheFilter && nicheFilter !== "All Niches") {
      query = query.ilike("niche", nicheFilter)
    }
    if (countryFilter && countryFilter !== "All Countries") {
      query = query.ilike("country", countryFilter)
    }
    if (minSubs > 0) {
      query = query.gte("subscriber_count", minSubs)
    }
    if (maxSubs < 999999999) {
      query = query.lte("subscriber_count", maxSubs)
    }

    // Sorting
    if (sortBy === "subscribers_desc") {
      query = query.order("subscriber_count", { ascending: false })
    } else if (sortBy === "subscribers_asc") {
      query = query.order("subscriber_count", { ascending: true })
    } else {
      query = query.order("created_at", { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error("Admin waitlist fetch error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Compute analytics
    const all = data || []
    const analytics = {
      total: all.length,
      pending: all.filter((a) => a.status === "pending").length,
      approved: all.filter((a) => a.status === "approved").length,
      rejected: all.filter((a) => a.status === "rejected").length,
      countries: [...new Set(all.map((a) => a.country).filter(Boolean))].length,
      niches: [...new Set(all.map((a) => a.niche).filter(Boolean))].length,
      showcaseConsent: all.filter((a) => a.consent_public_showcase).length,
      avgScans:
        all.length > 0
          ? Math.round(all.reduce((sum, a) => sum + (a.total_scans_used || 0), 0) / all.length)
          : 0,
      topNiche:
        all.length > 0
          ? Object.entries(
              all.reduce((acc: any, a) => {
                acc[a.niche] = (acc[a.niche] || 0) + 1
                return acc
              }, {})
            ).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "N/A"
          : "N/A",
      topCountry:
        all.length > 0
          ? Object.entries(
              all.reduce((acc: any, a) => {
                if (a.country) acc[a.country] = (acc[a.country] || 0) + 1
                return acc
              }, {})
            ).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "N/A"
          : "N/A",
    }

    return NextResponse.json({ success: true, data: all, analytics })
  } catch (err: any) {
    console.error("Admin Waitlist GET error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { id, notes } = await req.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const { data, error } = await supabaseServer
      .from("beta_waitlist")
      .update({ notes: notes || "" })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
