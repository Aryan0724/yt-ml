import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const { id, action } = await req.json() // action: 'reject' | 'suspend' | 'pending'

    if (!id || !action) {
      return NextResponse.json({ error: "Missing required parameters (id, action)." }, { status: 400 })
    }

    const newStatus = action === "reject" ? "rejected" : action === "suspend" ? "suspended" : "pending"

    const { data: updated, error } = await supabaseServer
      .from("waitlist_users")
      .update({ status: newStatus })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data: updated })
  } catch (err: any) {
    console.error("Admin Reject API Error:", err)
    return NextResponse.json({ error: err.message || "Failed to modify applicant status." }, { status: 500 })
  }
}
