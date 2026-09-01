"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  RadarConfig,
  RadarTopicItem,
  fetchRadarConfig,
  fetchRadarTopics
} from "@/lib/api/radar"
import { RadarHeader } from "./radar-header"
import { BreakingHeroCard } from "./breaking-hero-card"
import { RisingTopicList } from "./rising-topic-list"
import { UnderservedList } from "./underserved-list"
import { NextMoveCard } from "./next-move-card"
import { RadarEmptyState } from "./radar-empty-state"
import { Loader2 } from "lucide-react"

export function RadarFeed() {
  const [config, setConfig] = useState<RadarConfig | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>("IN")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  
  const [topics, setTopics] = useState<RadarTopicItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isConfigured, setIsConfigured] = useState<boolean>(true)

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

  // 2. Load Topics
  const loadFeedData = useCallback(async () => {
    setIsLoading(true)
    try {
      const topicsData = await fetchRadarTopics({
        region: selectedRegion,
        category: selectedCategory,
        classification: "ALL",
        limit: 50
      })
      
      setTopics(topicsData.topics || [])
      setIsConfigured(topicsData.data_available !== false)
    } catch (err: any) {
      console.error("Failed to load radar data:", err)
      // On backend error we might assume it's unconfigured or down
      setIsConfigured(false)
    } finally {
      setIsLoading(false)
    }
  }, [selectedRegion, selectedCategory])

  useEffect(() => {
    loadFeedData()
  }, [loadFeedData])

  if (!isConfigured && !isLoading) {
    return <RadarEmptyState />
  }

  // Derive buckets
  // Breaking: Top momentum / Breaking topic
  const breakingTopic = topics.find(t => t.classification === "BREAKING") || 
                        [...topics].sort((a, b) => b.metrics.momentum - a.metrics.momentum)[0]
                        
  // Rising
  const risingTopics = topics.filter(t => t.classification === "RISING" || t.classification === "TRENDING").slice(0, 5)

  // Underserved (Opportunity or low saturation)
  const underservedTopics = topics.filter(t => t.classification === "OPPORTUNITY" || (t.classification !== "BREAKING" && t.metrics.saturation < 40 && t.metrics.demand > 50)).slice(0, 5)

  // Next Move: Highest opportunity score
  const nextMoveTopic = [...topics].sort((a, b) => b.opportunity.score - a.opportunity.score)[0]

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <RadarHeader
        regions={
          config?.regions || [
            { code: "IN", name: "India", flag: "🇮🇳", default: true },
            { code: "US", name: "United States", flag: "🇺🇸", default: false },
            { code: "GLOBAL", name: "Global", flag: "🌎", default: false }
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
        lastMeasured={topics.length > 0 ? topics[0].captured_at : undefined}
      />

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : topics.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          No topics found for this criteria.
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {breakingTopic && <BreakingHeroCard topic={breakingTopic} />}
          
          <div className="w-full h-px bg-border/50 mb-12" />
          
          <RisingTopicList topics={risingTopics} />
          
          <div className="w-full h-px bg-border/50 mb-12" />
          
          <UnderservedList topics={underservedTopics} />
          
          {nextMoveTopic && <NextMoveCard topic={nextMoveTopic} />}
        </div>
      )}
    </div>
  )
}

