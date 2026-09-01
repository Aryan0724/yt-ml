import { RadarTopicItem } from "@/lib/api/radar"
import { ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"

export function RisingTopicList({ topics }: { topics: RadarTopicItem[] }) {
  if (!topics.length) return null

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 text-sky-500 font-semibold mb-6 text-sm tracking-wide uppercase">
        <TrendingUp className="w-4 h-4" />
        Rising
      </div>
      
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
        href="/dashboard/radar?filter=rising"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        View all rising topics <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
