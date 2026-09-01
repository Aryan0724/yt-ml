import { RadarTopicItem } from "@/lib/api/radar"
import { ArrowRight, Flame } from "lucide-react"
import Link from "next/link"

export function BreakingHeroCard({ topic }: { topic: RadarTopicItem }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 text-rose-500 font-semibold mb-4 text-sm tracking-wide uppercase">
        <Flame className="w-4 h-4" />
        Breaking
      </div>
      <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground tracking-tight mb-4">
        {topic.canonical_name}
      </h2>
      <p className="text-xl text-muted-foreground font-medium mb-6">
        Search interest is accelerating rapidly.
      </p>
      
      <div className="mb-8">
        <p className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wider opacity-60">Why creators should care</p>
        <p className="text-base text-foreground/90 max-w-2xl leading-relaxed">
          {topic.why_this_matters} {topic.creator_opportunity}
        </p>
      </div>

      <Link 
        href={`/dashboard/ideas?topic=${encodeURIComponent(topic.slug)}`}
        className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-semibold hover:bg-foreground/90 transition-colors"
      >
        Explore opportunity <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
