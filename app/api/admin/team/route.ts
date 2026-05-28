import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { data: team, error } = await supabaseServer
      .from("cms_team")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) throw error

    const formattedTeam = team.map(m => ({
      id: m.id,
      name: m.name,
      role: m.role,
      vision: m.vision,
      imageUrl: m.image_url,
      isActive: m.is_active
    }))

    return NextResponse.json({ success: true, team: formattedTeam })
  } catch (error) {
    console.error("Admin team fetch error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch team" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, name, role, vision, imageUrl, isActive } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 })
    }

    const { data: updated, error } = await supabaseServer
      .from("cms_team")
      .upsert({
        id,
        name: name || "New Member",
        role: role || "Role",
        vision: vision || "Vision statement goes here.",
        image_url: imageUrl || "",
        is_active: isActive ?? true
      }, { onConflict: "id" })
      .select()
      .single()

    if (error) throw error

    const formattedMember = {
      id: updated.id,
      name: updated.name,
      role: updated.role,
      vision: updated.vision,
      imageUrl: updated.image_url,
      isActive: updated.is_active
    }

    return NextResponse.json({ success: true, member: formattedMember })
  } catch (error) {
    console.error("Admin team update error:", error)
    return NextResponse.json({ success: false, error: "Failed to update team member" }, { status: 500 })
  }
}
