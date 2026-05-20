import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getLocalApplicants, addOrUpdateLocalApplicant } from "@/lib/local-db"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const statusFilter = searchParams.get("status") // pending, approved, rejected
    const nicheFilter = searchParams.get("niche")
    const sortBy = searchParams.get("sortBy") // subscribers_desc, subscribers_asc, applied_at_desc
    
    let dbApplicants: any[] = []
    try {
      // Set a 3-second timeout to prevent Vercel gateway timeouts on paused databases
      const queryPromise = supabaseServer.from("beta_waitlist").select("*")
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Database query timed out")), 3000)
      )
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any
      if (error) throw error
      dbApplicants = data || []
    } catch (err: any) {
      console.warn("Supabase fetch failed, using local JSON database only:", err.message)
    }

    // Load local fallback applicants
    const localApps = getLocalApplicants()

    // Merge by email (case-insensitive) to prevent duplicates, prioritizing Supabase DB records
    const mergedMap = new Map<string, any>()

    for (const app of localApps) {
      if (app && app.email) {
        mergedMap.set(app.email.toLowerCase().trim(), app)
      }
    }

    for (const app of dbApplicants) {
      if (app && app.email) {
        mergedMap.set(app.email.toLowerCase().trim(), app)
      }
    }

    let merged = Array.from(mergedMap.values())

    // Apply filters in-memory on the merged dataset
    if (statusFilter) {
      merged = merged.filter((a) => a.status === statusFilter)
    }

    if (nicheFilter && nicheFilter !== "All Niches") {
      merged = merged.filter((a) => a.niche && a.niche.toLowerCase() === nicheFilter.toLowerCase())
    }

    // Apply sorting
    if (sortBy === "subscribers_desc") {
      merged.sort((a, b) => (b.subscriber_count || 0) - (a.subscriber_count || 0))
    } else if (sortBy === "subscribers_asc") {
      merged.sort((a, b) => (a.subscriber_count || 0) - (b.subscriber_count || 0))
    } else {
      // Default: applied_at_desc
      merged.sort((a, b) => {
        const dateA = a.applied_at ? new Date(a.applied_at).getTime() : 0
        const dateB = b.applied_at ? new Date(b.applied_at).getTime() : 0
        return dateB - dateA
      })
    }

    return NextResponse.json({ success: true, data: merged })
  } catch (err: any) {
    console.error("Admin Fetch Applications Error:", err)
    return NextResponse.json({ error: err.message || "Could not retrieve applicants database." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { id, notes } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Missing applicant ID parameter." }, { status: 400 })
    }

    // 1. Update in local fallback JSON DB
    const updatedLocal = addOrUpdateLocalApplicant({ id, notes: notes || "" })
    let result = updatedLocal

    // 2. Attempt updating in Supabase waitlist_users table
    try {
      const { data, error } = await supabaseServer
        .from("beta_waitlist")
        .update({ notes: notes || "" })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      if (data) result = data
    } catch (err: any) {
      console.warn("Supabase notes update failed, using local DB update:", err.message)
    }

    return NextResponse.json({ success: true, data: result })
  } catch (err: any) {
    console.error("Admin Update Notes Error:", err)
    return NextResponse.json({ error: err.message || "Failed to update review notes." }, { status: 500 })
  }
}
