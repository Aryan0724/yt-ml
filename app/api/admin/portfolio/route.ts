import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const { data, error } = await supabaseServer
      .from("beta_waitlist")
      .select("id, full_name, email, youtube_channel, niche, agreed_to_portfolio, is_featured_in_portfolio")
      .eq("agreed_to_portfolio", true)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, creators: data || [] })
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

    const { error: updateError } = await supabaseServer
      .from("beta_waitlist")
      .update({ is_featured_in_portfolio: isFeatured })
      .eq("id", id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ success: true, isFeatured })
  } catch (err: any) {
    console.error("[admin/portfolio] POST error:", err)
    return NextResponse.json({ error: "Failed to update portfolio status." }, { status: 500 })
  }
}
