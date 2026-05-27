import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getLocalApplicants, addOrUpdateLocalApplicant } from "@/lib/local-db"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    let dbApplicants: any[] = []
    try {
      const { data, error } = await supabaseServer
        .from("beta_waitlist")
        .select("id, full_name, email, youtube_channel, niche, consent_public_showcase, is_featured_in_portfolio")
        .eq("consent_public_showcase", true)
      if (error) throw error
      dbApplicants = data || []
    } catch (err: any) {
      console.warn("Supabase fetch failed, using local JSON database only:", err.message)
    }

    const localApps = getLocalApplicants()
    
    // Merge Strategy: Combine DB + Local, avoiding duplicates
    const dbIds = new Set(dbApplicants.map(a => a.id))
    const localFiltered = localApps.filter(a => a.consent_public_showcase && !dbIds.has(a.id))
    
    const combined = [...dbApplicants, ...localFiltered].filter(a => a.consent_public_showcase)

    return NextResponse.json({ success: true, creators: combined })
  } catch (err: any) {
    console.error("[admin/portfolio] GET error:", err)
    return NextResponse.json({ error: "Failed to fetch portfolio candidates." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { id, isFeatured } = await req.json()

    if (!id || typeof isFeatured !== "boolean") {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    // 1. Update in local fallback JSON DB
    addOrUpdateLocalApplicant({ id, is_featured_in_portfolio: isFeatured })

    // 2. Update Supabase
    try {
      const { error: updateError } = await supabaseServer
        .from("beta_waitlist")
        .update({ is_featured_in_portfolio: isFeatured })
        .eq("id", id)

      if (updateError) throw updateError
    } catch (err: any) {
      console.warn("Supabase update failed, using local DB update:", err.message)
    }

    return NextResponse.json({ success: true, isFeatured })
  } catch (err: any) {
    console.error("[admin/portfolio] POST error:", err)
    return NextResponse.json({ error: "Failed to update portfolio status." }, { status: 500 })
  }
}
