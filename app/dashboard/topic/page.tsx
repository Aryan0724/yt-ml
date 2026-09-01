"use client"

import React, { useState } from "react"
import { Search } from "lucide-react"
import { fetchTopicIntelligence } from "@/lib/api/analysis"
import { TopicIntelligence } from "@/lib/types/analysis"
import { TopicIntelligenceView } from "@/components/dashboard/topic-intelligence-view"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Topic Intelligence Explorer
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Explore real YouTube search demand velocity, momentum, and seasonality before scripting your next video.
        </p>
      </div>

      {/* Search Input Card */}
      <Card className="p-6 sm:p-8 space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a topic or niche (e.g. AI Agents, GTA 6, Personal Finance)"
              className="pl-11 h-12 bg-muted/30 border-border text-sm"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="px-4 h-12 bg-muted/30 border border-border rounded-xl text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
            >
              {REGIONS.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.label}
                </option>
              ))}
            </select>

            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-wider min-w-[100px]"
            >
              {isLoading ? "Searching..." : "Explore"}
            </Button>
          </div>
        </form>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive">
            {error}
          </div>
        )}
      </Card>

      {/* Topic Result View */}
      {topicResult && (
        <div className="animate-in fade-in duration-300">
          <TopicIntelligenceView topicData={topicResult} />
        </div>
      )}
    </div>
  )
}
