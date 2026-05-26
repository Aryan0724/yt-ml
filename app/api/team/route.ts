import { NextResponse } from "next/server"
import { getLocalTeam } from "@/lib/local-db-team"

export async function GET() {
  try {
    const team = getLocalTeam()
    // Return only active members
    const activeMembers = team.filter(m => m.isActive)
    return NextResponse.json({ success: true, team: activeMembers })
  } catch (error) {
    console.error("Failed to fetch team:", error)
    return NextResponse.json({ success: false, team: [] }, { status: 500 })
  }
}
