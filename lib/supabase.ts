import { createClient } from "@supabase/supabase-js"
import { normalizeEnvValue } from "@/lib/supabase-diagnostics"

const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL)
const supabaseAnonKey = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91Y3dsbmhiZnlkYXVna21rcHp5IiwiaWF0IjoxNzc4OTk5ODQ2LCJleHAiOjIwOTQ1NzU4NDZ9.QMmneQ9hTlPLjTla254lujL1HwZ-5N-bxzUvwZ803EU"

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
    const existing = JSON.parse(localStorage.getItem("preyt_waitlist") || "[]")
    existing.push({ ...entry, created_at: timestamp })
    localStorage.setItem("preyt_waitlist", JSON.stringify(existing))
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
    const existing = JSON.parse(localStorage.getItem("preyt_history") || "[]")
    existing.push({ ...historyItem, created_at: timestamp })
    localStorage.setItem("preyt_history", JSON.stringify(existing))
    return { success: true, source: "localStorage" }
  } catch (e) {
    console.error("Local storage fallback failed:", e)
    return { success: false, error: e }
  }
}

/**
 * Retrieves the pre-upload metadata analysis runs history.
 */
export async function getAnalysisHistory() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("analysis_history")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      return { success: true, source: "supabase", data }
    } catch (err) {
      console.warn("Supabase history fetch failed, falling back to local storage:", err)
    }
  }
  
  try {
    const existing = JSON.parse(localStorage.getItem("preyt_history") || "[]") as Array<{
      created_at: string
      [key: string]: unknown
    }>
    const sorted = [...existing].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    return { success: true, source: "localStorage", data: sorted }
  } catch (e) {
    console.error("Local storage history load failed:", e)
    return { success: false, error: e, data: [] }
  }
}

/**
 * Deletes a pre-upload metadata analysis run from history.
 */
export async function deleteAnalysisHistory(id?: string | number, createdAt?: string) {
  if (supabase) {
    try {
      let query = supabase.from("analysis_history").delete()
      if (id) {
        query = query.eq("id", id)
      } else if (createdAt) {
        query = query.eq("created_at", createdAt)
      } else {
        throw new Error("Missing identifier to delete history item")
      }
      const { data, error } = await query
      if (error) throw error
      return { success: true, source: "supabase", data }
    } catch (err) {
      console.warn("Supabase history delete failed, falling back to local storage:", err)
    }
  }

  try {
    const existing = JSON.parse(localStorage.getItem("preyt_history") || "[]") as Array<{
      id?: string | number
      created_at: string
      [key: string]: unknown
    }>
    const filtered = existing.filter(item => {
      if (id && item.id === id) return false
      if (createdAt && item.created_at === createdAt) return false
      return true
    })
    localStorage.setItem("preyt_history", JSON.stringify(filtered))
    return { success: true, source: "localStorage" }
  } catch (e) {
    console.error("Local storage history delete failed:", e)
    return { success: false, error: e }
  }
}

