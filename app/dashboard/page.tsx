"use client"

import React, { useState, useEffect, Suspense } from "react"
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

import { analyzePackage, getAnalysisFromSession, saveAnalysisToSession } from "@/lib/api/analysis"
import { AnalysisResult, AnalysisStatus } from "@/lib/types/analysis"
import { PackageInput } from "@/components/dashboard/package-input"
import { AnalysisLoading } from "@/components/dashboard/analysis-loading"
import { VerdictHeader } from "@/components/dashboard/verdict-header"
import { PrimaryBottleneck } from "@/components/dashboard/primary-bottleneck"
import { ActionAngles } from "@/components/dashboard/action-angles"
import { SeverityChecklist } from "@/components/dashboard/severity-checklist"
import { TopicIntelligenceView } from "@/components/dashboard/topic-intelligence-view"
import { ExpandableEvidence } from "@/components/dashboard/expandable-evidence"

interface VariantItem {
  id: string
  file: File | null
  preview: string | null
  title: string
}

function DashboardContent() {

  const router = useRouter()
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
    <div className="w-full max-w-4xl mx-auto space-y-8 text-left pb-20">
      
      {/* Top Workflow Switcher */}
      {status === "IDLE" && (
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveTab("analyze")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "analyze"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Package Analyzer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("compare")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "compare"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare Variants</span>
            </button>
          </div>

          <span className="text-[11px] text-zinc-400 font-medium hidden sm:inline">
            PreYT Creator Decision Engine
          </span>
        </div>
      )}

      {/* Mode 1: Single Video Package Analysis */}
      {activeTab === "analyze" && (
        <>
          {status === "IDLE" && (
            <div className="animate-fade-in">
              <PackageInput
                onAnalyze={handleAnalyze}
                isLoading={false}
                initialTitle={searchParams?.get("title") || searchParams?.get("topic") || ""}
                initialRegion={searchParams?.get("region") || "IN"}
              />
            </div>
          )}

          {status === "ANALYZING" && (
            <div className="animate-fade-in">
              <AnalysisLoading />
            </div>
          )}

          {status === "ERROR" && (
            <div className="w-full max-w-xl mx-auto py-16 px-6 text-center space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Analysis Encountered an Issue
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
                {errorMessage || "Unable to complete analysis. Please verify your connection and try again."}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}

          {status === "SUCCESS" && analysisResult && (
            <div className="space-y-6 animate-fade-in">
              {/* Back / Reset Top Action */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Analyze Another Package</span>
                </button>

                <span className="text-[10px] text-zinc-400 font-mono">
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
        <form onSubmit={handleCompareSubmit} className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                Compare Thumbnail Variants
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Upload up to 4 thumbnail options to predict the highest performing packaging option.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {variants.map((v, idx) => (
                <div
                  key={v.id}
                  className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-3 relative group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Variant {idx + 1}
                    </span>
                    {variants.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="text-zinc-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Thumbnail drop */}
                  <label className="block relative w-full aspect-video rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/40 hover:border-zinc-400 dark:hover:border-zinc-600 overflow-hidden cursor-pointer flex items-center justify-center">
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
                      <div className="flex flex-col items-center gap-1 text-zinc-400 p-2 text-center">
                        <Upload className="w-5 h-5" />
                        <span className="text-[11px] font-semibold">Upload 16:9 Image</span>
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
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {variants.length < 4 && (
              <button
                type="button"
                onClick={addVariant}
                className="w-full py-3 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 text-xs font-bold text-zinc-600 dark:text-zinc-400 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Variant (Max 4)</span>
              </button>
            )}

            {compareError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                {compareError}
              </div>
            )}

            <button
              type="submit"
              disabled={compareLoading}
              className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {compareLoading ? "Evaluating Variants..." : "Compare Variants"}
            </button>
          </div>

          {/* Comparison Results */}
          {compareResult?.all_variants && (
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Comparison Verdict
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {compareResult.all_variants.map((variant: any, i: number) => {
                  const isWinner = variant.rank === 1
                  return (
                    <div
                      key={i}
                      className={`p-5 rounded-2xl border ${
                        isWinner
                          ? "bg-amber-500/5 border-amber-500/30 dark:bg-amber-950/20"
                          : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
                      } space-y-3`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-zinc-400">
                          Rank #{variant.rank}
                        </span>
                        {isWinner && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider">
                            Predicted Winner
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-zinc-900 dark:text-white">
                          {variant.score}
                        </span>
                        <span className="text-xs font-bold text-zinc-400">
                          / 100 (Tier {variant.tier})
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                        {variant.name}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}

