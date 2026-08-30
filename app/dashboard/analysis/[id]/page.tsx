"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getAnalysisFromSession } from "@/lib/api/analysis"
import { AnalysisResult } from "@/lib/types/analysis"
import { VerdictHeader } from "@/components/dashboard/verdict-header"
import { PrimaryBottleneck } from "@/components/dashboard/primary-bottleneck"
import { ActionAngles } from "@/components/dashboard/action-angles"
import { SeverityChecklist } from "@/components/dashboard/severity-checklist"
import { TopicIntelligenceView } from "@/components/dashboard/topic-intelligence-view"
import { ExpandableEvidence } from "@/components/dashboard/expandable-evidence"
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react"

export default function SavedAnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const analysisId = params?.id as string

  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!analysisId) return
    const stored = getAnalysisFromSession(analysisId)
    if (stored) {
      setResult(stored)
    }
    setLoading(false)
  }, [analysisId])

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
          Loading Saved Decision...
        </p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="w-full max-w-xl mx-auto py-20 px-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Analysis Not Found in Active Session
        </h2>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
          This analysis session may have expired or was opened in a different browser session.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Package Analyzer</span>
          </Link>
        </div>
      </div>
    )
  }

  const data = result.data

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-left pb-16 animate-fade-in">
      {/* Navigation Topbar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Analysis</span>
        </Link>
        <span className="text-[10px] text-zinc-400 font-mono">
          ID: {result.metadata.analysis_id.slice(0, 8)}...
        </span>
      </div>

      {/* 1. Score & Executive Verdict */}
      <VerdictHeader
        score={data.score}
        tier={data.tier}
        masterReport={data.master_report}
        aiStatus={data.ai?.status}
      />

      {/* 2. #1 Primary Bottleneck */}
      <PrimaryBottleneck masterReport={data.master_report} />

      {/* 3. Actionable Content Angles */}
      {data.master_report?.recommended_angles && (
        <ActionAngles angles={data.master_report.recommended_angles} />
      )}

      {/* 4. Topic Intelligence Sparkline */}
      {data.topic_intelligence && (
        <TopicIntelligenceView topicData={data.topic_intelligence} />
      )}

      {/* 5. Prioritized Optimization Checklist */}
      <SeverityChecklist
        improvements={data.improvements}
        optimizationPlan={data.master_report?.optimization_plan}
      />

      {/* 6. Expandable Technical Evidence Drawer */}
      <ExpandableEvidence
        factors={data.factors}
        strengths={data.strengths}
        weaknesses={data.weaknesses}
        channelDna={data.channel_dna}
        engineVersion={data.engine_version}
      />
    </div>
  )
}
