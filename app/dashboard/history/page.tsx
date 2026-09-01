"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { History, ArrowRight, Clock, Trash2, BarChart2 } from "lucide-react"
import { AnalysisResult } from "@/lib/types/analysis"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Analysis History
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review past video package decisions from this session.
          </p>
        </div>

        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearHistory}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* History List */}
      {history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {history.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/analysis/${item.id}`}
            >
              <Card className="p-6 hover:border-primary/50 transition-all flex items-center justify-between group cursor-pointer h-full">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-foreground">
                      {item.score}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      / 100 (Tier {item.tier})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-4 bg-muted/10">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            No Recent Analyses Found
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Analyses you run in this session will appear here for quick reference and comparison.
          </p>
          <div className="pt-4">
            <Button asChild size="lg" className="rounded-xl">
              <Link href="/dashboard/analyze">
                Analyze a Video Package
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
