import Link from "next/link"
import { Smartphone, Eye, Search, ArrowRight, Check } from "lucide-react"

const features = [
  {
    num: "01",
    icon: Smartphone,
    tag: "MOBILE SAFE AREA",
    title: "Never let YouTube cut off your punchline.",
    description: "Over 70% of all YouTube views happen on mobile phones. When titles exceed 48 characters, YouTube truncates the end with '...'. PreYT guarantees your core hook is 100% visible on every phone screen.",
    metric: "48 Characters Safe Limit",
    badge: "100% Mobile Safe",
  },
  {
    num: "02",
    icon: Eye,
    tag: "FEED CONTRAST",
    title: "Stop blending into YouTube's dark mode.",
    description: "Most creators design thumbnails on a bright white Photoshop canvas. But 80% of viewers browse on dark theme (#0f0f0f). PreYT tests your thumbnail inside the real dark feed so it pops and stops the thumb-scroll.",
    metric: "8.4:1 Focal Contrast Pop",
    badge: "WCAG Contrast Pass",
  },
  {
    num: "03",
    icon: Search,
    tag: "COMPETITOR GAPS",
    title: "Find what viewers are begging for in comments.",
    description: "PreYT scans thousands of comments on the top 10 videos in your niche. We reveal the exact questions, pain points, and topics top channels forgot to answer—giving you instant viral video ideas.",
    metric: "14,000+ Comments Mined",
    badge: "Untapped Demand Gap",
  },
]

export function ThreeFeatures() {
  return (
    <section className="landing-col py-20 border-b border-neutral-200" id="capabilities">
      
      {/* Section Header */}
      <div className="max-w-3xl mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#EE1122] text-xs font-mono font-bold tracking-wider uppercase border border-red-200/60 shadow-2xs">
          <span>[ THE 3 FATAL MISTAKES PREYT FIXES ]</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#161512] leading-[1.12]">
          Three reasons your videos get ignored. <br className="hidden sm:inline" />
          <span className="text-[#EE1122]">And how PreYT solves them.</span>
        </h2>

        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl font-normal leading-relaxed">
          You don&apos;t need to hire expensive consultants. PreYT runs three automated pre-upload checks so every video you publish gets the views it deserves.
        </p>
      </div>

      {/* 3 Clear Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {features.map((f) => {
          const Icon = f.icon
          return (
            <div
              key={f.num}
              className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 flex flex-col justify-between hover:border-neutral-300 hover:shadow-md transition-all group"
            >
              <div className="space-y-6">
                
                {/* Icon & Number Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-[#EE1122] flex items-center justify-center border border-red-100 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-400">
                    STEP {f.num}
                  </span>
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-[#EE1122] uppercase tracking-wider">
                    {f.tag}
                  </span>
                  <h3 className="text-xl font-bold text-[#161512] tracking-tight leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                    {f.description}
                  </p>
                </div>

              </div>

              {/* Card Footer Metric Badge */}
              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{f.badge}</span>
                </span>
                <span className="text-xs font-mono text-neutral-500 font-medium">
                  {f.metric}
                </span>
              </div>

            </div>
          )
        })}
      </div>

    </section>
  )
}
