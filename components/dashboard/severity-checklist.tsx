"use client"

import React from "react"
import { VisualImprovement, OptimizationStep } from "@/lib/types/analysis"
import { CheckCircle2, AlertTriangle, AlertCircle, Wrench } from "lucide-react"

export interface SeverityChecklistProps {
  improvements?: VisualImprovement[]
  optimizationPlan?: OptimizationStep[]
}

export function SeverityChecklist({
  improvements = [],
  optimizationPlan = []
}: SeverityChecklistProps) {
  // If optimization plan from AI is present, combine or map it cleanly
  const hasImprovements = improvements.length > 0
  const hasPlan = optimizationPlan.length > 0

  if (!hasImprovements && !hasPlan) return null

  const getTierBadge = (tierStr: string = "") => {
    const t = tierStr.toLowerCase()
    if (t.includes("critical") || t.includes("1") || t.includes("high")) {
      return {
        label: "Critical Priority",
        color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
      }
    }
    if (t.includes("important") || t.includes("2") || t.includes("medium")) {
      return {
        label: "Important Optimization",
        color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
      }
    }
    return {
      label: "Polish Improvement",
      color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
    }
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 text-left">
      <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
        <Wrench className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider">
          Prioritized Optimization Checklist
        </h4>
      </div>

      <div className="space-y-3.5">
        {hasImprovements
          ? improvements.map((item, idx) => {
              const badge = getTierBadge(item.tier || item.priority)
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      {item.title}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {item.recommended && (
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                      <span className="text-zinc-400 font-bold uppercase text-[10px] mr-1">
                        Recommended:
                      </span>
                      {item.recommended}
                    </p>
                  )}

                  {item.current && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="text-zinc-400 font-bold uppercase text-[10px] mr-1">
                        Current:
                      </span>
                      {item.current}
                    </p>
                  )}

                  {item.why && (
                    <p className="text-[11px] text-zinc-400 italic pt-1">
                      &ldquo;{item.why}&rdquo;
                    </p>
                  )}
                </div>
              )
            })
          : optimizationPlan.map((step, idx) => {
              const badge = getTierBadge(String(step.priority))
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      Step #{step.priority}: {step.action}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {step.rationale && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-300">
                      {step.rationale}
                    </p>
                  )}
                </div>
              )
            })}
      </div>
    </div>
  )
}
