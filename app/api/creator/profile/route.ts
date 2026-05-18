import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getLocalApplicants } from "@/lib/local-db"

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json()

    if (!email || !token) {
      return NextResponse.json({ error: "Missing session email or token." }, { status: 400 })
    }

    const emailLower = email.toLowerCase().trim()

    // 1. Try fetching from Supabase database first
    let creator: any = null
    try {
      const { data, error } = await supabaseServer
        .from("waitlist_users")
        .select("full_name, email, youtube_channel, niche, subscriber_count, upload_frequency, status")
        .eq("email", emailLower)
        .eq("beta_access_token", token)
        .single()

      if (data) creator = data
    } catch (err: any) {
      console.warn("Supabase fetch failed during creator profile read:", err.message)
    }

    // 2. Fallback to Local JSON Database registry
    if (!creator) {
      const localApps = getLocalApplicants()
      const foundLocal = localApps.find(
        (a) => a.email.toLowerCase() === emailLower && a.beta_access_token === token
      )
      if (foundLocal) {
        creator = {
          full_name: foundLocal.full_name,
          email: foundLocal.email,
          youtube_channel: foundLocal.youtube_channel,
          niche: foundLocal.niche,
          subscriber_count: foundLocal.subscriber_count,
          upload_frequency: foundLocal.upload_frequency,
          status: foundLocal.status,
        }
      }
    }

    if (!creator) {
      return NextResponse.json({ error: "Unauthorized beta pass credential." }, { status: 401 })
    }

    return NextResponse.json({ success: true, profile: creator })
  } catch (err: any) {
    console.error("Creator Profile Fetch Error:", err)
    return NextResponse.json({ error: err.message || "Failed to fetch creator session profile." }, { status: 500 })
  }
}
