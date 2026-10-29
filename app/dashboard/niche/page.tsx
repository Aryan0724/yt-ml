"use client"

import React, { useState } from "react"
import {
  TrendingUp,
  Search,
  Zap,
  BarChart2,
  Target,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Flame,
  Eye,
  Copy,
  CheckCircle,
  RefreshCw
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// ─── Types ────────────────────────────────────────────────────────────────────

interface OutlierVideo {
  video_id: string
  title: string
  channel_name: string
  channel_avg_views: number
  video_views: number
  outlier_ratio: number
  thumbnail_url: string
  published_at: string
  packaging_signals: string[]
}

interface NichePattern {
  formula_types: string[]
  avg_title_length: number
  common_power_words: string[]
  number_usage_pct: number
}

interface OutlierData {
  niche: string
  total_scanned: number
  outliers: OutlierVideo[]
  niche_patterns: NichePattern
  top_formats: string[]
  is_demo_mode?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

function getRatioLabel(ratio: number): { label: string; color: string; bg: string } {
  if (ratio >= 10) return { label: "Viral Anomaly", color: "text-red-400", bg: "bg-red-900/30" }
  if (ratio >= 5) return { label: "Major Breakout", color: "text-orange-400", bg: "bg-orange-900/30" }
  return { label: "Outlier", color: "text-yellow-400", bg: "bg-yellow-900/30" }
}

const NICHE_SUGGESTIONS = [
  "Finance", "Cooking", "Gaming", "Tech", "Fitness", "True Crime",
  "History", "Anime", "Personal Finance", "AI & Productivity"
]

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NicheIntelligencePage() {
  const [niche, setNiche] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<OutlierData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const handleSearch = async (searchNiche?: string) => {
    const q = searchNiche || niche
    if (!q.trim()) return
    setNiche(q)
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const res = await fetch(`/api/creator/outlier?niche=${encodeURIComponent(q)}&limit=10`)
      const json = await res.json()
      if (!res.ok || json.error) {
        setError(json.error || "Failed to fetch niche data")
      } else {
        setData(json.data)
      }
    } catch (e) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const copyTitle = (title: string, idx: number) => {
    navigator.clipboard.writeText(title)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Niche Outlier Intelligence</h1>
            <p className="text-sm text-zinc-400">Discover what's breaking through in your niche right now</p>
          </div>
        </div>
        <div className="text-xs text-zinc-500 bg-zinc-900 rounded-lg p-3 border border-zinc-800 flex gap-2">
          <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-zinc-300">How it works:</strong>{" "}
            PreYT scans YouTube for videos that dramatically outperformed their channel's average.
            An <strong className="text-yellow-400">Outlier Ratio of 3×+</strong> means the packaging
            (title + thumbnail concept) drove abnormal views — this is your ground truth for what works RIGHT NOW.
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="bg-zinc-900 border-zinc-800 p-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter a niche (e.g. cooking, finance, gaming AI...)"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <Button
            onClick={() => handleSearch()}
            disabled={loading || !niche.trim()}
            className="bg-orange-600 hover:bg-orange-500 text-white px-5 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            {loading ? "Scanning..." : "Find Outliers"}
          </Button>
        </div>
        {/* Quick niche suggestions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {NICHE_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSearch(s)}
              className="text-xs px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 hover:border-orange-500 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      {/* Error state */}
      {error && (
        <Card className="bg-red-950/30 border-red-900 p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </Card>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-6">
          {/* Demo mode notice */}
          {data.is_demo_mode && (
            <div className="flex items-center gap-2 text-xs text-yellow-500 bg-yellow-950/30 border border-yellow-900 rounded-lg px-4 py-2">
              <AlertTriangle className="w-4 h-4" />
              Demo mode — add YouTube API key to enable live outlier scanning
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Videos Scanned", value: data.total_scanned.toLocaleString(), icon: Eye, color: "text-blue-400" },
              { label: "Outliers Found", value: data.outliers.length, icon: Flame, color: "text-orange-400" },
              { label: "Top Outlier Ratio", value: `${data.outliers[0]?.outlier_ratio.toFixed(1)}×`, icon: TrendingUp, color: "text-green-400" },
              { label: "Number Title %", value: `${data.niche_patterns.number_usage_pct}%`, icon: Target, color: "text-purple-400" }
            ].map(({ label, value, icon: Icon, color }) => (
              <Card key={label} className="bg-zinc-900 border-zinc-800 p-4 text-center">
                <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
              </Card>
            ))}
          </div>

          {/* Niche Patterns — what formulas are dominating */}
          <Card className="bg-zinc-900 border-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-orange-400" />
              Dominant Packaging Formulas in <span className="text-orange-400 capitalize ml-1">{data.niche}</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500 mb-2">Title Formula Types</p>
                <div className="flex flex-wrap gap-2">
                  {data.niche_patterns.formula_types.map((f) => (
                    <span key={f} className="text-xs bg-orange-900/30 border border-orange-800 text-orange-300 px-2.5 py-1 rounded-full">{f}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-2">Power Words in Winning Titles</p>
                <div className="flex flex-wrap gap-2">
                  {data.niche_patterns.common_power_words.map((w) => (
                    <span key={w} className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2.5 py-1 rounded-full">{w}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 mb-2">Top Thumbnail Formats Working Right Now</p>
              <div className="space-y-1.5">
                {data.top_formats.map((fmt, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <ChevronRight className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    <span>{fmt}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Outlier Videos List */}
          <div>
            <h2 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-400" />
              Outlier Videos — Sorted by Overperformance Ratio
            </h2>
            <div className="space-y-3">
              {data.outliers.map((vid, idx) => {
                const ratioInfo = getRatioLabel(vid.outlier_ratio)
                return (
                  <Card key={vid.video_id} className="bg-zinc-900 border-zinc-800 p-4 hover:border-zinc-700 transition-colors">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 relative">
                        {vid.thumbnail_url ? (
                          <img
                            src={vid.thumbnail_url}
                            alt={vid.title}
                            className="w-32 h-[72px] object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-32 h-[72px] bg-zinc-800 rounded-lg flex items-center justify-center">
                            <Eye className="w-6 h-6 text-zinc-600" />
                          </div>
                        )}
                        {/* Rank badge */}
                        <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                          {idx + 1}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium text-white leading-snug line-clamp-2">{vid.title}</p>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => copyTitle(vid.title, idx)}
                              className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
                              title="Copy title"
                            >
                              {copiedIdx === idx
                                ? <CheckCircle className="w-4 h-4 text-green-400" />
                                : <Copy className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
                              }
                            </button>
                            {vid.video_id && (
                              <a
                                href={`https://youtube.com/watch?v=${vid.video_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
                              >
                                <ExternalLink className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-500 mb-2">{vid.channel_name}</p>

                        {/* Stats row */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${ratioInfo.bg} ${ratioInfo.color} border-current/30`}>
                            {vid.outlier_ratio.toFixed(1)}× {ratioInfo.label}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {formatViews(vid.video_views)} views vs {formatViews(vid.channel_avg_views)} avg
                          </span>
                        </div>

                        {/* Packaging signals */}
                        {vid.packaging_signals.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {vid.packaging_signals.map((sig, si) => (
                              <span key={si} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                                {sig}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!data && !loading && !error && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-400 mb-2">Discover What's Breaking Through</h3>
          <p className="text-sm text-zinc-600 max-w-sm mx-auto">
            Type a niche above and PreYT will scan YouTube to find which packaging formats are generating
            abnormal views compared to channel baselines — your cheat code for what to make next.
          </p>
        </div>
      )}
    </div>
  )
}
