"use client"

import React from "react"
import { Loader2, Sparkles, Layers } from "lucide-react"

export function AnalysisLoading() {
  return (
    <div className="w-full max-w-xl mx-auto py-16 px-6 text-center space-y-6 animate-fade-in">
      <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-zinc-900/5 dark:bg-white/5 animate-pulse" />
        <Loader2 className="w-8 h-8 text-zinc-900 dark:text-white animate-spin" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Evaluating Video Package
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Decoding visual stopping power, calculating curiosity triggers, and searching topic momentum...
        </p>
      </div>

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-xs font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span>One unified decision model</span>
      </div>
    </div>
  )
}
