import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const statusFilter = searchParams.get("status") // pending, approved, rejected
    const nicheFilter = searchParams.get("niche")
    const sortBy = searchParams.get("sortBy") // subscribers_desc, subscribers_asc, applied_at_desc
    
    // Auth bypass check for development
    // (In production, wire to Supabase Auth Admin checks)
    
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

    const { data: applicants, error } = await query

    if (error) throw error

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

    const { data, error } = await supabaseServer
      .from("waitlist_users")
      .update({ notes: notes || "" })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error("Admin Update Notes Error:", err)
    return NextResponse.json({ error: err.message || "Failed to update review notes." }, { status: 500 })
  }
}
