"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Flame,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Gem,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Lightbulb,
  Info,
  ShieldCheck
} from "lucide-react"
import { RadarTopicItem } from "@/lib/api/radar"

interface OpportunityCardProps {
  item: RadarTopicItem
}

export function OpportunityCard({ item }: OpportunityCardProps) {
  const [showEvidence, setShowEvidence] = useState(false)

  // Classification styling
  const getClassificationBadge = (cls: string) => {
    switch (cls) {
      case "BREAKING":
        return {
          bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          icon: Flame,
          label: "Breaking Surge"
        }
      case "RISING":
        return {
          bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          icon: TrendingUp,
          label: "Rising"
        }
      case "OPPORTUNITY":
        return {
          bg: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
          icon: Gem,
          label: "High Opportunity"
        }
      case "TRENDING":
        return {
          bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          icon: Sparkles,
          label: "Trending"
        }
      case "SATURATING":
        return {
          bg: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
          icon: AlertTriangle,
          label: "Saturating"
        }
      case "COOLING":
        return {
          bg: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
          icon: TrendingDown,
          label: "Cooling"
        }
      default:
        return {
          bg: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
          icon: Info,
          label: "Stable"
        }
    }
  }

  const badge = getClassificationBadge(item.classification)
  const BadgeIcon = badge.icon

  // Opportunity tier color
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    if (score >= 50) return "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
    return "text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
  }

  // Generate SVG path for sparkline
  const renderSparkline = (points: number[]) => {
    if (!points || points.length < 2) return null
    const width = 120
    const height = 36
    const minVal = Math.min(...points)
    const maxVal = Math.max(...points)
    const range = maxVal - minVal || 1

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width
      const y = height - ((val - minVal) / range) * (height - 6) - 3
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })

    const pathData = `M ${coords.join(" L ")}`
    const isRising = item.metrics.momentum >= 0

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-24 sm:w-28 h-8 overflow-visible shrink-0"
        aria-hidden="true"
      >
        <path
          d={pathData}
          fill="none"
          stroke={isRising ? "#10b981" : "#f43f5e"}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition shadow-sm space-y-4 text-left">
      {/* Header: Title, Category, Classification & Sparkline */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {item.category}
            </span>
            <span
              className={`flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-md border ${badge.bg}`}
            >
              <BadgeIcon className="w-3 h-3" />
              {badge.label}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white leading-snug">
            {item.canonical_name}
          </h2>
        </div>

        {/* Sparkline & Score */}
        <div className="flex items-center gap-3 self-end sm:self-start">
          {renderSparkline(item.sparkline)}
          <div
            className={`px-3 py-1.5 rounded-xl border text-center font-extrabold text-xs sm:text-sm ${getScoreColor(
              item.opportunity.score
            )}`}
          >
            <div className="leading-none">{Math.round(item.opportunity.score)}</div>
            <div className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">
              {item.opportunity.tier}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
        <div>
          <span className="text-zinc-400 text-[11px]">Demand</span>
          <p className="font-semibold text-zinc-800 dark:text-zinc-200">
            {item.metrics.demand >= 70 ? "High" : item.metrics.demand >= 40 ? "Moderate" : "Low"} ({Math.round(item.metrics.demand)})
          </p>
        </div>
        <div>
          <span className="text-zinc-400 text-[11px]">Momentum</span>
          <p
            className={`font-semibold flex items-center gap-0.5 ${
              item.metrics.momentum >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {item.metrics.momentum >= 0 ? "↑" : "↓"} {item.metrics.momentum > 0 ? `+${item.metrics.momentum}%` : `${item.metrics.momentum}%`}
          </p>
        </div>
        <div>
          <span className="text-zinc-400 text-[11px]">Freshness</span>
          <p className="font-semibold text-zinc-800 dark:text-zinc-200">
            {item.metrics.freshness >= 75 ? "Recent Peak" : item.metrics.freshness >= 45 ? "Sustained" : "Matured"}
          </p>
        </div>
        <div>
          <span className="text-zinc-400 text-[11px]">Saturation</span>
          <p className="font-semibold text-zinc-800 dark:text-zinc-200">
            {item.metrics.saturation >= 65 ? "High Supply" : item.metrics.saturation >= 40 ? "Moderate" : "Low (Blue Ocean)"}
          </p>
        </div>
      </div>

      {/* Why it Matters & Creator Opportunity */}
      <div className="space-y-2 text-xs bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <span className="font-bold text-zinc-700 dark:text-zinc-300">Why this matters: </span>
          <span className="text-zinc-600 dark:text-zinc-400">{item.why_this_matters}</span>
        </div>
        <div>
          <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-0.5">
            <Lightbulb className="w-3.5 h-3.5" />
            Creator Opportunity:
          </span>
          <span className="text-zinc-700 dark:text-zinc-300">{item.creator_opportunity}</span>
        </div>
      </div>

      {/* Trust & Provenance Accordion Toggle */}
      <div>
        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium transition"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Why is this classified as {item.classification}?</span>
          {showEvidence ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showEvidence && (
          <div className="mt-2.5 p-3 rounded-xl bg-zinc-100/60 dark:bg-zinc-800/50 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1.5 border border-zinc-200 dark:border-zinc-700/60">
            <div className="flex justify-between">
              <span>Short-term Momentum:</span>
              <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                {item.metrics.momentum > 0 ? `+${item.metrics.momentum}%` : `${item.metrics.momentum}%`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Baseline Interest:</span>
              <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{item.metrics.baseline_value} / 100</span>
            </div>
            <div className="flex justify-between">
              <span>Latest Interest:</span>
              <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{item.metrics.current_value} / 100</span>
            </div>
            <div className="flex justify-between">
              <span>Volatility:</span>
              <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{item.metrics.volatility}</span>
            </div>
            <div className="flex justify-between">
              <span>Opportunity Model:</span>
              <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{item.opportunity.model_version}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-zinc-200 dark:border-zinc-700 text-[10px] text-zinc-400">
              <span>Data Source: {item.data_source}</span>
              <span>Updated: {new Date(item.captured_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Bridge: Explore Topic & Build Video Idea */}
      <div className="flex items-center gap-2 pt-2">
        <Link
          href={`/dashboard/radar/${item.slug}?region=${item.region}`}
          className="flex-1 text-center py-2.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
        >
          Explore Topic
        </Link>
        <Link
          href={`/dashboard?topic=${encodeURIComponent(item.canonical_name)}&title=${encodeURIComponent(item.canonical_name)}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition shadow-sm"
        >
          <span>Build Video Idea</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
