import Link from "next/link"
import { ArrowRight, CheckCircle2, TrendingUp, Users, Search, Target, Award, Sparkles } from "lucide-react"

const stats = [
  { value: "10,000+", label: "Active Creators", sub: "From 10K to 10M subs" },
  { value: "48M+", label: "Videos Analyzed", sub: "Multi-modal model" },
  { value: "3.2x", label: "Average CTR Lift", sub: "When following fixes" },
  { value: "99.4%", label: "Platform Uptime", sub: "Real-time YouTube feed" },
]

export function EvidenceSection() {
  return (
    <section className="py-24 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Value Pitch */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Evidence-Based Content Science</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight leading-[1.15]">
              We don&apos;t guess. <br />
              <span className="text-red-600">We benchmark billions of data points.</span>
            </h2>

            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
              Every PreYT recommendation is trained on real YouTube search trends, algorithmic browse recommendations, and thumbnail click tests. No black-box voodoo — just actionable packaging intelligence.
            </p>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {[
                "Deterministic CTR modeling across 14 major YouTube niches",
                "Mobile vs. Desktop thumbnail legibility simulation at exact YouTube viewports",
                "Curiosity gap & sentiment scoring built on 500K breakout titles",
                "Live competitor upload alerts to identify topic saturation in minutes",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-neutral-800 leading-snug">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                href="/dashboard/analyze"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-full shadow-sm hover:shadow transition-all"
              >
                <span>Audit Your Last Upload</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Live Diagnostic Showcase Card */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-lg">
            <div className="flex items-center justify-between pb-5 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-600" />
                <span className="text-sm font-bold text-neutral-900">Pre-Upload Packaging Diagnosis</span>
              </div>
              <span className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-full">
                Score: 92/100
              </span>
            </div>

            {/* Real Diagnostic Metrics */}
            <div className="mt-6 space-y-4">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-semibold text-neutral-700">Title Length & Truncation (46 chars)</span>
                  <span className="font-bold text-red-600">Optimal (100%)</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full w-full" />
                </div>
                <p className="mt-1.5 text-[11px] text-neutral-500">Won&apos;t get cut off on mobile search cards or tablet home feeds.</p>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-semibold text-neutral-700">Thumbnail Subject Isolation & Contrast</span>
                  <span className="font-bold text-green-700">Pass (94%)</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-full w-[94%]" />
                </div>
                <p className="mt-1.5 text-[11px] text-neutral-500">High visual focal clarity even when viewed at 120px scale on mobile.</p>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-semibold text-neutral-700">Curiosity & Open Loop Tension</span>
                  <span className="font-bold text-red-600">Strong (88%)</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full w-[88%]" />
                </div>
                <p className="mt-1.5 text-[11px] text-neutral-500">Presents an immediate stakes question without giving away the punchline.</p>
              </div>
            </div>

            {/* Quick 2x2 Mini Stats */}
            <div className="mt-6 pt-6 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {stats.map((stat, i) => (
                <div key={i} className="p-2">
                  <div className="text-xl sm:text-2xl font-extrabold text-neutral-950">{stat.value}</div>
                  <div className="text-xs font-semibold text-red-600 mt-0.5">{stat.label}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
