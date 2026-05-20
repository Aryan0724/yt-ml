import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getLocalApplicants, saveLocalApplicants } from "@/lib/local-db"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { id, extraCredits = 1 } = await req.json()
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 })

    // Fetch current credits
    let applicant: any = null
    let usingLocal = false

    try {
      const { data, error: fetchError } = await supabaseServer
        .from("beta_waitlist")
        .select("usage_remaining, daily_usage_limit")
        .eq("id", id)
        .single()
      
      if (!fetchError && data) {
        applicant = data
      }
    } catch (err) {
      console.warn("Supabase fetch failed during grant-credits, trying local fallback:", err)
    }

    if (!applicant) {
      const localApps = getLocalApplicants()
      const found = localApps.find((a) => a.id === id)
      if (found) {
        applicant = {
          usage_remaining: found.daily_usage_limit || 3,
          daily_usage_limit: found.daily_usage_limit || 3,
          ...found
        }
        usingLocal = true
      }
    }

    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found." }, { status: 404 })
    }

    const newLimit = (applicant.daily_usage_limit || 3) + extraCredits
    const newRemaining = (applicant.usage_remaining || 3) + extraCredits

    let updated: any = null

    if (!usingLocal) {
      try {
        const { data, error } = await supabaseServer
          .from("beta_waitlist")
          .update({
            daily_usage_limit: newLimit,
            usage_remaining: newRemaining,
          })
          .eq("id", id)
          .select()
          .single()

        if (error) throw error
        updated = data
      } catch (err: any) {
        console.warn("Supabase update failed during grant-credits, trying local fallback:", err.message)
        usingLocal = true
      }
    }

    if (usingLocal) {
      const localApps = getLocalApplicants()
      const idx = localApps.findIndex((a) => a.id === id)
      if (idx >= 0) {
        localApps[idx] = {
          ...localApps[idx],
          daily_usage_limit: newLimit,
          usage_remaining: newRemaining
        } as any
        saveLocalApplicants(localApps)
        updated = {
          ...localApps[idx],
          country: localApps[idx].country || "Unknown",
          daily_usage_limit: newLimit,
          usage_remaining: newRemaining,
          created_at: localApps[idx].applied_at || new Date().toISOString(),
        }
      }
    }

    if (!updated) {
      return NextResponse.json({ error: "Applicant not found." }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated, newLimit, newRemaining })
  } catch (err: any) {
    console.error("Grant Credits Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
