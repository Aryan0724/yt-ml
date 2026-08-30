"use client"

import React from "react"
import { Globe, RefreshCw, ShieldCheck, ChevronDown } from "lucide-react"
import { RadarRegion } from "@/lib/api/radar"

interface RadarHeaderProps {
  regions: RadarRegion[]
  selectedRegion: string
  onSelectRegion: (code: string) => void
  categories: string[]
  selectedCategory: string
  onSelectCategory: (cat: string) => void
  onRefresh: () => void
  isLoading: boolean
  lastUpdated?: string
}

export function RadarHeader({
  regions,
  selectedRegion,
  onSelectRegion,
  categories,
  selectedCategory,
  onSelectCategory,
  onRefresh,
  isLoading,
  lastUpdated
}: RadarHeaderProps) {
  const currentRegion = regions.find((r) => r.code === selectedRegion) || {
    code: selectedRegion,
    name: selectedRegion,
    flag: "🌐"
  }

  return (
    <div className="space-y-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
      {/* Top row: Title, Region dropdown, Provenance badge, Refresh button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Live Intelligence
            </span>
            <span className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Model 2026-v1 • Real Trends
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1">
            Creator Radar
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            What search topics are accelerating right now, why they matter, and what you can create.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Region Dropdown */}
          <div className="relative inline-block text-left">
            <select
              value={selectedRegion}
              onChange={(e) => onSelectRegion(e.target.value)}
              className="appearance-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold text-xs sm:text-sm py-2 pl-3 pr-8 rounded-xl cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
              aria-label="Select Market Region"
            >
              {regions.map((reg) => (
                <option key={reg.code} value={reg.code}>
                  {reg.flag} {reg.name} ({reg.code})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition shadow-sm disabled:opacity-50"
            title="Refresh Feed"
            aria-label="Refresh Feed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-zinc-900 dark:text-white" : ""}`} />
          </button>
        </div>
      </div>

      {/* Categories Horizontal Scroll Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-semibold"
                  : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>
    </div>
  )
}
