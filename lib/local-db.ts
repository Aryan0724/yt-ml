import fs from "fs"
import path from "path"
import fallbackData from "../data/waitlist_fallback.json"

const dbPath = path.join(process.cwd(), "data", "waitlist_fallback.json")

// Ensure the directory and file exist
function ensureDbDirectory() {
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([], null, 2), "utf-8")
  }
}

export interface LocalApplicant {
  id: string
  full_name: string
  email: string
  youtube_channel: string
  niche: string
  subscriber_count: number
  upload_frequency: string
  reason_for_joining: string
  status: "pending" | "approved" | "rejected" | "suspended"
  applied_at: string
  approved_at?: string
  total_logins: number
  total_analyses: number
  beta_access_token: string
  notes: string
}

export function getLocalApplicants(): LocalApplicant[] {
  try {
    ensureDbDirectory()
    const content = fs.readFileSync(dbPath, "utf-8")
    const parsed = JSON.parse(content) as LocalApplicant[]
    if (parsed.length === 0 && fallbackData && fallbackData.length > 0) {
      return fallbackData as LocalApplicant[]
    }
    return parsed
  } catch (err) {
    console.warn("Local DB Read Warning, falling back to static JSON bundle:", err)
    return (fallbackData || []) as LocalApplicant[]
  }
}

export function saveLocalApplicants(applicants: LocalApplicant[]): void {
  try {
    ensureDbDirectory()
    fs.writeFileSync(dbPath, JSON.stringify(applicants, null, 2), "utf-8")
  } catch (err) {
    console.error("Local DB Write Error:", err)
  }
}export function addOrUpdateLocalApplicant(applicant: Partial<LocalApplicant>): LocalApplicant {
  const applicants = getLocalApplicants()
  const emailLower = applicant.email?.toLowerCase() || ""
  
  // Try to find by id first, then by email
  let index = -1
  if (applicant.id) {
    index = applicants.findIndex((a) => a.id === applicant.id)
  }
  if (index === -1 && emailLower) {
    index = applicants.findIndex((a) => a.email.toLowerCase() === emailLower)
  }
  
  let result: LocalApplicant

  if (index >= 0) {
    // Update existing applicant fields
    result = { ...applicants[index], ...applicant } as LocalApplicant
    applicants[index] = result
  } else {
    // Insert new applicant - require email address
    if (!emailLower) {
      throw new Error("Cannot create a new local applicant without an email address.")
    }
    result = {
      id: applicant.id || "ap_" + Math.random().toString(36).substring(2, 15),
      full_name: applicant.full_name || "",
      email: emailLower,
      youtube_channel: applicant.youtube_channel || "",
      niche: applicant.niche || "Other",
      subscriber_count: applicant.subscriber_count || 0,
      upload_frequency: applicant.upload_frequency || "Weekly",
      reason_for_joining: applicant.reason_for_joining || "",
      status: applicant.status || "pending",
      applied_at: applicant.applied_at || new Date().toISOString(),
      beta_access_token: applicant.beta_access_token || "ap_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      notes: applicant.notes || "",
      total_logins: applicant.total_logins || 0,
      total_analyses: applicant.total_analyses || 0,
    }
    applicants.push(result)
  }
  
  saveLocalApplicants(applicants)
  return result
}
