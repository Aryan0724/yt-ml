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
  archetype?: string
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
  if (params.archetype) {
    formData.append("archetype", params.archetype)
  }

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
  const authHeaders = getAuthHeaders()
  const res = await fetch(`/api/creator/topic?topic=${encodeURIComponent(topic)}&region=${region}&period=${period}`, {
    headers: authHeaders
  })

  if (!res.ok) {
    throw new Error("Failed to load topic intelligence")
  }

  return res.json()
}

export function saveAnalysisToSession(result: AnalysisResult): void {
  try {
    sessionStorage.setItem(`preyt_analysis_${result.metadata.analysis_id}`, JSON.stringify(result))
    sessionStorage.setItem("preyt_last_analysis", JSON.stringify(result))
  } catch (e) {
    console.warn("Could not save analysis to sessionStorage:", e)
  }
}

export function getAnalysisFromSession(analysisId?: string): AnalysisResult | null {
  try {
    const key = analysisId ? `preyt_analysis_${analysisId}` : "preyt_last_analysis"
    const raw = sessionStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}
