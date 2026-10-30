/**
 * lib/api/radar.ts
 *
 * Client API methods for PreYT Creator Radar.
 */

export interface RadarRegion {
  code: string
  name: string
  flag: string
  default: boolean
}

export interface RadarConfig {
  regions: RadarRegion[]
  categories: string[]
  classifications: string[]
  model_version: string
}

export interface RadarTopicMetrics {
  demand: number
  momentum: number
  freshness: number
  saturation: number
  volatility: number
  current_value: number
  baseline_value: number
}

export interface RadarOpportunityEvidence {
  demand_component: number
  momentum_component: number
  freshness_component: number
  saturation_discount: number
  weights: Record<string, number>
}

export interface RadarOpportunity {
  score: number
  tier: "HIGH" | "MODERATE" | "EMERGING"
  model_version: string
  evidence: RadarOpportunityEvidence
}

export interface RadarTopicItem {
  id: string
  slug: string
  canonical_name: string
  category: string
  region: string
  classification: "BREAKING" | "RISING" | "HOT" | "TRENDING" | "OPPORTUNITY" | "SATURATING" | "COOLING" | "STABLE"
  metrics: RadarTopicMetrics
  opportunity: RadarOpportunity
  confidence: "HIGH" | "MEDIUM" | "LOW"
  why_this_matters: string
  creator_opportunity: string
  sparkline: number[]
  data_source: string
  captured_at: string
}

export interface RadarSummary {
  region: string
  total_tracked: number
  breaking_count: number
  rising_count: number
  trending_count: number
  opportunity_count: number
  saturating_count: number
  captured_at: string
  model_version: string
}

export interface RadarFeedResponse {
  region: string
  category: string
  classification: string
  topics: RadarTopicItem[]
  total: number
  next_cursor?: string | null
  data_available: boolean
  reason?: string | null
}

export async function fetchRadarConfig(): Promise<RadarConfig> {
  const res = await fetch("/api/creator/radar/config", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch radar config")
  return res.json()
}

export async function fetchRadarSummary(region: string = "IN"): Promise<RadarSummary> {
  const res = await fetch(`/api/creator/radar/summary?region=${encodeURIComponent(region)}`, {
    cache: "no-store"
  })
  if (!res.ok) throw new Error("Failed to fetch radar summary")
  return res.json()
}

export async function fetchRadarTopics(params: {
  region?: string
  category?: string
  classification?: string
  limit?: number
  cursor?: string | null
}): Promise<RadarFeedResponse> {
  const query = new URLSearchParams()
  if (params.region) query.set("region", params.region)
  if (params.category) query.set("category", params.category)
  if (params.classification) query.set("classification", params.classification)
  if (params.limit) query.set("limit", String(params.limit))
  if (params.cursor) query.set("cursor", params.cursor)

  const res = await fetch(`/api/creator/radar/topics?${query.toString()}`, {
    cache: "no-store"
  })
  if (!res.ok) throw new Error("Failed to fetch radar topics")
  return res.json()
}

export async function fetchRadarTopicDetail(
  slug: string,
  region: string = "IN"
): Promise<RadarTopicItem> {
  const res = await fetch(
    `/api/creator/radar/topics/${encodeURIComponent(slug)}?region=${encodeURIComponent(region)}`,
    { cache: "no-store" }
  )
  if (!res.ok) throw new Error("Failed to fetch topic detail")
  return res.json()
}
