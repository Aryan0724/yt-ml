"use client"

import React from "react"
import { MasterReport, PackagingVerdict } from "@/lib/types/analysis"
import { CheckCircle2, AlertCircle, AlertTriangle, Sparkles } from "lucide-react"

export interface VerdictHeaderProps {
  score: number
  tier: string
  masterReport?: MasterReport
  aiStatus?: string
}

export function VerdictHeader({ score, tier, masterReport, aiStatus }: VerdictHeaderProps) {
  const verdict = masterReport?.packaging_verdict

  const getVerdictBadge = (s: number) => {
    if (s >= 75) {
      return {
        label: "Good to Go",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      }
    }
    if (s >= 60) {
      return {
        label: "Needs Optimization",
        color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
        icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
      }
    }
    return {
      label: "High Scroll Risk",
      color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
      icon: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
    }
  }

  const badge = getVerdictBadge(score)

  const getPillarBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "strong":
        return "bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
      case "moderate":
        return "bg-amber-100/70 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      case "weak":
        return "bg-rose-100/70 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800"
      default:
        return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
    }
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
      
      {/* Top Row: Score + Verdict */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-900">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Package Potential Score
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
              {score}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-zinc-400">/ 100</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-2">
              (Tier {tier})
            </span>
          </div>
        </div>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs sm:text-sm font-bold self-start sm:self-auto ${badge.color}`}>
          {badge.icon}
          <span>{badge.label}</span>
        </div>
      </div>

      {/* AI Fallback Notice if applicable */}
      {aiStatus === "fallback" && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200">
              AI interpretation unavailable
            </h5>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Your core thumbnail and title analysis is still complete. We couldn't generate the additional AI interpretation right now.
            </p>
          </div>
        </div>
      )}

      {/* Summary / Why Statement */}
      {masterReport?.summary && (
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Executive Summary
          </span>
          <p className="text-sm sm:text-base font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
            {masterReport.summary}
          </p>
        </div>
      )}

      {/* Packaging Triad Breakdown */}
      {verdict && (
        <div className="pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-3">
            Packaging Triad Status
          </span>
          <div className="grid grid-cols-3 gap-3">
            {/* Topic Pillar */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Topic Demand
              </span>
              <span
                className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getPillarBadge(
                  verdict.topic_status
                )}`}
              >
                {verdict.topic_status || "Unknown"}
              </span>
            </div>

            {/* Title Pillar */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Title Framing
              </span>
              <span
                className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getPillarBadge(
                  verdict.title_status
                )}`}
              >
                {verdict.title_status || "Moderate"}
              </span>
            </div>

            {/* Thumbnail Pillar */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Thumbnail Stop
              </span>
              <span
                className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getPillarBadge(
                  verdict.thumbnail_status
                )}`}
              >
                {verdict.thumbnail_status || "Moderate"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
