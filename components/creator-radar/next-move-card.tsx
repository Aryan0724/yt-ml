import { RadarTopicItem } from "@/lib/api/radar"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function NextMoveCard({ topic }: { topic: RadarTopicItem }) {
  return (
    <div className="mt-16 pt-12 border-t">
      <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">
        Your Next Move
      </div>
      
      <div className="bg-card border rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-colors group">
        <h3 className="text-2xl font-display font-bold text-foreground mb-6">
          {topic.canonical_name}
        </h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-24">Demand</span>
            <span className="font-semibold text-emerald-500">↑</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-24">Momentum</span>
            <span className="font-semibold text-emerald-500">↑</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-24">Competition</span>
            <span className="font-semibold text-emerald-500">↓</span>
          </div>
        </div>

        <p className="text-muted-foreground mb-8 max-w-xl leading-relaxed">
          This is currently the strongest opportunity in your radar.
        </p>

        <Link 
          href={`/dashboard/ideas?topic=${encodeURIComponent(topic.slug)}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
        >
          Build this idea <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
