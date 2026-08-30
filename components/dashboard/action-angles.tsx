"use client"

import React, { useState } from "react"
import { ContentAngle } from "@/lib/types/analysis"
import { Copy, Check, Sparkles, Lightbulb } from "lucide-react"

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
    <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Lightbulb className="w-4 h-4" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Actionable Framing Angles
          </h4>
        </div>
        <span className="text-[10px] text-zinc-400 uppercase font-semibold">
          1-Click Copy
        </span>
      </div>

      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
        Test these specific angles to align your title framing with audience search demand.
      </p>

      <div className="grid grid-cols-1 gap-3.5">
        {angles.map((item, idx) => {
          const isCopied = copiedIndex === idx
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white block">
                  &ldquo;{item.angle}&rdquo;
                </span>
                {item.reason && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {item.reason}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleCopy(item.angle, idx)}
                className={`px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  isCopied
                    ? "bg-emerald-500 text-white"
                    : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                }`}
                title="Copy angle to clipboard"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
