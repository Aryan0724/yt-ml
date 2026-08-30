"use client"

import React, { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import {
  fetchRadarTopicDetail,
  RadarTopicItem
} from "@/lib/api/radar"
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Flame,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Gem,
  AlertTriangle,
  Info,
  Lightbulb,
  Loader2
} from "lucide-react"

function RadarTopicDetailContent() {

  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params?.slug as string
  const region = searchParams.get("region") || "IN"

  const [topic, setTopic] = useState<RadarTopicItem | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setIsLoading(true)
    setError(null)
    fetchRadarTopicDetail(slug, region)
      .then((data) => setTopic(data))
      .catch((err) => {
        console.error("Failed to load topic detail:", err)
        setError(`Unable to load intelligence for topic "${slug}".`)
      })
      .finally(() => setIsLoading(false))
  }, [slug, region])

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto py-24 flex flex-col items-center justify-center gap-3 text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-600 dark:text-zinc-300" />
        <p className="text-xs font-medium">Loading market intelligence for {slug}...</p>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-left space-y-4">
        <Link
          href="/dashboard/radar"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Creator Radar
        </Link>
        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">Topic Not Found</h2>
          <p className="text-xs text-zinc-500 mt-1">{error || "No data available for this keyword."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 text-left">
      {/* Breadcrumb back to Radar */}
      <div>
        <Link
          href="/dashboard/radar"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Creator Radar
        </Link>
      </div>

      {/* Header Profile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {topic.category}
            </span>
            <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              Region: {topic.region}
            </span>
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {topic.classification}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            {topic.canonical_name}
          </h1>
        </div>

        {/* Opportunity Score Block */}
        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-center min-w-[120px] shadow-sm">
            <div className="text-2xl sm:text-3xl font-black leading-none">
              {Math.round(topic.opportunity.score)}
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-80 mt-1">
              Opportunity ({topic.opportunity.tier})
            </div>
          </div>
        </div>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400 font-medium">Search Demand</span>
          <div className="text-xl font-extrabold text-zinc-900 dark:text-white">
            {Math.round(topic.metrics.demand)} <span className="text-xs text-zinc-400 font-normal">/ 100</span>
          </div>
          <span className="text-[11px] text-zinc-500">
            {topic.metrics.demand >= 70 ? "Elevated Interest" : "Moderate Interest"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400 font-medium">Momentum</span>
          <div
            className={`text-xl font-extrabold flex items-center gap-1 ${
              topic.metrics.momentum >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {topic.metrics.momentum > 0 ? `+${topic.metrics.momentum}%` : `${topic.metrics.momentum}%`}
          </div>
          <span className="text-[11px] text-zinc-500">vs historical baseline</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400 font-medium">Freshness Index</span>
          <div className="text-xl font-extrabold text-zinc-900 dark:text-white">
            {Math.round(topic.metrics.freshness)} <span className="text-xs text-zinc-400 font-normal">/ 100</span>
          </div>
          <span className="text-[11px] text-zinc-500">
            {topic.metrics.freshness >= 75 ? "Recent Peak" : "Matured Trajectory"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400 font-medium">Creator Saturation</span>
          <div className="text-xl font-extrabold text-zinc-900 dark:text-white">
            {Math.round(topic.metrics.saturation)} <span className="text-xs text-zinc-400 font-normal">/ 100</span>
          </div>
          <span className="text-[11px] text-zinc-500">
            {topic.metrics.saturation >= 65 ? "High Supply" : "Low Competition"}
          </span>
        </div>
      </div>

      {/* Strategic Intelligence Narrative */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Why This Matters</h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {topic.why_this_matters}
          </p>
        </div>

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">
            <Lightbulb className="w-4 h-4" />
            <span>Recommended Creator Opportunity</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">
            {topic.creator_opportunity}
          </p>
        </div>
      </div>

      {/* Provenance & Evidence Details */}
      <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs space-y-3">
        <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-white">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Deterministic Opportunity Evidence Trail
          </span>
          <span className="font-mono text-[11px] text-zinc-400">Model: {topic.opportunity.model_version}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-zinc-500 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <span>Demand Component:</span>
            <p className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
              +{topic.opportunity.evidence.demand_component}
            </p>
          </div>
          <div>
            <span>Momentum Component:</span>
            <p className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
              +{topic.opportunity.evidence.momentum_component}
            </p>
          </div>
          <div>
            <span>Freshness Component:</span>
            <p className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
              +{topic.opportunity.evidence.freshness_component}
            </p>
          </div>
          <div>
            <span>Saturation Factor:</span>
            <p className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
              {topic.opportunity.evidence.saturation_discount}x
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <span>Data Provider: {topic.data_source}</span>
          <span>Measured: {new Date(topic.captured_at).toLocaleString()}</span>
        </div>
      </div>

      {/* Action Bridge: Build Video Idea */}
      <div className="pt-2">
        <Link
          href={`/dashboard?topic=${encodeURIComponent(topic.canonical_name)}&title=${encodeURIComponent(topic.canonical_name)}`}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-sm hover:opacity-90 transition shadow-sm"
        >
          <span>Build Video Idea for {topic.canonical_name}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

export default function RadarTopicDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <RadarTopicDetailContent />
    </Suspense>
  )
}

