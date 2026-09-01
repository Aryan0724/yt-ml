"use client"

import React from "react"
import { MasterReport } from "@/lib/types/analysis"
import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      }
    }
    if (s >= 60) {
      return {
        label: "Needs Optimization",
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <AlertTriangle className="w-4 h-4 text-amber-600" />
      }
    }
    return {
      label: "High Scroll Risk",
      color: "bg-destructive/10 text-destructive border-destructive/20",
      icon: <AlertCircle className="w-4 h-4 text-destructive" />
    }
  }

  const badge = getVerdictBadge(score)

  const getPillarBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "strong":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "moderate":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "weak":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      
      {/* Top Row: Score + Verdict */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Package Potential Score
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
              {score}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-muted-foreground">/ 100</span>
            <Badge variant="outline" className="ml-2 uppercase text-[10px]">
              Tier {tier}
            </Badge>
          </div>
        </div>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs sm:text-sm font-bold self-start sm:self-auto ${badge.color}`}>
          {badge.icon}
          <span>{badge.label}</span>
        </div>
      </div>

      {/* AI Fallback Notice if applicable */}
      {aiStatus === "fallback" && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-amber-900">
              AI interpretation unavailable
            </h5>
            <p className="text-xs text-amber-700">
              Your core thumbnail and title analysis is still complete. We couldn't generate the additional AI interpretation right now.
            </p>
          </div>
        </div>
      )}

      {/* Summary / Why Statement */}
      {masterReport?.summary && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Executive Summary
          </span>
          <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
            {masterReport.summary}
          </p>
        </div>
      )}

      {/* Packaging Triad Breakdown */}
      {verdict && (
        <div className="pt-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-3">
            Packaging Triad Status
          </span>
          <div className="grid grid-cols-3 gap-4">
            {/* Topic Pillar */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Topic Demand
              </span>
              <span
                className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getPillarBadge(
                  verdict.topic_status
                )}`}
              >
                {verdict.topic_status || "Unknown"}
              </span>
            </div>

            {/* Title Pillar */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Title Framing
              </span>
              <span
                className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getPillarBadge(
                  verdict.title_status
                )}`}
              >
                {verdict.title_status || "Moderate"}
              </span>
            </div>

            {/* Thumbnail Pillar */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Thumbnail Stop
              </span>
              <span
                className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getPillarBadge(
                  verdict.thumbnail_status
                )}`}
              >
                {verdict.thumbnail_status || "Moderate"}
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
