import Link from "next/link"
import { Check, X, ArrowRight, ShieldCheck } from "lucide-react"

const comparisons = [
  {
    capability: "Title Optimization",
    traditional: "Intuition-based drafting & polling team on Slack",
    preyt: "Scored against 14M benchmark uploads on 14 heuristics",
  },
  {
    capability: "Mobile Feed Safety",
    traditional: "Titles truncate with ellipsis on mobile viewports",
    preyt: "Automated 54-character safe-zone enforcement",
  },
  {
    capability: "Thumbnail Contrast",
    traditional: "Viewed in isolation inside Photoshop / Figma",
    preyt: "Live contrast simulation inside YouTube dark & light feeds",
  },
  {
    capability: "Topic Selection",
    traditional: "Producing videos on topics already saturated",
    preyt: "Detects surge velocity 2-3 weeks ahead of competitor saturation",
  },
  {
    capability: "0:30 Hook Retention",
    traditional: "Viewers drop off due to title-to-content mismatch",
    preyt: "Pacing curve aligns title stakes with first 30 seconds of video",
  },
]

export function Methodology() {
  return (
    <section id="methodology" className="py-24 bg-neutral-50/50 border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider">
            [ METHODOLOGY COMPARISON ]
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
            Engineering precision vs. intuition-based guesswork.
          </h2>
          <p className="text-base text-neutral-600 max-w-2xl font-normal leading-relaxed">
            Why leading YouTube channels and media studios replace gut feeling with deterministic pre-upload modeling.
          </p>
        </div>

        {/* Structured Comparison Table */}
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200 font-mono text-neutral-500 text-xs">
              <tr>
                <th className="py-3.5 px-5 font-semibold w-1/4">CAPABILITY</th>
                <th className="py-3.5 px-5 font-semibold w-3/8 text-neutral-400">TRADITIONAL WORKFLOW</th>
                <th className="py-3.5 px-5 font-semibold w-3/8 text-red-600 font-bold">PREYT INTELLIGENCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {comparisons.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-4 px-5 font-bold text-neutral-900 align-top">
                    {row.capability}
                  </td>
                  <td className="py-4 px-5 text-neutral-500 align-top">
                    <div className="flex items-start gap-2">
                      <X className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                      <span>{row.traditional}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-neutral-950 font-medium align-top bg-red-50/10">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{row.preyt}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Studio Evidence Quote */}
        <div className="mt-12 p-7 rounded-2xl bg-white border border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <p className="text-sm text-neutral-800 leading-relaxed font-normal">
              &ldquo;PreYT eliminated the debate over titles and packaging before our weekly uploads. Having deterministic data on mobile cutoff and curiosity loops increased our channel average CTR from 4.2% to 8.9%.&rdquo;
            </p>
            <div className="text-xs text-neutral-500 pt-1">
              <span className="font-semibold text-neutral-900">Marcus Rivera</span> • Head of Content Production, TechSprint (720K Subscribers)
            </div>
          </div>

          <Link
            href="/signup"
            className="shrink-0 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Audit Your Channel
          </Link>
        </div>

      </div>
    </section>
  )
}
