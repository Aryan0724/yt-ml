"use client"

import React from "react"
import { VisualImprovement, OptimizationStep } from "@/lib/types/analysis"
import { Wrench } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
        variant: "destructive" as const
      }
    }
    if (t.includes("important") || t.includes("2") || t.includes("medium")) {
      return {
        label: "Important Optimization",
        variant: "default" as const
      }
    }
    return {
      label: "Polish Improvement",
      variant: "secondary" as const
    }
  }

  return (
    <Card className="p-6 sm:p-8 space-y-5">
      <div className="flex items-center gap-2 text-foreground">
        <Wrench className="w-4 h-4 text-muted-foreground" />
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
                  className="p-5 rounded-xl bg-muted/30 border space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {item.title}
                    </span>
                    <Badge variant={badge.variant} className="uppercase text-[10px] tracking-wider">
                      {badge.label}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    {item.recommended && (
                      <p className="text-xs text-foreground font-medium">
                        <span className="text-muted-foreground font-bold uppercase text-[10px] mr-1">
                          Recommended:
                        </span>
                        {item.recommended}
                      </p>
                    )}

                    {item.current && (
                      <p className="text-xs text-muted-foreground">
                        <span className="text-muted-foreground font-bold uppercase text-[10px] mr-1">
                          Current:
                        </span>
                        {item.current}
                      </p>
                    )}
                  </div>

                  {item.why && (
                    <p className="text-[11px] text-muted-foreground italic pt-1">
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
                  className="p-5 rounded-xl bg-muted/30 border space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-foreground">
                      Step #{step.priority}: {step.action}
                    </span>
                    <Badge variant={badge.variant} className="uppercase text-[10px] tracking-wider">
                      {badge.label}
                    </Badge>
                  </div>

                  {step.rationale && (
                    <p className="text-xs text-muted-foreground">
                      {step.rationale}
                    </p>
                  )}
                </div>
              )
            })}
      </div>
    </Card>
  )
}
