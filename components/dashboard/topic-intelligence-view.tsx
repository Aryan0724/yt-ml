"use client"

import React from "react"
import { TopicIntelligence } from "@/lib/types/analysis"
import { TrendingUp, TrendingDown, Minus, Sparkles, AlertCircle, Globe } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface TopicIntelligenceViewProps {
  topicData?: TopicIntelligence
}

export function TopicIntelligenceView({ topicData }: TopicIntelligenceViewProps) {
  if (!topicData) return null

  const isSuccess = topicData.status === "success" && topicData.time_series?.length > 0
  const metrics = topicData.metrics

  const getMomentumIcon = (label?: string) => {
    switch (label?.toLowerCase()) {
      case "rising":
        return <TrendingUp className="w-4 h-4 text-emerald-600" />
      case "falling":
        return <TrendingDown className="w-4 h-4 text-destructive" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  // Generate clean SVG sparkline path from time_series points
  const renderSparkline = () => {
    const points = topicData.time_series || []
    if (points.length < 2) return null

    const width = 500
    const height = 120
    const padding = 10

    const maxVal = Math.max(...points.map((p) => p.value), 100)
    const minVal = 0

    const coords = points.map((p, idx) => {
      const x = padding + (idx / (points.length - 1)) * (width - 2 * padding)
      const y = height - padding - ((p.value - minVal) / (maxVal - minVal)) * (height - 2 * padding)
      return `${x},${y}`
    })

    const pathData = `M ${coords.join(" L ")}`
    const areaData = `M ${padding},${height - padding} L ${coords.join(" L ")} L ${
      width - padding
    },${height - padding} Z`

    return (
      <div className="w-full overflow-hidden pt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-24 sm:h-28 overflow-visible"
        >
          {/* Subtle area fill */}
          <path
            d={areaData}
            fill="currentColor"
            className="text-primary/5"
          />
          {/* Line stroke */}
          <path
            d={pathData}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary/70"
          />
        </svg>
      </div>
    )
  }

  return (
    <Card className="p-6 sm:p-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Topic Search Momentum
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {topicData.region && (
            <Badge variant="secondary" className="gap-1 uppercase tracking-wider text-[10px]">
              <Globe className="w-3 h-3" /> {topicData.region}
            </Badge>
          )}
          {topicData.data_source && (
            <span className="text-[10px] text-muted-foreground font-medium">
              Source: Google Trends
            </span>
          )}
        </div>
      </div>

      {isSuccess && metrics ? (
        <div className="space-y-4">
          {/* Topic Title & Momentum Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Target Topic
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                &ldquo;{topicData.topic}&rdquo;
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-muted/30 border text-xs font-bold">
              {getMomentumIcon(metrics.momentum_label)}
              <span className="capitalize">{metrics.momentum_label} Trend</span>
            </div>
          </div>

          {/* Time Series Chart */}
          {renderSparkline()}

          {/* Metric Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
            <div className="p-3 rounded-xl bg-muted/30 text-center sm:text-left border border-transparent">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Growth Shift
              </span>
              <span className="text-sm font-bold text-foreground">
                {metrics.growth_rate > 0 ? `+${Math.round(metrics.growth_rate * 100)}%` : `${Math.round(metrics.growth_rate * 100)}%`}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 text-center sm:text-left border border-transparent">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Search Demand
              </span>
              <span className="text-sm font-bold text-foreground">
                {metrics.demand_level || "Moderate"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 text-center sm:text-left border border-transparent">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Volatility
              </span>
              <span className="text-sm font-bold text-foreground">
                {metrics.volatility_label || "Low"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 text-center sm:text-left border border-transparent">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Signal Confidence
              </span>
              <span className="text-sm font-bold text-foreground capitalize">
                {metrics.confidence}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Honest unconfigured / unavailable empty state */
        <div className="py-6 px-4 rounded-xl bg-muted/10 border-2 border-dashed border-border text-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-foreground">
            {topicData.reason === "provider_not_configured"
              ? "Topic intelligence isn't connected"
              : "Topic Intelligence Data Unavailable"}
          </p>
          <p className="text-[11px] text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {topicData.reason === "provider_not_configured"
              ? "PreYT can still analyze your thumbnail and title. Connect a trend-data provider to unlock topic momentum."
              : "Insufficient search volume recorded for this specific topic over the last 12 months."}
          </p>
        </div>
      )}
    </Card>
  )
}
