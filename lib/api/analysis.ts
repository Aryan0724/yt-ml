/**
 * lib/api/analysis.ts
 *
 * Client-side API wrapper for the PreYT analysis pipeline.
 */

import { AnalysisResult, TopicIntelligence } from "@/lib/types/analysis"
import { getAuthHeaders } from "@/lib/api/auth"

export interface AnalyzePackageParams {
  thumbnail: File
  title: string
  category?: string
  region?: string
  includeTopic?: boolean
}

export async function analyzePackage(params: AnalyzePackageParams): Promise<AnalysisResult> {
  const formData = new FormData()
  formData.append("thumbnail", params.thumbnail)
  formData.append("title", params.title.trim())
  formData.append("niche", params.category || "General")
  formData.append("region", params.region || "IN")
  formData.append("include_topic", params.includeTopic !== false ? "true" : "false")
  formData.append("channel_title", "Creator")
  formData.append("video_length", "600")

  // Generate unique request idempotency key
  const idempotencyKey = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `req_${Date.now()}`
  const authHeaders = getAuthHeaders()

  const response = await fetch("/api/creator/analyze", {
    method: "POST",
    headers: {
      "Idempotency-Key": idempotencyKey,
      ...authHeaders
    },
    body: formData
  })

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({
      error: `Server responded with status ${response.status}`
    }))
    throw new Error(errorPayload.error || errorPayload.detail || "Analysis failed")
  }

  const result: AnalysisResult = await response.json()
  
  // Persist into session storage for deep linking and refresh resilience
  if (result.metadata?.analysis_id && typeof window !== "undefined") {
    saveAnalysisToSession(result)
  }

  return result
}

export async function fetchTopicIntelligence(
  topic: string,
  region: string = "IN",
  period: string = "12m"
): Promise<TopicIntelligence> {
  const params = new URLSearchParams({
    q: topic.trim(),
    region,
    period
  })

  const response = await fetch(`/api/creator/topic?${params.toString()}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch topic intelligence (${response.status})`)
  }

  const payload = await response.json()
  return payload.data || payload
}

export function saveAnalysisToSession(result: AnalysisResult): void {
  try {
    if (!result?.metadata?.analysis_id) return
    const key = `preyt_analysis_${result.metadata.analysis_id}`
    sessionStorage.setItem(key, JSON.stringify(result))
    
    // Also update recent analyses list
    const recentKey = "preyt_recent_analyses"
    const existing = JSON.parse(sessionStorage.getItem(recentKey) || "[]")
    const updated = [
      {
        id: result.metadata.analysis_id,
        score: result.data.score,
        tier: result.data.tier,
        timestamp: Date.now()
      },
      ...existing.filter((item: any) => item.id !== result.metadata.analysis_id)
    ].slice(0, 20)
    sessionStorage.setItem(recentKey, JSON.stringify(updated))
  } catch (e) {
    console.warn("Could not save analysis to sessionStorage", e)
  }
}

export function getAnalysisFromSession(id: string): AnalysisResult | null {
  try {
    if (typeof window === "undefined") return null
    const key = `preyt_analysis_${id}`
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as AnalysisResult
  } catch (e) {
    console.warn("Could not read analysis from sessionStorage", e)
    return null
  }
}
