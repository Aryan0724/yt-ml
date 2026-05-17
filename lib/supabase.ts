import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Initialize Supabase if keys are present
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Robust database utility to store waitlist submissions.
 * Automatically handles Supabase storage, with automatic fallback to localStorage
 * so that the developer has a zero-friction experience before env vars are added.
 */
export async function saveWaitlistEntry(entry: {
  name: string
  email: string
  channelLink: string
  niche: string
  uploads: string
  reason: string
}) {
  const timestamp = new Date().toISOString()
  
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("waitlist")
        .insert([{ ...entry, created_at: timestamp }])
      
      if (error) throw error
      return { success: true, source: "supabase", data }
    } catch (err) {
      console.warn("Supabase insert failed, falling back to local storage:", err)
    }
  }
  
  // Fallback to local storage persistence
  try {
    const existing = JSON.parse(localStorage.getItem("algopilot_waitlist") || "[]")
    existing.push({ ...entry, created_at: timestamp })
    localStorage.setItem("algopilot_waitlist", JSON.stringify(existing))
    return { success: true, source: "localStorage" }
  } catch (e) {
    console.error("Local storage fallback failed:", e)
    return { success: false, error: e }
  }
}

/**
 * Stores pre-upload metadata analysis runs in the user's history log.
 */
export async function saveAnalysisHistory(historyItem: {
  title: string
  niche: string
  sensitivity: string
  score: number
  tier: string
  reliability: string
  risk_level: string
}) {
  const timestamp = new Date().toISOString()
  
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("analysis_history")
        .insert([{ ...historyItem, created_at: timestamp }])
      
      if (error) throw error
      return { success: true, source: "supabase", data }
    } catch (err) {
      console.warn("Supabase history insert failed, falling back to local storage:", err)
    }
  }
  
  // Fallback to local storage persistence
  try {
    const existing = JSON.parse(localStorage.getItem("algopilot_history") || "[]")
    existing.push({ ...historyItem, created_at: timestamp })
    localStorage.setItem("algopilot_history", JSON.stringify(existing))
    return { success: true, source: "localStorage" }
  } catch (e) {
    console.error("Local storage fallback failed:", e)
    return { success: false, error: e }
  }
}
