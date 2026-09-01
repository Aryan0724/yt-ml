import { RadarTopicItem } from "@/lib/api/radar"
import { ArrowRight, Lightbulb } from "lucide-react"
import Link from "next/link"

export function UnderservedList({ topics }: { topics: RadarTopicItem[] }) {
  if (!topics.length) return null

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 text-amber-500 font-semibold mb-2 text-sm tracking-wide uppercase">
        <Lightbulb className="w-4 h-4" />
        Underserved
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Topics with demand but comparatively less coverage
      </p>
      
      <div className="flex flex-col gap-4 mb-6 max-w-2xl">
        {topics.map((topic) => (
          <div key={topic.id} className="flex items-center justify-between py-2 border-b border-border/50 group">
            <Link 
              href={`/dashboard/ideas?topic=${encodeURIComponent(topic.slug)}`}
              className="text-lg font-medium text-foreground group-hover:text-primary transition-colors flex-1"
            >
              {topic.canonical_name}
            </Link>
            <div className="text-muted-foreground font-mono">
              {Math.round(topic.opportunity.score)}
            </div>
          </div>
        ))}
      </div>

      <Link 
        href="/dashboard/radar?filter=underserved"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        Explore opportunities <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
