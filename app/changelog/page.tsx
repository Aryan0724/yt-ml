import { NavbarLight } from "@/components/landing/navbar-light";
import { FooterLight } from "@/components/landing/footer-light";
import { PageTransition } from "@/components/global/page-transition";
import { Zap, RefreshCcw, Sparkles } from "lucide-react";

const updates = [
  {
    version: "2.1.0",
    date: "May 2026",
    title: "The Editorial Update",
    desc: "Complete UI overhaul to the Blueprint/Editorial design system. Warm paper textures, structural grid lines, and Fragment Mono for technical labels.",
    icon: Sparkles,
    features: ["Editorial Design System", "Blueprint Grid Layout", "Fragment Mono Typography", "Noise Texture Overlay"]
  },
  {
    version: "1.1.0",
    date: "April 2026",
    title: "The Ensemble Update",
    desc: "Major architecture upgrade blending structural ML with behavioral psychology rules.",
    icon: Sparkles,
    features: ["Ensemble Scoring Logic", "Behavioral Hook Audit", "Niche Benchmark Scaling"]
  },
  {
    version: "1.0.4",
    date: "March 2026",
    title: "Confidence Calibration",
    desc: "Introduced the confidence interval system to map prediction reliability.",
    icon: RefreshCcw,
    features: ["MAE Prediction Window", "Volatility Detection", "Trust Indicators"]
  },
  {
    version: "1.0.0",
    date: "February 2026",
    title: "Core Launch",
    desc: "Initial deployment of the preYT research engine.",
    icon: Zap,
    features: ["Single Analysis Mode", "Linguistic Audit", "Visual Clarity Scoring"]
  }
]

export default function ChangelogPage() {
  return (
    <PageTransition>
      <NavbarLight />
      <main className="pt-24 pb-32 px-6 bg-[#FAF9F6] min-h-screen">
        <section className="max-w-[1200px] mx-auto mb-16 pt-12">
          <div className="text-[9px] font-mono font-bold text-[#FF0000] uppercase tracking-[0.2em] mb-4">[ SYSTEM EVOLUTION ]</div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 text-zinc-900 tracking-tight">
            System <br /><span className="text-[#FF0000]">Evolution.</span>
          </h1>
          <p className="text-xs font-mono text-zinc-500">Tracking the progression of creator intelligence architecture.</p>
        </section>

        <section className="max-w-[1200px] mx-auto space-y-px relative">
          {updates.map((update, i) => (
            <div key={update.version} className="relative flex flex-col md:flex-row items-stretch gap-0 border border-zinc-200 bg-white hover:border-zinc-400 transition-all group">
               <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#FF0000] opacity-0 group-hover:opacity-100 transition-opacity" />
               
               {/* Version marker */}
               <div className="w-full md:w-32 flex-shrink-0 p-6 border-b md:border-b-0 md:border-r border-zinc-100 flex flex-col justify-between">
                 <div>
                   <div className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">{update.date}</div>
                   <div className="font-mono text-xs font-bold text-zinc-900">v{update.version}</div>
                 </div>
                 <div className="w-8 h-8 rounded-[3px] bg-[#FAF9F6] border border-zinc-200 flex items-center justify-center mt-4 shadow-sm">
                   <update.icon className="w-3.5 h-3.5 text-[#FF0000]" />
                 </div>
               </div>

               <div className="flex-1 p-8">
                 <div className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-2">[ RELEASE_{String(updates.length - i).padStart(2, '0')} ]</div>
                 <h3 className="font-display text-xl font-bold text-zinc-900 mb-2">{update.title}</h3>
                 <p className="text-xs font-mono text-zinc-500 mb-5 leading-relaxed max-w-xl">{update.desc}</p>
                 <div className="flex flex-wrap gap-2">
                   {update.features.map(f => (
                       <span key={f} className="px-2.5 py-1 rounded-[3px] bg-[#FAF9F6] border border-zinc-200 text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest">{f}</span>
                   ))}
                 </div>
               </div>
            </div>
          ))}
        </section>
      </main>
      <FooterLight />
    </PageTransition>
  )
}
