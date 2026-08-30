"use client"

import React from "react"
import { Flame, TrendingUp, Sparkles, Gem, AlertTriangle, ListFilter } from "lucide-react"
import { RadarSummary } from "@/lib/api/radar"

interface RadarSummaryStripProps {
  summary: RadarSummary | null
  activeClassification: string
  onSelectClassification: (cls: string) => void
}

export function RadarSummaryStrip({
  summary,
  activeClassification,
  onSelectClassification
}: RadarSummaryStripProps) {
  const items = [
    {
      id: "ALL",
      label: "All Topics",
      count: summary?.total_tracked ?? 0,
      icon: ListFilter,
      color: "text-zinc-600 dark:text-zinc-400"
    },
    {
      id: "BREAKING",
      label: "Breaking",
      count: summary?.breaking_count ?? 0,
      icon: Flame,
      color: "text-rose-500"
    },
    {
      id: "RISING",
      label: "Rising",
      count: summary?.rising_count ?? 0,
      icon: TrendingUp,
      color: "text-emerald-500"
    },
    {
      id: "OPPORTUNITY",
      label: "Opportunities",
      count: summary?.opportunity_count ?? 0,
      icon: Gem,
      color: "text-violet-500"
    },
    {
      id: "TRENDING",
      label: "Trending",
      count: summary?.trending_count ?? 0,
      icon: Sparkles,
      color: "text-amber-500"
    },
    {
      id: "SATURATING",
      label: "Saturating",
      count: summary?.saturating_count ?? 0,
      icon: AlertTriangle,
      color: "text-orange-500"
    }
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      {items.map((item) => {
        const isActive = activeClassification === item.id
        const Icon = item.icon
        return (
          <button
            key={item.id}
            onClick={() => onSelectClassification(item.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              isActive
                ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950 shadow-sm"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-inherit" : item.color}`} />
            <span>{item.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                isActive
                  ? "bg-white/20 dark:bg-zinc-900/20 text-inherit"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {item.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
