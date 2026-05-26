import { NavbarLight } from "@/components/landing/navbar-light";
import { FooterLight } from "@/components/landing/footer-light";
import { PageTransition } from "@/components/global/page-transition";
import { GitCompare, Target, ShieldAlert, BarChart3, MessageSquare, Zap, RefreshCcw, Layout } from "lucide-react";

const features = [
  {
    title: "Thumbnail Intelligence",
    desc: "A full-spectrum diagnostic of visual signals, focal points, and saturation levels.",
    icon: Layout,
    details: "Our engine evaluates every pixel against niche-specific benchmarks to ensure maximum visual visibility on mobile and desktop."
  },
  {
    title: "AI Comparison Engine",
    desc: "Side-by-side variant ranking to identify the highest-probability winner.",
    icon: GitCompare,
    details: "Upload up to 5 variants. The engine ranks them by predicted breakout probability and provides relative lift percentages."
  },
  {
    title: "Confidence Calibration",
    desc: "Know the reliability of your prediction before you trust it.",
    icon: Target,
    details: "We use a confidence interval system (± pts) to tell you exactly how certain the model is about its output."
  },
  {
    title: "Volatility Detection",
    desc: "Identify high-risk experimental content vs stable performers.",
    icon: ShieldAlert,
    details: "Flag content that relies on extreme novelty or trends, allowing you to balance your content strategy risk."
  },
  {
    title: "Explainability Layer",
    desc: "Structured reasoning behind every intelligence score.",
    icon: MessageSquare,
    details: "Understand the 'why' with specific strengths and weaknesses identified for every analysis."
  },
  {
    title: "Decision Assistance",
    desc: "Step-by-step actionable fixes to boost your performance tier.",
    icon: Zap,
    details: "Get technical instructions on brightness, contrast, and linguistic changes to improve your scores."
  }
]

export default function FeaturesPage() {
  return (
    <PageTransition>
      <NavbarLight />
      <main className="pt-24 pb-32 bg-[#FAF9F6] min-h-screen">
        <div className="relative w-full border-b border-zinc-200">
          <div className="absolute top-0 left-[8%] lg:left-[15%] -translate-y-1/2 bg-[#FAF9F6] px-3 text-[8px] font-mono text-zinc-400 font-bold tracking-wider">[ 01 / CAPABILITIES ]</div>
        </div>
        <section className="px-6 max-w-[1200px] mx-auto text-center mb-24 pt-20">
          <div className="text-[9px] font-mono font-bold text-[#FF0000] uppercase tracking-[0.2em] mb-4">[ FULL INTELLIGENCE SUITE ]</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-zinc-900 tracking-tight">
            The Full Intelligence <br /><span className="text-[#FF0000]">Suite.</span>
          </h1>
          <p className="text-xs font-mono text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Everything you need to optimize your upload strategy and reduce performance anxiety.
          </p>
        </section>

        <section className="px-6 max-w-[1200px] mx-auto space-y-16 pb-8">
          {features.map((feature, i) => (
            <div key={feature.title} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center border-t border-zinc-200 pt-16`}>
                <div className="flex-1 space-y-6">
                    <div className="w-12 h-12 rounded-[4px] bg-white border border-zinc-200 flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.04)]">
                        <feature.icon className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest">[ {String(i + 1).padStart(2, '0')} / MODULE ]</div>
                    <h2 className="font-display text-3xl font-bold text-zinc-900 tracking-tight">{feature.title}</h2>
                    <p className="text-sm font-mono text-zinc-500 leading-relaxed">{feature.desc}</p>
                    <p className="text-xs font-mono text-zinc-400 leading-relaxed">{feature.details}</p>
                    <div className="pt-2">
                        <button className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-600 hover:text-black uppercase tracking-widest transition-colors">
                            Explore Technical Docs
                            <Zap className="w-3 h-3 text-[#FF0000]" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 w-full aspect-video rounded-[4px] bg-white border border-zinc-200 relative overflow-hidden flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,0.04)]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    <feature.icon className="w-24 h-24 text-zinc-100" />
                    <div className="absolute bottom-8 left-8 right-8">
                         <div className="h-1 w-full bg-zinc-100 rounded overflow-hidden">
                            <div className="h-full bg-[#FF0000]/60 w-[70%]" />
                         </div>
                         <div className="text-[7px] font-mono text-zinc-400 mt-1.5 uppercase tracking-widest">Performance Index</div>
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
