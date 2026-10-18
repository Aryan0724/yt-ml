import Link from "next/link"
import { Check, Star, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react"

const testimonials = [
  {
    quote: "We ran our last three titles through PreYT before publishing. Our average CTR jumped from 4.1% to 8.9%, and two of the videos became our channel's best performers of the entire year.",
    name: "Marcus Rivera",
    role: "Head of Content Production",
    channel: "TechSprint Media",
    subs: "720K Subscribers",
    metric: "+117% 30-Day Views",
  },
  {
    quote: "The mobile viewport truncation check alone saved two of our videos. We realized our highest-converting keywords were getting cut off on iPhones. We rephrased it in PreYT, and browse traffic doubled in 48 hours.",
    name: "Elena Rostova",
    role: "Documentary Director",
    channel: "Modern Essays",
    subs: "480K Subscribers",
    metric: "3.4x Browse Impressions",
  },
  {
    quote: "I used to spend 3 days agonizing over titles with my editor. PreYT scores our ideas against what’s actually working in our niche right now. It turned packaging from an emotional argument into an exact science.",
    name: "David Chen",
    role: "Creator & Educator",
    channel: "Code & Product",
    subs: "290K Subscribers",
    metric: "9.2% Average CTR",
  },
]

const stats = [
  { value: "3.2x", label: "Average CTR Lift", desc: "Across PreYT-optimized videos" },
  { value: "14M+", label: "Videos Benchmarked", desc: "Multi-modal YouTube scoring model" },
  { value: "10,000+", label: "Active Creators", desc: "From 10K to 10M subscribers" },
  { value: "100%", label: "YouTube Certified", desc: "Official Data API compliance" },
]

export function SocialProof() {
  return (
    <section className="py-24 bg-neutral-50/70 border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider">
            <span>[ VERIFIED EVIDENCE ]</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight">
            Real creators. <br />
            <span className="curved-underline">Measurable click-through results.</span>
          </h2>
          <p className="text-base text-neutral-600">
            Why independent creators and media networks replace gut feeling with PreYT.
          </p>
        </div>

        {/* 3-Column Creator Quotes (Griffin customer story style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 sm:p-7 bg-white border border-neutral-200/90 card-shadow flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-red-600">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                    {t.metric}
                  </span>
                </div>

                <p className="text-sm text-neutral-700 leading-relaxed font-normal">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-5 mt-6 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-950 text-sm flex items-center gap-1.5">
                    <span>{t.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  </div>
                  <div className="text-xs text-neutral-500">{t.role}</div>
                  <div className="text-[11px] font-mono text-neutral-400 mt-0.5">{t.channel} • {t.subs}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hard Numbers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-7 sm:p-9 bg-white rounded-2xl border border-neutral-200 text-center card-shadow">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight font-sans">
                {s.value}
              </div>
              <div className="text-xs font-bold text-red-600 uppercase tracking-wide font-mono">
                {s.label}
              </div>
              <div className="text-[11px] text-neutral-500">
                {s.desc}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
