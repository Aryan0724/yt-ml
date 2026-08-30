"use client"

import React, { useState } from "react"
import { Sparkles, Globe, Search, ArrowRight, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react"
import { fetchTopicIntelligence } from "@/lib/api/analysis"
import { TopicIntelligence } from "@/lib/types/analysis"
import { TopicIntelligenceView } from "@/components/dashboard/topic-intelligence-view"

const REGIONS = [
  { code: "IN", label: "India (IN)" },
  { code: "US", label: "United States (US)" },
  { code: "GB", label: "United Kingdom (GB)" },
  { code: "CA", label: "Canada (CA)" },
  { code: "AU", label: "Australia (AU)" },
  { code: "GLOBAL", label: "Worldwide (Global)" }
]

export default function TopicExplorerPage() {
  const [query, setQuery] = useState("")
  const [region, setRegion] = useState("IN")
  const [period, setPeriod] = useState("12m")
  const [isLoading, setIsLoading] = useState(false)
  const [topicResult, setTopicResult] = useState<TopicIntelligence | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchTopicIntelligence(query.trim(), region, period)
      setTopicResult(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch topic momentum")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 text-left pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Topic Intelligence Explorer
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Explore real YouTube search demand velocity, momentum, and seasonality before scripting your next video.
        </p>
      </div>

      {/* Search Input Card */}
      <form onSubmit={handleSearch} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a topic or niche (e.g. AI Agents, GTA 6, Personal Finance)"
              className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none cursor-pointer"
            >
              {REGIONS.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="min-h-[48px] px-6 rounded-2xl bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shrink-0"
            >
              {isLoading ? "Searching..." : "Explore"}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}
      </form>

      {/* Topic Result View */}
      {topicResult && (
        <div className="animate-fade-in">
          <TopicIntelligenceView topicData={topicResult} />
        </div>
      )}
    </div>
  )
}
