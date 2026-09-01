"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { fetchRadarTopicDetail, RadarTopicItem } from "@/lib/api/radar"
import { generateIdeas, IdeaGenerationResponse, IdeaOutput } from "@/lib/api/ideas"
import { Loader2, ArrowRight, Zap, Target, BookOpen, AlertCircle, Eye, ShieldAlert } from "lucide-react"

function IdeasContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams.get("topic")
  
  const [topic, setTopic] = useState<RadarTopicItem | null>(null)
  const [loadingTopic, setLoadingTopic] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [ideas, setIdeas] = useState<IdeaOutput[]>([])
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  useEffect(() => {
    if (!slug) {
      setError("No topic selected.")
      setLoadingTopic(false)
      return
    }

    fetchRadarTopicDetail(slug, "IN")
      .then((data) => setTopic(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingTopic(false))
  }, [slug])

  const handleGenerate = async () => {
    if (!slug) return
    setGenerating(true)
    try {
      const res = await generateIdeas(slug, "IN")
      setIdeas(res.ideas)
      setGenerated(true)
    } catch (err: any) {
      setError(err.message || "Failed to generate ideas.")
    } finally {
      setGenerating(false)
    }
  }

  const handleAnalyzePackage = (idea: IdeaOutput) => {
    // Phase 8 handoff: pass the title_concept directly into the package analyzer
    const params = new URLSearchParams()
    params.set("title", idea.title_concept)
    params.set("topic", idea.topic)
    router.push(`/dashboard/analyze?${params.toString()}`)
  }

  if (loadingTopic) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {error || "Topic not found."}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">
          {topic.canonical_name}
        </h1>
        <div className="text-lg font-medium text-muted-foreground mb-6">
          Why this opportunity exists
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm font-semibold mb-8">
          <div className="px-4 py-2 bg-muted rounded-full flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            Demand: <span className="text-foreground">{topic.metrics.demand > 60 ? "High" : topic.metrics.demand > 30 ? "Medium" : "Low"}</span>
          </div>
          <div className="px-4 py-2 bg-muted rounded-full flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Momentum: <span className="text-foreground">{topic.metrics.momentum > 0 ? "Rising" : "Cooling"}</span>
          </div>
          <div className="px-4 py-2 bg-muted rounded-full flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Saturation: <span className="text-foreground">{topic.metrics.saturation < 40 ? "Low" : topic.metrics.saturation < 70 ? "Moderate" : "High"}</span>
          </div>
          <div className="px-4 py-2 bg-muted rounded-full text-muted-foreground font-mono font-normal">
            Measured: {new Date(topic.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <p className="text-muted-foreground leading-relaxed max-w-2xl mb-8">
          {topic.why_this_matters} {topic.creator_opportunity}
        </p>

        {!generated && !generating && (
          <button 
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors"
          >
            Generate Buildable Angles <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {generating && (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-medium animate-pulse">Running {topic.canonical_name} through Idea Engine...</p>
        </div>
      )}

      {generated && ideas.length > 0 && (
        <div className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h2 className="text-2xl font-display font-bold text-foreground mb-8">What could you make?</h2>
          
          <div className="space-y-8">
            {ideas.map((idea, i) => (
              <div key={idea.idea_id} className="p-6 sm:p-8 bg-card border rounded-2xl flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono font-bold text-muted-foreground mb-2">0{i + 1} • {idea.format.toUpperCase()}</div>
                    <h3 className="text-xl font-bold text-foreground">{idea.title_concept}</h3>
                  </div>
                  <div className="px-3 py-1 bg-muted rounded-full text-xs font-semibold text-muted-foreground whitespace-nowrap">
                    {idea.difficulty} Difficulty
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Angle</h4>
                      <p className="text-sm text-muted-foreground">{idea.angle}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Target Audience</h4>
                      <p className="text-sm text-muted-foreground">{idea.audience}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">The Hook (First 15s)</h4>
                      <p className="text-sm text-muted-foreground">{idea.hook}</p>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-xl border border-border/50 space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        Why Now
                      </h4>
                      <p className="text-sm text-muted-foreground">{idea.why_now}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        Evidence
                      </h4>
                      <p className="text-sm text-muted-foreground">{idea.evidence}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <button 
                    onClick={() => handleAnalyzePackage(idea)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-semibold rounded-full hover:bg-foreground/90 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" /> Analyze Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function IdeasPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <IdeasContent />
    </Suspense>
  )
}
