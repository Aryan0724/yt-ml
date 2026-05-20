import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const { id, extraCredits = 1 } = await req.json()
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 })

    // Fetch current credits
    const { data: applicant, error: fetchError } = await supabaseServer
      .from("beta_waitlist")
      .select("usage_remaining, daily_usage_limit")
      .eq("id", id)
      .single()

    if (fetchError || !applicant) {
      return NextResponse.json({ error: "Applicant not found." }, { status: 404 })
    }

    const newLimit = applicant.daily_usage_limit + extraCredits
    const newRemaining = applicant.usage_remaining + extraCredits

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
    return NextResponse.json({ success: true, data, newLimit, newRemaining })
  } catch (err: any) {
    console.error("Grant Credits Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
