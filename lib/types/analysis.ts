/**
 * lib/types/analysis.ts
 *
 * Centralized TypeScript types for the PreYT Creator Decision Platform.
 * Reflects the frozen backend contract and explicit UI state machines.
 */

export type AnalysisStatus = "IDLE" | "UPLOADING" | "ANALYZING" | "SUCCESS" | "ERROR"

export type TopicStatus = "DISABLED" | "AVAILABLE" | "LOADING" | "SUCCESS" | "UNAVAILABLE" | "FAILED"

export type PillarStatus = "Strong" | "Moderate" | "Weak" | "Unknown"

export type SeverityLevel = "Critical" | "High" | "Medium" | "Low"

export interface PackagingVerdict {
  topic_status: PillarStatus
  title_status: PillarStatus
  thumbnail_status: PillarStatus
  overall_packaging: "High Impact" | "Moderate" | "Weak" | "Imbalanced"
}

export interface Diagnosis {
  root_cause: string
  severity: SeverityLevel
  evidence: string
  expected_consequence: string
}

export interface OptimizationStep {
  priority: number
  action: string
  rationale: string
}

export interface ContentAngle {
  angle: string
  reason: string
}

export interface MasterReport {
  summary: string
  packaging_verdict?: PackagingVerdict
  primary_bottleneck: string
  diagnosis: Diagnosis
  optimization_plan: OptimizationStep[]
  recommended_angles?: ContentAngle[]
  warnings?: string[]
}

export interface TopicTimeSeriesPoint {
  date: string
  value: number
}

export interface TopicMetrics {
  baseline_interest: number
  current_interest: number
  peak_interest?: number
  trough_interest?: number
  growth_rate: number
  short_term_momentum: number
  long_term_momentum: number
  momentum_label: "Rising" | "Falling" | "Stable" | "Unknown"
  volatility?: number
  volatility_label?: "Low" | "Medium" | "High"
  seasonality?: "Low" | "Moderate" | "High" | "Unknown"
  demand_level?: "High" | "Moderate" | "Low" | "Unknown"
  confidence: "HIGH" | "MEDIUM" | "LOW"
}

export interface TopicIntelligence {
  status: "success" | "unavailable" | "error"
  reason?: string
  data_source?: string
  topic: string
  raw_topic?: string
  region: string
  time_range: string
  time_series: TopicTimeSeriesPoint[]
  metrics?: TopicMetrics
  cached?: boolean
  metadata?: Record<string, any>
}

export interface VisualFactors {
  brightness?: number
  contrast?: number
  saturation?: number
  face_count?: number
  mobile_readability?: number
  clutter_level_rating?: number
  [key: string]: any
}

export interface VisualImprovement {
  title: string
  current: string
  recommended: string
  why: string
  tier?: string
  priority?: "High" | "Medium" | "Low"
}

export interface ChannelDna {
  channel_title?: string
  performance_baselines?: {
    avg_views?: number
    ctr_baseline?: number
    subscriber_tier?: string
    category_consistency?: number
  }
  dna_profile?: {
    channel_identity?: string
    audience_preference?: string
    dominant_thumbnail_style?: string
    title_pattern?: string
    high_performing_patterns?: string[]
  }
  style_match_percentage?: number
  channel_connected?: boolean
  [key: string]: any
}

export interface CompetitorAnalysis {
  data_available?: boolean
  data_note?: string
  niche_competitors?: any[]
  competitive_position?: {
    visual_attention_strength?: { you: number; niche_average: number; source?: string }
    curiosity_trigger_index?: { you: number; niche_average: number; source?: string }
    mobile_readability_rating?: { you: number; niche_average: number; source?: string }
    emotional_intensity_rating?: { you: number; niche_average: number; source?: string }
  }
  linguistic_forensics?: {
    market_saturation?: string
    curiosity_gap?: string
    curiosity_gap_color?: string
    title_length?: number
  }
}

export interface ArchetypeInfo {
  id: string
  name: string
  description: string
  primary_driver: string
  cv_features?: Record<string, any>
}

export interface ThumbnailOriginalityInfo {
  originality_score: number
  similarity_risk: string
  detected_formula: string
  saturation_level?: string
  formula_description?: string
  phash_fingerprint?: string
  recommendation: string
  niche_context?: string
}

export interface AnalysisData {
  engine_version: string
  archetype?: ArchetypeInfo
  originality?: ThumbnailOriginalityInfo
  score: number
  tier: string
  confidence: string
  confidence_range?: string
  reliability?: string
  risk_level?: string
  novelty_risk?: string
  factors: VisualFactors
  strengths: string[]
  weaknesses: string[]
  improvements: VisualImprovement[]
  master_report: MasterReport
  channel_dna?: ChannelDna
  competitor_analysis?: CompetitorAnalysis
  topic_intelligence?: TopicIntelligence
  ai?: {
    status: "success" | "fallback"
    reason?: string
    model?: string
    latency_ms?: number
    [key: string]: any
  }
  raw_metrics?: Record<string, any>
}

export interface AnalysisResult {
  status: "success" | "error"
  data: AnalysisData
  metadata: {
    analysis_id: string
    title?: string
    processing_time: number
    engine_version: string
  }
}
