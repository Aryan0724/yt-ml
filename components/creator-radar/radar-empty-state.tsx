import { Sparkles, Settings } from "lucide-react"
import Link from "next/link"

export function RadarEmptyState() {
  return (
    <div className="py-24 text-center border-t border-border/50 max-w-2xl mx-auto space-y-6">
      <Sparkles className="w-12 h-12 text-muted-foreground mx-auto opacity-40" />
      <h3 className="text-2xl font-display font-bold text-foreground">
        Topic intelligence isn't connected yet.
      </h3>
      <p className="text-base text-muted-foreground">
        Connect a trend-data provider to unlock live market opportunities.
      </p>
      <div className="pt-4">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold rounded-full hover:bg-foreground/90 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Configure provider
        </Link>
      </div>
    </div>
  )
}
