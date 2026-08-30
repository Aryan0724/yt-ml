import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { data: team, error } = await supabaseServer
      .from("cms_team")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true })

    if (error) throw error

    const formattedTeam = (team || []).map((m: any) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      vision: m.vision,
      imageUrl: m.image_url,
      isActive: m.is_active
    }))


    return NextResponse.json({ success: true, team: formattedTeam })
  } catch (error) {
    console.error("Failed to fetch team:", error)
    return NextResponse.json({ success: false, team: [] }, { status: 500 })
  }
}
