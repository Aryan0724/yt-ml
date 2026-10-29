"use client"

import React from "react"
import { ShieldAlert, Sparkles, Fingerprint, Info, CheckCircle2, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ThumbnailOriginalityInfo } from "@/lib/types/analysis"

interface OriginalityCardProps {
  originality?: ThumbnailOriginalityInfo
}

export function OriginalityCard({ originality }: OriginalityCardProps) {
  if (!originality) return null

  const {
    originality_score = 75,
    similarity_risk = "LOW",
    detected_formula = "Custom Composition",
    saturation_level = "Balanced",
    formula_description,
    recommendation,
    niche_context
  } = originality

  const isLowRisk = similarity_risk.toUpperCase().includes("LOW")
  const isHighRisk = similarity_risk.toUpperCase().includes("HIGH")

  const scoreColor = originality_score >= 80 ? "text-emerald-400" : originality_score >= 60 ? "text-amber-400" : "text-rose-400"
  const barColor = originality_score >= 80 ? "bg-emerald-500" : originality_score >= 60 ? "bg-amber-500" : "bg-rose-500"

  return (
    <Card className="bg-zinc-900 border-zinc-800 p-5 rounded-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-950/40 border border-orange-800/60 flex items-center justify-center">
            <Fingerprint className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              Thumbnail Originality & Formula Saturation
              <span className="text-[10px] font-medium bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">
                pHash Engine
              </span>
            </h3>
            <p className="text-xs text-zinc-500">{niche_context || "Perceptual similarity vs top niche competitors"}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
          isLowRisk 
            ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/60" 
            : isHighRisk 
            ? "bg-rose-950/40 text-rose-400 border-rose-800/60" 
            : "bg-amber-950/40 text-amber-400 border-amber-800/60"
        }`}>
          {isLowRisk ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          <span>{similarity_risk}</span>
        </div>
      </div>

      {/* Score & Formula Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Originality Score Gauge */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Originality Index</span>
            <span className="text-[10px] text-zinc-500">Unique / 100</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${scoreColor}`}>{originality_score}</span>
            <span className="text-xs text-zinc-500">/ 100</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${originality_score}%` }} />
          </div>
        </div>

        {/* Detected Visual Trope */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3 col-span-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Detected Packaging Trope</span>
            <span className="text-[10px] font-medium text-orange-400/90">{saturation_level}</span>
          </div>
          <p className="text-sm font-semibold text-zinc-200">{detected_formula}</p>
          {formula_description && (
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{formula_description}</p>
          )}
        </div>
      </div>

      {/* Creative Counter-Positioning Recommendation */}
      {recommendation && (
        <div className="bg-orange-950/20 border border-orange-900/40 rounded-lg p-3.5 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300 leading-relaxed">
            <strong className="text-orange-300 font-semibold">Feed Clashing Recommendation: </strong>
            {recommendation}
          </div>
        </div>
      )}
    </Card>
  )
}
