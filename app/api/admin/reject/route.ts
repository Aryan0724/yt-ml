import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getLocalApplicants, saveLocalApplicants } from "@/lib/local-db"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { id, action } = await req.json()

    if (!id || !action) {
      return NextResponse.json({ error: "Missing id or action." }, { status: 400 })
    }

    const newStatus =
      action === "reject" ? "rejected" : action === "suspend" ? "suspended" : "pending"

    let updated: any = null
    let usingLocal = false

    try {
      const { data, error } = await supabaseServer
        .from("beta_waitlist")
        .update({ status: newStatus })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      updated = data
    } catch (err: any) {
      console.warn("Supabase update failed during reject, trying local fallback:", err.message)
      usingLocal = true
    }

    if (usingLocal) {
      const localApps = getLocalApplicants()
      const idx = localApps.findIndex((a) => a.id === id)
      if (idx >= 0) {
        localApps[idx] = { ...localApps[idx], status: newStatus } as any
        saveLocalApplicants(localApps)
        updated = {
          ...localApps[idx],
          country: localApps[idx].country || "Unknown",
          daily_usage_limit: 3,
          usage_remaining: 3,
          created_at: localApps[idx].applied_at || new Date().toISOString(),
        }
      }
    }

    if (!updated) {
      return NextResponse.json({ error: "Applicant not found." }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (err: any) {
    console.error("Admin Reject Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
