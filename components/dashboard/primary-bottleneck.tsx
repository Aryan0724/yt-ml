"use client"

import React from "react"
import { MasterReport } from "@/lib/types/analysis"
import { AlertCircle, ArrowRight, Zap, Target } from "lucide-react"

export interface PrimaryBottleneckProps {
  masterReport?: MasterReport
}

export function PrimaryBottleneck({ masterReport }: PrimaryBottleneckProps) {
  if (!masterReport) return null

  const bottleneck = masterReport.primary_bottleneck
  const diagnosis = masterReport.diagnosis
  const topAction = masterReport.optimization_plan?.[0]

  return (
    <div className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden text-left space-y-6">
      {/* Subtle background highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header Tag */}
      <div className="flex items-center gap-2 text-rose-400">
        <Target className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-widest">
          #1 Primary Bottleneck
        </span>
      </div>

      {/* Main Bottleneck Title */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {bottleneck || diagnosis?.root_cause || "Visual focus and contrast optimization required"}
        </h3>
        {diagnosis?.expected_consequence && (
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed">
            {diagnosis.expected_consequence}
          </p>
        )}
      </div>

      {/* Root Cause & Top Recommended Change */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/80">
        {/* Diagnosis Proof */}
        {diagnosis?.evidence && (
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
              Detected Proof
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {diagnosis.evidence}
            </p>
          </div>
        )}

        {/* Top Immediate Action */}
        {topAction && (
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-300 block tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-indigo-400" /> Immediate Fix
            </span>
            <p className="text-xs font-semibold text-indigo-100 leading-relaxed">
              {topAction.action}
            </p>
            {topAction.rationale && (
              <p className="text-[11px] text-indigo-300/80 mt-1">
                {topAction.rationale}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
