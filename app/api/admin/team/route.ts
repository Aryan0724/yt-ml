import { NextResponse } from "next/server"
import { getLocalTeam, updateLocalTeamMember } from "@/lib/local-db-team"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const team = getLocalTeam()
    return NextResponse.json({ success: true, team })
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

    const updated = updateLocalTeamMember({
      id,
      name,
      role,
      vision,
      imageUrl,
      isActive
    })

    return NextResponse.json({ success: true, member: updated })
  } catch (error) {
    console.error("Admin team update error:", error)
    return NextResponse.json({ success: false, error: "Failed to update team member" }, { status: 500 })
  }
}
