import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const { id, action } = await req.json()

    if (!id || !action) {
      return NextResponse.json({ error: "Missing id or action." }, { status: 400 })
    }

    const newStatus =
      action === "reject" ? "rejected" : action === "suspend" ? "suspended" : "pending"

    const { data, error } = await supabaseServer
      .from("beta_waitlist")
      .update({ status: newStatus })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error("Admin Reject Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
