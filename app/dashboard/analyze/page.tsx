"use client"

import React, { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Sparkles,
  BarChart3,
  GitCompare,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Plus,
  Trash2,
  Trophy,
  Upload,
  Layers
} from "lucide-react"

import { analyzePackage } from "@/lib/api/analysis"
import { AnalysisResult, AnalysisStatus } from "@/lib/types/analysis"
import { PackageInput } from "@/components/dashboard/package-input"
import { AnalysisLoading } from "@/components/dashboard/analysis-loading"
import { VerdictHeader } from "@/components/dashboard/verdict-header"
import { PrimaryBottleneck } from "@/components/dashboard/primary-bottleneck"
import { ActionAngles } from "@/components/dashboard/action-angles"
import { SeverityChecklist } from "@/components/dashboard/severity-checklist"
import { TopicIntelligenceView } from "@/components/dashboard/topic-intelligence-view"
import { ExpandableEvidence } from "@/components/dashboard/expandable-evidence"
import { FeedSimulator } from "@/components/dashboard/feed-simulator"
import { HookStudio } from "@/components/dashboard/hook-studio"
import { OutcomeTracker } from "@/components/dashboard/outcome-tracker"
import { OriginalityCard } from "@/components/dashboard/originality-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface VariantItem {
  id: string
  file: File | null
  preview: string | null
  title: string
}

function AnalyzeContent() {
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState<"analyze" | "compare">("analyze")
  const [status, setStatus] = useState<AnalysisStatus>("IDLE")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Local preview state for live feed simulation
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null)
  const [analyzedTitle, setAnalyzedTitle] = useState<string>("")

  // Compare mode state
  const [variants, setVariants] = useState<VariantItem[]>([
    { id: "1", file: null, preview: null, title: "" },
    { id: "2", file: null, preview: null, title: "" }
  ])
  const [compareLoading, setCompareLoading] = useState(false)
  const [compareResult, setCompareResult] = useState<any | null>(null)
  const [compareError, setCompareError] = useState<string | null>(null)

  // Handle single package analysis
  const handleAnalyze = async (params: {
    thumbnail: File
    title: string
    category: string
    region: string
    includeTopic: boolean
    archetype?: string
  }) => {
    setStatus("ANALYZING")
    setErrorMessage(null)

    // Store preview URL and title for the Feed Simulator
    try {
      const previewUrl = URL.createObjectURL(params.thumbnail)
      setThumbnailPreviewUrl(previewUrl)
      setAnalyzedTitle(params.title)
    } catch (_) {}

    try {
      const result = await analyzePackage(params)
      setAnalysisResult(result)
      setStatus("SUCCESS")
    } catch (err: any) {
      console.error("Analysis failed:", err)
      setErrorMessage(err.message || "Failed to analyze video package.")
      setStatus("ERROR")
    }
  }

  const handleReset = () => {
    setStatus("IDLE")
    setAnalysisResult(null)
    setErrorMessage(null)
    setThumbnailPreviewUrl(null)
    setAnalyzedTitle("")
  }

  // Variant comparison functions
  const handleVariantFile = (idx: number, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setVariants((prev) => {
        const updated = [...prev]
        updated[idx] = {
          ...updated[idx],
          file,
          preview: e.target?.result as string
        }
        return updated
      })
    }
    reader.readAsDataURL(file)
  }

  const handleVariantTitle = (idx: number, title: string) => {
    setVariants((prev) => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], title }
      return updated
    })
  }

  const addVariant = () => {
    if (variants.length >= 4) return
    setVariants((prev) => [
      ...prev,
      { id: String(prev.length + 1), file: null, preview: null, title: "" }
    ])
  }

  const removeVariant = (idx: number) => {
    if (variants.length <= 2) return
    setVariants((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleCompareSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCompareError(null)

    const validVariants = variants.filter((v) => v.file && v.title.trim())
    if (validVariants.length < 2) {
      setCompareError("Please provide at least 2 complete variants (thumbnail + title).")
      return
    }

    setCompareLoading(true)
    try {
      const formData = new FormData()
      validVariants.forEach((v, i) => {
        formData.append(`thumbnail_${i}`, v.file!)
        formData.append(`title_${i}`, v.title.trim())
      })
      formData.append("variant_count", String(validVariants.length))

      const res = await fetch("/api/creator/compare", {
        method: "POST",
        body: formData
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Comparison failed.")
      }

      setCompareResult(data.data || data)
    } catch (err: any) {
      console.error("Comparison error:", err)
      setCompareError(err.message || "Failed to compare variants.")
    } finally {
      setCompareLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Navigation / Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Pre-Publish Packaging Intelligence
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Evaluate thumbnail, title, and topic alignment before rendering or uploading.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl border border-border w-fit">
          <button
            onClick={() => {
              setActiveTab("analyze")
              setCompareResult(null)
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "analyze"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Single Audit
          </button>
          <button
            onClick={() => setActiveTab("compare")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "compare"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            A/B Split Test
          </button>
        </div>
      </div>

      {/* Mode A: Single Package Analysis */}
      {activeTab === "analyze" && (
        <div className="space-y-6">
          {status === "IDLE" && (
            <PackageInput
              onAnalyze={handleAnalyze}
              isLoading={status === "ANALYZING"}
              initialTitle={searchParams.get("q") || ""}
              initialCategory="Entertainment"
              initialRegion="IN"
            />
          )}

          {status === "ANALYZING" && <AnalysisLoading />}

          {status === "ERROR" && (
            <div className="p-8 rounded-2xl border border-destructive/20 bg-destructive/5 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">
                  Audit Failed
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {errorMessage || "An unexpected error occurred during analysis."}
                </p>
              </div>
              <div className="pt-2">
                <Button onClick={handleReset} variant="outline" className="rounded-xl">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {status === "SUCCESS" && analysisResult && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              {/* Top Reset Action */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="rounded-xl text-xs font-semibold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Audit Another Video
                </Button>

                <div className="flex items-center gap-2">
                  {analysisResult.data.archetype && (
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-600/10 text-red-600 border border-red-600/20">
                      {analysisResult.data.archetype.name}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground font-mono">
                    ID: {analysisResult.metadata.analysis_id.slice(0, 8)}
                  </span>
                </div>
              </div>

              {/* 1. Score & Executive Verdict Header */}
              <VerdictHeader
                score={analysisResult.data.score}
                tier={analysisResult.data.tier}
                masterReport={analysisResult.data.master_report}
                aiStatus={analysisResult.data.ai?.status}
              />

              {/* 2. Interactive YouTube Mobile & Desktop Feed Simulator */}
              {thumbnailPreviewUrl && (
                <FeedSimulator
                  thumbnailUrl={thumbnailPreviewUrl}
                  title={analyzedTitle || analysisResult.metadata.title || "Video Packaging"}
                  channelName={analysisResult.data.channel_dna?.channel_title || "Your Channel"}
                  clashRisk={analysisResult.data.weaknesses?.some(w => w.toLowerCase().includes("danger zone") || w.toLowerCase().includes("timestamp"))}
                  warnings={analysisResult.data.weaknesses}
                />
              )}

              {/* 3. 1-Click Alternative High-Converting Title Hooks */}
              <HookStudio
                currentTitle={analyzedTitle || analysisResult.metadata.title || ""}
                archetypeName={analysisResult.data.archetype?.name || "General Hybrid"}
                suggestedAngles={analysisResult.data.master_report?.recommended_angles}
              />

              {/* 4. Thumbnail Originality & Formula Saturation Check (pHash Intelligence) */}
              {analysisResult.data.originality && (
                <OriginalityCard
                  originality={analysisResult.data.originality}
                />
              )}

              {/* 5. #1 Primary Bottleneck */}
              <PrimaryBottleneck
                masterReport={analysisResult.data.master_report}
              />

              {/* 6. Actionable Content Angles */}
              {analysisResult.data.master_report?.recommended_angles && (
                <ActionAngles
                  angles={analysisResult.data.master_report.recommended_angles}
                />
              )}

              {/* 7. Topic Intelligence Sparkline */}
              {analysisResult.data.topic_intelligence && (
                <TopicIntelligenceView
                  topicData={analysisResult.data.topic_intelligence}
                />
              )}

              {/* 8. Prioritized Optimization Checklist */}
              <SeverityChecklist
                improvements={analysisResult.data.improvements}
                optimizationPlan={analysisResult.data.master_report?.optimization_plan}
              />

              {/* 9. Closed-Loop Feedback: Track Real YouTube Performance */}
              <OutcomeTracker
                analysisId={analysisResult.metadata.analysis_id}
                predictedScore={analysisResult.data.score}
                predictedTier={analysisResult.data.tier}
              />

              {/* 10. Technical Evidence Drawer */}
              <ExpandableEvidence
                factors={analysisResult.data.factors}
                strengths={analysisResult.data.strengths}
                weaknesses={analysisResult.data.weaknesses}
                channelDna={analysisResult.data.channel_dna}
                engineVersion={analysisResult.data.engine_version}
              />
            </div>
          )}
        </div>
      )}

      {/* Mode B: A/B Variant Comparison */}
      {activeTab === "compare" && (
        <form onSubmit={handleCompareSubmit} className="space-y-6">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Pre-Publish A/B Split Test
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Test up to 4 thumbnail & title variations before spending render time.
                </p>
              </div>

              {variants.length < 4 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariant}
                  className="rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Variant
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {variants.map((variant, idx) => (
                <div
                  key={variant.id}
                  className="p-5 rounded-2xl border border-border bg-muted/10 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Variant {String.fromCharCode(65 + idx)}
                    </span>
                    {variants.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Thumbnail Upload Drop Area */}
                  <div
                    onClick={() => {
                      const input = document.getElementById(`file-input-${idx}`)
                      input?.click()
                    }}
                    className={`relative aspect-video rounded-xl border-2 border-dashed ${
                      variant.preview ? "border-primary/50" : "border-border hover:border-primary/40"
                    } flex items-center justify-center cursor-pointer overflow-hidden bg-background transition-colors`}
                  >
                    {variant.preview ? (
                      <img
                        src={variant.preview}
                        alt={`Variant ${String.fromCharCode(65 + idx)}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs font-medium text-foreground">
                          Upload Thumbnail
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          1280x720 recommended
                        </p>
                      </div>
                    )}
                    <input
                      id={`file-input-${idx}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleVariantFile(idx, file)
                      }}
                    />
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">
                      Working Title
                    </label>
                    <input
                      type="text"
                      value={variant.title}
                      onChange={(e) => handleVariantTitle(idx, e.target.value)}
                      placeholder="e.g. How I Built a $10M Company in 1 Year"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              ))}
            </div>

            {compareError && (
              <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                {compareError}
              </div>
            )}

            <Button
              type="submit"
              disabled={compareLoading}
              size="lg"
              className="w-full h-14 text-base rounded-xl mt-8"
            >
              {compareLoading ? "Evaluating Variants..." : "Compare Variants"}
            </Button>
          </Card>

          {/* Comparison Results */}
          {compareResult?.all_variants && (
            <Card className="p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-xl font-bold text-foreground">
                  Comparison Verdict
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {compareResult.all_variants.map((variant: any, i: number) => {
                  const isWinner = variant.rank === 1
                  return (
                    <div
                      key={i}
                      className={`p-6 rounded-2xl border ${
                        isWinner
                          ? "bg-amber-50 border-amber-200"
                          : "bg-muted/20 border-border"
                      } space-y-4`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-muted-foreground">
                          Rank #{variant.rank}
                        </span>
                        {isWinner && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider">
                            Predicted Winner
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-black ${isWinner ? 'text-amber-600' : 'text-foreground'}`}>
                          {variant.score}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">
                          / 100 (Tier {variant.tier})
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-foreground truncate">
                        {variant.name}
                      </p>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
        </form>
      )}
    </div>
  )
}

export default function AnalyzePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <AnalyzeContent />
    </Suspense>
  )
}
