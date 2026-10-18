import Link from "next/link"
import { ArrowRight, Radar, ActivitySquare, Users, BarChart3, Check } from "lucide-react"

const capabilities = [
  {
    num: "01",
    tag: "TOPIC RADAR",
    icon: Radar,
    title: "Find trending topics your audience craves.",
    description: "No more guessing what to film. PreYT scans YouTube search volume and competitor comment sections to reveal surging topics weeks before they saturate.",
    signals: [
      "Surge velocity detection 2-3 weeks ahead of peak",
      "Audience demand vs. creator supply ratio",
      "Category saturation risk classification",
    ],
    href: "/dashboard/radar",
    linkText: "Explore Topic Radar",
  },
  {
    num: "02",
    tag: "VIDEO AUDIT",
    icon: ActivitySquare,
    title: "Identify why videos fail and fix them before filming.",
    description: "Get an in-depth diagnostic report for any draft. We evaluate mobile title cutoffs, feed contrast against YouTube Dark Theme, and hook curiosity index.",
    signals: [
      "Mobile search viewport safe-zone check (48-char cutoff)",
      "Dark mode feed contrast score (WCAG 2.1 compliance)",
      "Psychological curiosity loop tension rating",
    ],
    href: "/dashboard/analyze",
    linkText: "Audit a Video",
  },
  {
    num: "03",
    tag: "COMPETITOR COMPARE",
    icon: Users,
    title: "Reverse-engineer what top rivals do differently.",
    description: "Compare your channel side-by-side with your niche's leaders. Discover upload frequency gaps, audience demographic overlaps, and winning title structures.",
    signals: [
      "Head-to-head subscriber & 30-day view velocity",
      "Competitor comment demand mining for unserved questions",
      "Format stabilization & thumbnail pattern analysis",
    ],
    href: "/dashboard/channel",
    linkText: "Compare Channels",
  },
  {
    num: "04",
    tag: "CHANNEL DNA & METRICS",
    icon: BarChart3,
    title: "Track your authority score and audience profile.",
    description: "Understand your true channel authority. PreYT models your historical engagement and viewer retention trends to forecast your next upload's baseline.",
    signals: [
      "Channel Authority Score modeled across 14M uploads",
      "Demographic alignment & active retention hours",
      "Predictable 30-day view baseline projections",
    ],
    href: "/dashboard",
    linkText: "View Channel DNA",
  },
]

export function CoreCapabilities() {
  return (
    <section id="capabilities" className="py-24 bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#EE1122] text-xs font-mono font-semibold uppercase tracking-wider border border-red-200/60">
            <span>[ CORE CAPABILITIES ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#161512] leading-[1.12]">
            Data-backed tools built for <br />
            every stage of your video workflow.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl font-normal leading-relaxed">
            PreYT eliminates intuition-based guesswork across every decision—from picking the topic to packaging the thumbnail and title.
          </p>
        </div>

        {/* 2x2 Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capabilities.map((c) => {
            const Icon = c.icon
            return (
              <div
                key={c.num}
                className="bg-neutral-50/50 rounded-2xl border border-neutral-200 p-8 flex flex-col justify-between hover:border-neutral-300 hover:shadow-sm transition-all group"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#EE1122] tracking-wider uppercase">
                      {c.tag}
                    </span>
                    <span className="w-8 h-8 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-xs font-mono font-bold text-neutral-500 shadow-2xs">
                      {c.num}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#161512] tracking-tight group-hover:text-[#EE1122] transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                      {c.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-200/60">
                    {c.signals.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-200/80">
                  <Link
                    href={c.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 group-hover:text-[#EE1122] transition-colors"
                  >
                    <span>{c.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
