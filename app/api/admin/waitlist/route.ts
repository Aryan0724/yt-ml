import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getLocalApplicants, saveLocalApplicants } from "@/lib/local-db"

export const runtime = "nodejs"
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

    // Fetch from Supabase
    let dbApplicants: any[] = []
    try {
      const { data, error } = await supabaseServer.from("beta_waitlist").select("*")
      if (error) throw error
      dbApplicants = data || []
    } catch (err: any) {
      console.warn("Supabase fetch failed during admin waitlist fetch, using local only:", err.message)
    }

    // Fetch local applicants
    const localApplicants = getLocalApplicants()

    // Merge by email (give precedence to Supabase DB records)
    const mergedMap = new Map<string, any>()
    
    // Map local records first
    for (const app of localApplicants) {
      if (app && app.email) {
        const emailKey = app.email.toLowerCase().trim()
        mergedMap.set(emailKey, {
          ...app,
          country: app.country || "Unknown",
          why_join: app.reason_for_joining || "",
          consent_public_showcase: app.consent_public_showcase || false,
          daily_usage_limit: 3,
          usage_remaining: 3,
          created_at: app.applied_at || new Date().toISOString(),
          total_scans_used: app.total_analyses || 0,
        })
      }
    }

    // Overwrite with DB records
    for (const app of dbApplicants) {
      if (app && app.email) {
        const emailKey = app.email.toLowerCase().trim()
        mergedMap.set(emailKey, app)
      }
    }

    let all = Array.from(mergedMap.values())

    // Apply Filters Programmatically
    if (statusFilter && statusFilter !== "all") {
      all = all.filter((a) => a.status === statusFilter)
    }
    if (nicheFilter && nicheFilter !== "All Niches") {
      all = all.filter((a) => a.niche && a.niche.toLowerCase() === nicheFilter.toLowerCase())
    }
    if (countryFilter && countryFilter !== "All Countries") {
      all = all.filter((a) => a.country && a.country.toLowerCase() === countryFilter.toLowerCase())
    }
    if (minSubs > 0) {
      all = all.filter((a) => (a.subscriber_count || 0) >= minSubs)
    }
    if (maxSubs < 999999999) {
      all = all.filter((a) => (a.subscriber_count || 0) <= maxSubs)
    }

    // Apply Sorting Programmatically
    if (sortBy === "subscribers_desc") {
      all.sort((a, b) => (b.subscriber_count || 0) - (a.subscriber_count || 0))
    } else if (sortBy === "subscribers_asc") {
      all.sort((a, b) => (a.subscriber_count || 0) - (b.subscriber_count || 0))
    } else {
      all.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    }

    // Compute analytics
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
                const niche = a.niche || "Other"
                acc[niche] = (acc[niche] || 0) + 1
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

    let updated: any = null
    let usingLocal = false

    try {
      const { data, error } = await supabaseServer
        .from("beta_waitlist")
        .update({ notes: notes || "" })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      updated = data
    } catch (err: any) {
      console.warn("Supabase notes update failed, trying local fallback:", err.message)
      usingLocal = true
    }

    if (usingLocal) {
      const localApps = getLocalApplicants()
      const idx = localApps.findIndex((a) => a.id === id)
      if (idx >= 0) {
        localApps[idx] = { ...localApps[idx], notes: notes || "" }
        saveLocalApplicants(localApps)
        updated = {
          ...localApps[idx],
          country: localApps[idx].country || "Unknown",
          why_join: localApps[idx].reason_for_joining || "",
          consent_public_showcase: localApps[idx].consent_public_showcase || false,
          daily_usage_limit: 3,
          usage_remaining: 3,
          created_at: localApps[idx].applied_at || new Date().toISOString(),
          total_scans_used: localApps[idx].total_analyses || 0,
        }
      }
    }

    if (!updated) {
      return NextResponse.json({ error: "Applicant not found." }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
