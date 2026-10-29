"use client"

import React, { useState } from "react"
import { Sparkles, Copy, Check, Flame, AlertCircle, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

export interface TitleHookFormula {
  category: "Curiosity Loop" | "Negative Urgency" | "Transformation Proof"
  title: string
  character_count: number
  safe_mobile: boolean
  predicted_hook_lift: string
  why_it_works: string
}

export interface HookStudioProps {
  currentTitle: string
  archetypeName?: string
  suggestedAngles?: { angle: string; reason: string }[]
}

export function HookStudio({
  currentTitle,
  archetypeName = "General Hybrid",
  suggestedAngles = []
}: HookStudioProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  // Generate 3 formulaic titles based on the creator's current concept
  const cleanTitle = currentTitle.replace(/^(how to|why|the)\s+/i, "").replace(/[!?.]+$/, "")

  const formulas: TitleHookFormula[] = [
    {
      category: "Curiosity Loop",
      title: `The Real Reason ${cleanTitle || "This Strategy"} Actually Works`,
      character_count: `The Real Reason ${cleanTitle || "This Strategy"} Actually Works`.length,
      safe_mobile: `The Real Reason ${cleanTitle || "This Strategy"} Actually Works`.length <= 55,
      predicted_hook_lift: "+18% CTR",
      why_it_works: "Establishes an open information loop by implying standard wisdom is incomplete."
    },
    {
      category: "Negative Urgency",
      title: `Stop Doing This With ${cleanTitle || "Your Content"} (Before It's Too Late)`,
      character_count: `Stop Doing This With ${cleanTitle || "Your Content"} (Before It's Too Late)`.length,
      safe_mobile: `Stop Doing This With ${cleanTitle || "Your Content"} (Before It's Too Late)`.length <= 55,
      predicted_hook_lift: "+24% CTR",
      why_it_works: "Loss aversion triggers instant clicks faster than positive gains."
    },
    {
      category: "Transformation Proof",
      title: `How I Mastered ${cleanTitle || "This System"} in 30 Days (Step-by-Step)`,
      character_count: `How I Mastered ${cleanTitle || "This System"} in 30 Days (Step-by-Step)`.length,
      safe_mobile: `How I Mastered ${cleanTitle || "This System"} in 30 Days (Step-by-Step)`.length <= 55,
      predicted_hook_lift: "+14% CTR",
      why_it_works: "Specific timeframes and tangible results establish high perceived value."
    }
  ]

  const handleCopy = (text: string, idx: number) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    }
  }

  return (
    <Card className="p-6 border bg-card text-card-foreground space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-bold text-foreground">
              Alternative High-Converting Title Hooks
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Calibrated for {archetypeName} packaging to maximize mobile browse feed click rates.
          </p>
        </div>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {formulas.map((formula, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border bg-muted/20 hover:border-primary/40 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded-md bg-background border">
                  {formula.category}
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {formula.predicted_hook_lift}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-foreground leading-snug">
                "{formula.title}"
              </h4>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {formula.why_it_works}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
              <span className={`font-mono font-medium ${formula.safe_mobile ? "text-muted-foreground" : "text-amber-600 font-bold"}`}>
                {formula.character_count} chars {formula.safe_mobile ? "(Safe)" : "(Cutoff)"}
              </span>

              <button
                type="button"
                onClick={() => handleCopy(formula.title, idx)}
                className="px-2.5 py-1 rounded-md bg-background border hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedIdx === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
