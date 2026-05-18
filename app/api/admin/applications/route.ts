import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getLocalApplicants, addOrUpdateLocalApplicant } from "@/lib/local-db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const statusFilter = searchParams.get("status") // pending, approved, rejected
    const nicheFilter = searchParams.get("niche")
    const sortBy = searchParams.get("sortBy") // subscribers_desc, subscribers_asc, applied_at_desc
    
    let applicants: any[] = []
    let dbError = null

    try {
      let query = supabaseServer.from("waitlist_users").select("*")

      if (statusFilter) {
        query = query.eq("status", statusFilter)
      }
      
      if (nicheFilter && nicheFilter !== "All Niches") {
        query = query.eq("niche", nicheFilter)
      }

      if (sortBy === "subscribers_desc") {
        query = query.order("subscriber_count", { ascending: false })
      } else if (sortBy === "subscribers_asc") {
        query = query.order("subscriber_count", { ascending: true })
      } else {
        query = query.order("applied_at", { ascending: false })
      }

      const { data, error } = await query
      if (error) throw error
      applicants = data || []
    } catch (err: any) {
      console.warn("Supabase fetch failed, falling back to local JSON database:", err.message)
      dbError = err
    }

    // Fallback: If Supabase failed or returned no results, read from persistent local JSON
    if (applicants.length === 0) {
      let localApps = getLocalApplicants()
      
      if (statusFilter) {
        localApps = localApps.filter((a) => a.status === statusFilter)
      }
      
      if (nicheFilter && nicheFilter !== "All Niches") {
        localApps = localApps.filter((a) => a.niche === nicheFilter)
      }

      if (sortBy === "subscribers_desc") {
        localApps.sort((a, b) => b.subscriber_count - a.subscriber_count)
      } else if (sortBy === "subscribers_asc") {
        localApps.sort((a, b) => a.subscriber_count - b.subscriber_count)
      } else {
        localApps.sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
      }
      
      applicants = localApps
    }

    return NextResponse.json({ success: true, data: applicants })
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
        .from("waitlist_users")
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
