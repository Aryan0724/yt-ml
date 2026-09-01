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
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

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
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Loading Saved Decision...
        </p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="w-full max-w-xl mx-auto py-20 px-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Analysis Not Found
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          This analysis session may have expired or was opened in a different browser session.
        </p>
        <div className="pt-4">
          <Button asChild className="rounded-xl">
            <Link href="/dashboard/analyze">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analyzer
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const data = result.data

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-500">
      {/* Navigation Topbar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-foreground">
          <Link href="/dashboard/analyze">
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Analysis
          </Link>
        </Button>
        <span className="text-xs text-muted-foreground font-mono">
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
