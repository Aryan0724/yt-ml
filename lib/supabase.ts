/**
 * lib/supabase.ts
 * Supabase has been decommissioned in favor of VPS / self-hosted storage.
 * Storage utilities safely persist to local storage / local backend.
 */
export const isSupabaseConfigured = false
export const supabase: any = null


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

/**
 * ==========================================
 * TESTIMONIALS MANAGER
 * ==========================================
 */

export async function saveTestimonial(entry: {
  name: string
  subs: string
  text: string
  handle: string
  img: string
}) {
  const timestamp = new Date().toISOString()
  const testimonialData = { ...entry, active: true, created_at: timestamp, id: crypto.randomUUID() }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .insert([testimonialData])
      
      if (error) throw error
      return { success: true, source: "supabase", data }
    } catch (err) {
      console.warn("Supabase insert failed, falling back to local storage:", err)
    }
  }

  try {
    const existing = JSON.parse(localStorage.getItem("preyt_testimonials") || "[]")
    existing.push(testimonialData)
    localStorage.setItem("preyt_testimonials", JSON.stringify(existing))
    return { success: true, source: "localStorage" }
  } catch (e) {
    console.error("Local storage fallback failed:", e)
    return { success: false, error: e }
  }
}

export async function getTestimonials() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false })
      
      if (error) throw error
      return { success: true, source: "supabase", data }
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to local storage:", err)
    }
  }

  try {
    const existing = JSON.parse(localStorage.getItem("preyt_testimonials") || "[]")
    const activeTestimonials = existing.filter((t: any) => t.active !== false)
    const sorted = activeTestimonials.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    return { success: true, source: "localStorage", data: sorted }
  } catch (e) {
    console.error("Local storage fetch failed:", e)
    return { success: false, error: e, data: [] }
  }
}

export async function deleteTestimonial(id: string) {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("testimonials").delete().eq("id", id)
      if (error) throw error
      return { success: true, source: "supabase", data }
    } catch (err) {
      console.warn("Supabase delete failed, falling back to local storage:", err)
    }
  }

  try {
    const existing = JSON.parse(localStorage.getItem("preyt_testimonials") || "[]")
    const filtered = existing.filter((item: any) => item.id !== id)
    localStorage.setItem("preyt_testimonials", JSON.stringify(filtered))
    return { success: true, source: "localStorage" }
  } catch (e) {
    console.error("Local storage delete failed:", e)
    return { success: false, error: e }
  }
}

/**
 * ==========================================
 * ANALYSIS FEEDBACK SYSTEM
 * ==========================================
 */

export async function saveAnalysisFeedback(entry: {
  rating: number
  comment: string
  analysis_id?: string
}) {
  const timestamp = new Date().toISOString()
  const feedbackData = { ...entry, created_at: timestamp, id: crypto.randomUUID() }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("analysis_feedback")
        .insert([feedbackData])
      
      if (error) throw error
      return { success: true, source: "supabase", data }
    } catch (err) {
      console.warn("Supabase insert failed, falling back to local storage:", err)
    }
  }

  try {
    const existing = JSON.parse(localStorage.getItem("preyt_feedback") || "[]")
    existing.push(feedbackData)
    localStorage.setItem("preyt_feedback", JSON.stringify(existing))
    return { success: true, source: "localStorage" }
  } catch (e) {
    console.error("Local storage fallback failed:", e)
    return { success: false, error: e }
  }
}

