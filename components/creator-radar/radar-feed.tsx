"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  RadarConfig,
  RadarSummary,
  RadarTopicItem,
  fetchRadarConfig,
  fetchRadarSummary,
  fetchRadarTopics
} from "@/lib/api/radar"
import { RadarHeader } from "./radar-header"
import { RadarSummaryStrip } from "./radar-summary-strip"
import { OpportunityCard } from "./opportunity-card"
import { AlertCircle, Sparkles, Loader2 } from "lucide-react"

export function RadarFeed() {
  const [config, setConfig] = useState<RadarConfig | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>("IN")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedClassification, setSelectedClassification] = useState<string>("ALL")
  
  const [summary, setSummary] = useState<RadarSummary | null>(null)
  const [topics, setTopics] = useState<RadarTopicItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // 1. Initial Load of Config
  useEffect(() => {
    fetchRadarConfig()
      .then((cfg) => {
        setConfig(cfg)
        const def = cfg.regions.find((r) => r.default)?.code || "IN"
        setSelectedRegion(def)
      })
      .catch((err) => {
        console.error("Config fetch error:", err)
      })
  }, [])

  // 2. Load Summary & Topics when Region / Category / Classification changes
  const loadFeedData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [sumData, topicsData] = await Promise.all([
        fetchRadarSummary(selectedRegion),
        fetchRadarTopics({
          region: selectedRegion,
          category: selectedCategory,
          classification: selectedClassification,
          limit: 30
        })
      ])
      setSummary(sumData)
      setTopics(topicsData.topics || [])
    } catch (err: any) {
      console.error("Failed to load radar data:", err)
      setError("Unable to connect to Creator Radar service. Please check backend connection.")
    } finally {
      setIsLoading(false)
    }
  }, [selectedRegion, selectedCategory, selectedClassification])

  useEffect(() => {
    loadFeedData()
  }, [loadFeedData])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Configuration-driven Header */}
      <RadarHeader
        regions={
          config?.regions || [
            { code: "IN", name: "India", flag: "🇮🇳", default: true },
            { code: "US", name: "United States", flag: "🇺🇸", default: false },
            { code: "GLOBAL", name: "Worldwide", flag: "🌎", default: false }
          ]
        }
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        categories={
          config?.categories || [
            "All",
            "Technology",
            "AI",
            "Gaming",
            "Entertainment",
            "Business",
            "Finance"
          ]
        }
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onRefresh={loadFeedData}
        isLoading={isLoading}
      />

      {/* Summary Filter Strip */}
      <RadarSummaryStrip
        summary={summary}
        activeClassification={selectedClassification}
        onSelectClassification={setSelectedClassification}
      />

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-600 dark:text-zinc-300" />
          <p className="text-xs font-medium">Measuring search momentum & demand across {selectedRegion}...</p>
        </div>
      ) : topics.length === 0 ? (
        /* Empty state */
        <div className="py-16 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-3">
          <Sparkles className="w-8 h-8 text-zinc-400 mx-auto opacity-60" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            No topics matching criteria
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            No candidate topics met the threshold for {selectedClassification} in {selectedCategory} for {selectedRegion}.
            Try switching to &quot;All Topics&quot; or selecting a broader category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All")
              setSelectedClassification("ALL")
            }}
            className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold rounded-xl hover:opacity-90 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Topic Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((item) => (
            <OpportunityCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
