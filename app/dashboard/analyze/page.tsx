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
  }) => {
    setStatus("ANALYZING")
    setErrorMessage(null)

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
      setCompareError("Please upload a thumbnail and title for at least 2 variants.")
      return
    }

    setCompareLoading(true)
    try {
      const formData = new FormData()
      validVariants.forEach((v) => {
        if (v.file) formData.append("files", v.file)
        formData.append("titles", v.title.trim())
      })

      const response = await fetch("/api/creator/compare", {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Comparison failed (${response.status})`)
      }

      const data = await response.json()
      setCompareResult(data)
    } catch (err: any) {
      setCompareError(err.message || "Failed to compare thumbnail variants.")
    } finally {
      setCompareLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Top Workflow Switcher */}
      {status === "IDLE" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl border">
            <button
              type="button"
              onClick={() => setActiveTab("analyze")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === "analyze"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Package Analyzer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("compare")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === "compare"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Variants</span>
            </button>
          </div>

          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            PreYT Creator Decision Engine
          </span>
        </div>
      )}

      {/* Mode 1: Single Video Package Analysis */}
      {activeTab === "analyze" && (
        <>
          {status === "IDLE" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <PackageInput
                onAnalyze={handleAnalyze}
                isLoading={false}
                initialTitle={searchParams?.get("title") || searchParams?.get("topic") || ""}
                initialRegion={searchParams?.get("region") || "IN"}
              />
            </div>
          )}

          {status === "ANALYZING" && (
            <div className="animate-in fade-in duration-500">
              <AnalysisLoading />
            </div>
          )}

          {status === "ERROR" && (
            <div className="w-full max-w-xl mx-auto py-16 px-6 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Analysis Encountered an Issue
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                {errorMessage || "Unable to complete analysis. Please verify your connection and try again."}
              </p>
              <div className="pt-2">
                <Button onClick={handleReset} size="lg" className="rounded-xl">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {status === "SUCCESS" && analysisResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Back / Reset Top Action */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Analyze Another Package
                </Button>

                <span className="text-xs text-muted-foreground font-mono">
                  ID: {analysisResult.metadata.analysis_id.slice(0, 8)}
                </span>
              </div>

              {/* 1. Score & Executive Verdict Header */}
              <VerdictHeader
                score={analysisResult.data.score}
                tier={analysisResult.data.tier}
                masterReport={analysisResult.data.master_report}
                aiStatus={analysisResult.data.ai?.status}
              />

              {/* 2. #1 Primary Bottleneck */}
              <PrimaryBottleneck
                masterReport={analysisResult.data.master_report}
              />

              {/* 3. Actionable Content Angles */}
              {analysisResult.data.master_report?.recommended_angles && (
                <ActionAngles
                  angles={analysisResult.data.master_report.recommended_angles}
                />
              )}

              {/* 4. Topic Intelligence Sparkline */}
              {analysisResult.data.topic_intelligence && (
                <TopicIntelligenceView
                  topicData={analysisResult.data.topic_intelligence}
                />
              )}

              {/* 5. Prioritized Optimization Checklist */}
              <SeverityChecklist
                improvements={analysisResult.data.improvements}
                optimizationPlan={analysisResult.data.master_report?.optimization_plan}
              />

              {/* 6. Expandable Technical Evidence Drawer */}
              <ExpandableEvidence
                factors={analysisResult.data.factors}
                strengths={analysisResult.data.strengths}
                weaknesses={analysisResult.data.weaknesses}
                channelDna={analysisResult.data.channel_dna}
                engineVersion={analysisResult.data.engine_version}
              />
            </div>
          )}
        </>
      )}

      {/* Mode 2: Compare Thumbnail Variants */}
      {activeTab === "compare" && (
        <form onSubmit={handleCompareSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Compare Thumbnail Variants
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Upload up to 4 thumbnail options to predict the highest performing packaging option.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {variants.map((v, idx) => (
                <div
                  key={v.id}
                  className="p-5 rounded-2xl bg-muted/20 border space-y-4 relative group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Variant {idx + 1}
                    </span>
                    {variants.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Thumbnail drop */}
                  <label className="block relative w-full aspect-video rounded-xl border-2 border-dashed border-border bg-background hover:border-primary/50 overflow-hidden cursor-pointer flex items-center justify-center transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) handleVariantFile(idx, f)
                      }}
                    />
                    {v.preview ? (
                      <img
                        src={v.preview}
                        alt={`Variant ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground p-2 text-center">
                        <Upload className="w-5 h-5" />
                        <span className="text-xs font-semibold">Upload 16:9 Image</span>
                      </div>
                    )}
                  </label>

                  {/* Title input */}
                  <input
                    type="text"
                    value={v.title}
                    onChange={(e) => {
                      const val = e.target.value
                      setVariants((prev) => {
                        const updated = [...prev]
                        updated[idx] = { ...updated[idx], title: val }
                        return updated
                      })
                    }}
                    placeholder={`Title for variant ${idx + 1}`}
                    className="w-full px-4 py-3 bg-background border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              ))}
            </div>

            {variants.length < 4 && (
              <button
                type="button"
                onClick={addVariant}
                className="w-full mt-6 py-4 rounded-2xl border-2 border-dashed hover:border-primary/50 text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Variant (Max 4)</span>
              </button>
            )}

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

