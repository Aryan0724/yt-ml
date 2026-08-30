"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { History, ArrowRight, Clock, Trash2, BarChart2 } from "lucide-react"
import { AnalysisResult } from "@/lib/types/analysis"

interface HistoryItem {
  id: string
  score: number
  tier: string
  timestamp: number
}

export default function AnalysisHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    try {
      const recentKey = "preyt_recent_analyses"
      const raw = sessionStorage.getItem(recentKey)
      if (raw) {
        setHistory(JSON.parse(raw))
      }
    } catch (e) {
      console.warn("Could not load history", e)
    }
  }, [])

  const clearHistory = () => {
    sessionStorage.removeItem("preyt_recent_analyses")
    setHistory([])
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 text-left pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Analysis History
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Review past video package decisions from this session.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* History List */}
      {history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {history.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/analysis/${item.id}`}
              className="p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-sm flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-zinc-900 dark:text-white">
                    {item.score}
                  </span>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    / 100 (Tier {item.tier})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-950 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            No Recent Analyses Found
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            Analyses you run in this session will appear here for quick reference and comparison.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold"
            >
              <span>Analyze a Video Package</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
