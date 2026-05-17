import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { PageTransition } from "@/components/global/page-transition";
import { Search, Layers, TrendingUp, ShieldCheck, Zap, RefreshCcw } from "lucide-react";

export default function IntelligencePage() {
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-32 pb-24">
        <section className="px-6 max-w-7xl mx-auto mb-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-8">The Engine of <br /><span className="text-gradient">Certainty.</span></h1>
            <p className="text-zinc-400 text-xl leading-relaxed">
              AlgoPilot isn't a recommendation tool. It's a psychological forensic engine that dissects performance signals across visual and linguistic dimensions.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
          {[
            { 
              title: "Linguistic Forensic", 
              desc: "Deep analysis of hook strength, curiosity gaps, and power-word placement.",
              icon: Search
            },
            { 
              title: "Visual Benchmarking", 
              desc: "Niche-specific visual rules for saturation, contrast, and focal points.",
              icon: Layers
            },
            { 
              title: "Confidence Calibration", 
              desc: "Evaluating the stability of a prediction based on historical niche variance.",
              icon: TrendingUp
            },
            { 
              title: "Volatility Logic", 
              desc: "Identifying if a concept is high-risk/high-novelty or a stable predictable performer.",
              icon: ShieldCheck
            },
            { 
              title: "Feedback Memory", 
              desc: "Learning from real-world upload outcomes to refine the ensemble weightings.",
              icon: RefreshCcw
            },
            { 
              title: "Step-by-Step Fixes", 
              desc: "Actionable technical instructions to boost a thumbnail's performance tier.",
              icon: Zap
            }
          ].map((item, i) => (
            <div key={item.title} className="p-10 rounded-[2rem] glass-card border-white/5 hover:border-white/10 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-32 px-6 max-w-7xl mx-auto">
           <div className="p-16 rounded-[3rem] bg-gradient-to-br from-zinc-900/50 to-black border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <Zap className="w-64 h-64" />
             </div>
             <div className="max-w-2xl relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-8">Research-Grade Infrastructure.</h2>
                 <p className="text-zinc-400 mb-10 leading-relaxed text-lg">
                  We leverage an ensemble of CatBoost classifiers and behavioral psychology rules to minimize Mean Absolute Error (MAE) and maximize breakout probability.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-zinc-500 uppercase tracking-widest">Ensemble Architecture</div>
                  <div className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-zinc-500 uppercase tracking-widest">Psychological Proxies</div>
                  <div className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-zinc-500 uppercase tracking-widest">Niche Calibration</div>
                </div>
             </div>
           </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
