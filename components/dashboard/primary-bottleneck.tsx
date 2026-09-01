"use client"

import React from "react"
import { MasterReport } from "@/lib/types/analysis"
import { Zap, Target } from "lucide-react"
import { Card } from "@/components/ui/card"

export interface PrimaryBottleneckProps {
  masterReport?: MasterReport
}

export function PrimaryBottleneck({ masterReport }: PrimaryBottleneckProps) {
  if (!masterReport) return null

  const bottleneck = masterReport.primary_bottleneck
  const diagnosis = masterReport.diagnosis
  const topAction = masterReport.optimization_plan?.[0]

  return (
    <Card className="p-6 sm:p-8 space-y-6 relative overflow-hidden bg-destructive/5 border-destructive/20">
      {/* Header Tag */}
      <div className="flex items-center gap-2 text-destructive">
        <Target className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-widest">
          #1 Primary Bottleneck
        </span>
      </div>

      {/* Main Bottleneck Title */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {bottleneck || diagnosis?.root_cause || "Visual focus and contrast optimization required"}
        </h3>
        {diagnosis?.expected_consequence && (
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {diagnosis.expected_consequence}
          </p>
        )}
      </div>

      {/* Root Cause & Top Recommended Change */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-destructive/10">
        {/* Diagnosis Proof */}
        {diagnosis?.evidence && (
          <div className="p-4 rounded-xl bg-background border space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">
              Detected Proof
            </span>
            <p className="text-xs font-medium text-foreground leading-relaxed">
              {diagnosis.evidence}
            </p>
          </div>
        )}

        {/* Top Immediate Action */}
        {topAction && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
            <span className="text-[10px] uppercase font-bold text-primary block tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3" /> Immediate Fix
            </span>
            <p className="text-xs font-semibold text-foreground leading-relaxed">
              {topAction.action}
            </p>
            {topAction.rationale && (
              <p className="text-[11px] text-muted-foreground mt-1">
                {topAction.rationale}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
