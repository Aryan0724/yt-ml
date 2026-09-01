"use client"

import React, { useState } from "react"
import { ContentAngle } from "@/lib/types/analysis"
import { Copy, Check, Lightbulb } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface ActionAnglesProps {
  angles?: ContentAngle[]
}

export function ActionAngles({ angles = [] }: ActionAnglesProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  if (!angles || angles.length === 0) return null

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <Card className="p-6 sm:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Lightbulb className="w-4 h-4" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Actionable Framing Angles
          </h4>
        </div>
        <span className="text-[10px] text-muted-foreground uppercase font-semibold">
          1-Click Copy
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        Test these specific angles to align your title framing with audience search demand.
      </p>

      <div className="grid grid-cols-1 gap-3.5">
        {angles.map((item, idx) => {
          const isCopied = copiedIndex === idx
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-muted/30 border hover:border-primary/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <span className="text-sm sm:text-base font-bold text-foreground block">
                  &ldquo;{item.angle}&rdquo;
                </span>
                {item.reason && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.reason}
                  </p>
                )}
              </div>

              <Button
                variant={isCopied ? "default" : "outline"}
                size="sm"
                onClick={() => handleCopy(item.angle, idx)}
                className={`shrink-0 transition-all ${
                  isCopied ? "bg-emerald-600 text-primary-foreground hover:bg-emerald-700" : ""
                }`}
                title="Copy angle to clipboard"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
