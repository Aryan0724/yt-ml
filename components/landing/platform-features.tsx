import Link from "next/link"
import { Radar, Lightbulb, ActivitySquare, FlaskConical, Tv, History, ArrowRight, ShieldCheck, Zap } from "lucide-react"

const features = [
  {
    icon: Radar,
    badge: "Real-Time Signals",
    title: "Topic Radar",
    description: "Scan breakout keywords, competitor anomalies, and audience search velocity before topics become saturated.",
    href: "/dashboard/radar",
    metric: "4.8M videos scanned/day",
  },
  {
    icon: Lightbulb,
    badge: "Idea Generation",
    title: "Idea Sandbox",
    description: "Generate proven video angles scored by virality probability, search volume, and production feasibility.",
    href: "/dashboard/ideas",
    metric: "98% topic coverage",
  },
  {
    icon: ActivitySquare,
    badge: "Packaging Audit",
    title: "Video Analyzer",
    description: "Audit title length, emotional hooks, curiosity gaps, and thumbnail contrast before you publish to YouTube.",
    href: "/dashboard/analyze",
    metric: "0.4s response time",
  },
  {
    icon: FlaskConical,
    badge: "Pre-Upload Testing",
    title: "A/B Simulation Lab",
    description: "Simulate how your thumbnail looks in dark mode, mobile feeds, and alongside top competitors before publishing.",
    href: "/dashboard/lab",
    metric: "Side-by-side CTR model",
  },
  {
    icon: Tv,
    badge: "Channel Intelligence",
    title: "Audience DNA",
    description: "Connect your channel to uncover your audience baseline, loyal viewers, and the hidden gaps your viewers crave.",
    href: "/dashboard/channel",
    metric: "Direct YouTube API",
  },
  {
    icon: History,
    badge: "Audit History",
    title: "Predictive Archive",
    description: "Review past video packaging performance against actual 30-day views to train and sharpen your intuition.",
    href: "/dashboard/history",
    metric: "Full performance tracking",
  },
]

export function PlatformFeatures() {
  return (
    <section id="features" className="py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Complete Creator OS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
            Engineered to turn YouTube into a science.
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
            Stop relying on luck. PreYT gives your team the predictive data, thumbnail testing, and topic intelligence needed to hit your next million views.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="group relative bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 hover:border-red-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header with Icon & Metric Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                      {feature.metric}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-red-600 tracking-wide uppercase">
                    {feature.badge}
                  </span>

                  <h3 className="text-xl font-bold text-neutral-950 mt-1 mb-2.5 group-hover:text-red-600 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Footer Link */}
                <div className="pt-6 mt-6 border-t border-neutral-100">
                  <Link
                    href={feature.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 group-hover:text-red-600 transition-colors"
                  >
                    <span>Launch {feature.title}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Banner inside Features */}
        <div className="mt-12 p-6 sm:p-8 bg-neutral-50 border border-neutral-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-neutral-950 text-base sm:text-lg">
                Official YouTube Data API Integration
              </div>
              <div className="text-sm text-neutral-600">
                100% compliant with YouTube terms of service. Zero bot traffic, zero risk to your channel.
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/channel"
            className="shrink-0 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Connect Channel
          </Link>
        </div>
      </div>
    </section>
  )
}
