import { NextResponse } from "next/server"
import { getLocalApplicants, addOrUpdateLocalApplicant } from "@/lib/local-db"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const statusFilter = searchParams.get("status") // pending, approved, rejected
    const nicheFilter = searchParams.get("niche")
    const sortBy = searchParams.get("sortBy") // subscribers_desc, subscribers_asc, applied_at_desc
    
    // Load local applicants from VPS database ledger
    let merged = getLocalApplicants()


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

    // 1. Update in local VPS JSON ledger
    const result = addOrUpdateLocalApplicant({ id, notes: notes || "" })

    return NextResponse.json({ success: true, data: result })

  } catch (err: any) {
    console.error("Admin Update Notes Error:", err)
    return NextResponse.json({ error: err.message || "Failed to update review notes." }, { status: 500 })
  }
}
