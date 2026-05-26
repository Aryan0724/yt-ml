import fs from "fs"
import path from "path"

export interface TeamMember {
  id: string
  name: string
  role: string
  vision: string
  imageUrl: string
  isActive: boolean
}

const dbPath = path.join(process.cwd(), "data", "team_fallback.json")

// Ensure the directory and file exist
function ensureDbDirectory() {
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(dbPath)) {
    // If it doesn't exist, try to load from the static fallback if it exists, otherwise empty
    let initialData = []
    try {
      initialData = require("../data/team_fallback.json")
    } catch {
      // Fallback is empty if the require fails
    }
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), "utf-8")
  }
}

export function getLocalTeam(): TeamMember[] {
  try {
    ensureDbDirectory()
    const content = fs.readFileSync(dbPath, "utf-8")
    const parsed = JSON.parse(content) as TeamMember[]
    if (parsed.length === 0) {
      // If empty for some reason, return the static file directly if possible
      try {
        return require("../data/team_fallback.json") as TeamMember[]
      } catch {
        return []
      }
    }
    return parsed
  } catch (err) {
    console.warn("Local DB Read Warning (Team), falling back to static JSON bundle:", err)
    try {
      return require("../data/team_fallback.json") as TeamMember[]
    } catch {
      return []
    }
  }
}

export function saveLocalTeam(team: TeamMember[]): void {
  try {
    ensureDbDirectory()
    fs.writeFileSync(dbPath, JSON.stringify(team, null, 2), "utf-8")
  } catch (err) {
    console.error("Local DB Write Error (Team):", err)
  }
}

export function updateLocalTeamMember(member: Partial<TeamMember>): TeamMember {
  const team = getLocalTeam()
  
  if (!member.id) {
    throw new Error("Cannot update a team member without an ID.")
  }

  const index = team.findIndex((m) => m.id === member.id)
  let result: TeamMember

  if (index >= 0) {
    // Update existing
    result = { ...team[index], ...member } as TeamMember
    team[index] = result
  } else {
    // Insert new
    result = {
      id: member.id,
      name: member.name || "New Member",
      role: member.role || "Role",
      vision: member.vision || "Vision statement goes here.",
      imageUrl: member.imageUrl || "",
      isActive: member.isActive ?? true,
    }
    team.push(result)
  }
  
  saveLocalTeam(team)
  return result
}
