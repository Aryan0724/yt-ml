import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { PageTransition } from "@/components/global/page-transition";
import { Zap, GitBranch, RefreshCcw, Sparkles } from "lucide-react";

const updates = [
  {
    version: "1.1.0",
    date: "May 2026",
    title: "The Ensemble Update",
    desc: "Major architecture upgrade blending structural ML with behavioral psychology rules.",
    icon: Sparkles,
    features: ["Ensemble Scoring Logic", "Behavioral Hook Audit", "Niche Benchmark Scaling"]
  },
  {
    version: "1.0.4",
    date: "April 2026",
    title: "Confidence Calibration",
    desc: "Introduced the confidence interval system to map prediction reliability.",
    icon: RefreshCcw,
    features: ["MAE Prediction Window", "Volatility Detection", "Trust Indicators"]
  },
  {
    version: "1.0.0",
    date: "March 2026",
    title: "Core Launch",
    desc: "Initial deployment of the Diamond Intelligence research engine.",
    icon: Zap,
    features: ["Single Analysis Mode", "Linguistic Audit", "Visual Clarity Scoring"]
  }
]

export default function ChangelogPage() {
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-44 pb-32 px-6">
        <section className="max-w-4xl mx-auto mb-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">System <br /><span className="text-gradient">Evolution.</span></h1>
          <p className="text-zinc-500 text-xl">Tracking the progression of creator intelligence architecture.</p>
        </section>

        <section className="max-w-4xl mx-auto space-y-24 relative">
          {/* Vertical Line */}
          <div className="absolute top-0 left-0 md:left-1/2 w-px h-full bg-white/5 -translate-x-px" />

          {updates.map((update, i) => (
            <div key={update.version} className={`relative flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
               {/* Center Icon */}
               <div className="absolute left-0 md:left-1/2 w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center -translate-x-1/2 z-10">
                  <update.icon className="w-5 h-5 text-blue-500" />
               </div>

               <div className="w-full md:w-1/2 p-10 rounded-[2.5rem] glass-card border-white/5 hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">{update.date}</div>
                        <h3 className="text-2xl font-bold">{update.title}</h3>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-500">v{update.version}</div>
                  </div>
                  <p className="text-zinc-500 text-sm mb-6 leading-relaxed">{update.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {update.features.map(f => (
                        <span key={f} className="px-3 py-1 rounded-full bg-white/[0.02] border border-white/5 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{f}</span>
                    ))}
                  </div>
               </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
