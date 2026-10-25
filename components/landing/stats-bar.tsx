import { Database, Smartphone, Zap, ShieldCheck } from "lucide-react"

const stats = [
  {
    icon: Database,
    value: "14.8M+",
    label: "YouTube Uploads Benchmarked",
    sub: "Empirical performance dataset",
  },
  {
    icon: Smartphone,
    value: "48-Char",
    label: "Mobile Viewport Precision",
    sub: "Front-loaded hook safe-zone",
  },
  {
    icon: Zap,
    value: "< 60s",
    label: "Packaging Diagnostic Speed",
    sub: "Full audit before you film",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Privacy First & Compliant",
    sub: "Zero OAuth or password needed",
  },
]

export function StatsBar() {
  return (
    <section className="border-y border-neutral-200/80 bg-white/95 backdrop-blur-md relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-200/70">
          {stats.map((s, idx) => {
            const Icon = s.icon
            return (
              <div
                key={idx}
                className={`flex flex-col items-center md:items-start text-center md:text-left ${
                  idx > 0 ? "pt-6 md:pt-0 md:pl-8" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-md bg-red-50 text-[#EE1122] flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#161512] font-mono tracking-tight">
                    {s.value}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-neutral-800">
                  {s.label}
                </div>
                <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  {s.sub}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
