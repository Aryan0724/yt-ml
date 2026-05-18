import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getLocalApplicants, addOrUpdateLocalApplicant } from "@/lib/local-db"

export async function POST(req: Request) {
  try {
    const { id, action } = await req.json() // action: 'reject' | 'suspend' | 'pending'

    if (!id || !action) {
      return NextResponse.json({ error: "Missing required parameters (id, action)." }, { status: 400 })
    }

    const newStatus = action === "reject" ? "rejected" : action === "suspend" ? "suspended" : "pending"

    // Retrieve applicant email from local fallback first
    let email = ""
    const localApps = getLocalApplicants()
    const foundLocal = localApps.find((a) => a.id === id)
    if (foundLocal) {
      email = foundLocal.email
    } else {
      try {
        const { data } = await supabaseServer.from("waitlist_users").select("email").eq("id", id).single()
        if (data) email = data.email
      } catch (err) {}
    }

    // 1. Update in local fallback JSON DB
    const updatedLocal = addOrUpdateLocalApplicant({
      id,
      email: email || "unknown@email.com",
      status: newStatus
    })

    let result = updatedLocal

    // 2. Attempt update status in Supabase
    try {
      const { data, error } = await supabaseServer
        .from("waitlist_users")
        .update({ status: newStatus })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      if (data) result = data
    } catch (err: any) {
      console.warn("Supabase reject update failed, using local fallback DB:", err.message)
    }

    return NextResponse.json({ success: true, data: result })
  } catch (err: any) {
    console.error("Admin Reject API Error:", err)
    return NextResponse.json({ error: err.message || "Failed to modify applicant status." }, { status: 500 })
  }
}
