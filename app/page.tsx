import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { PageTransition } from "@/components/global/page-transition";
import { Hero } from "@/components/landing/hero";
import { ActivityPulse } from "@/components/landing/activity-pulse";
import { Preview } from "@/components/landing/preview";
import { Waitlist } from "@/components/landing/waitlist";
import { AmbientBackground } from "@/components/global/ambient-background";
import { Zap, GitCompare, Target, ShieldAlert, BarChart3, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <PageTransition>
      <Navbar />
      <div className="relative min-h-screen bg-zinc-950 text-white">
        {/* Dynamic cybernetic network grid and moving gradient auras */}
        <AmbientBackground />
        
        <main className="flex-1 overflow-hidden relative z-10">
          <Hero />
          <ActivityPulse />
          
          {/* Live Intelligence Showcase */}
          <section className="bg-zinc-950/30 py-32 px-6 border-y border-white/5 relative">
              <div className="absolute top-0 left-0 w-full h-full noise-bg opacity-30" />
              <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-24 relative z-10">
                  <span className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-4">Live Diagnostic Demo</span>
                  <h2 className="text-4xl md:text-6xl font-bold mb-8">Understand the <span className="text-gradient">Signal.</span></h2>
                  <p className="text-zinc-500 text-lg max-w-2xl leading-relaxed">
                      Watch the engine dissect a metadata concept in real-time. Identify hooks, focal points, and volatility before publish.
                  </p>
              </div>
              <div className="relative z-10">
                  <Preview />
              </div>
          </section>

          {/* Features Grid */}
          <section id="features" className="section-padding bg-transparent">
              <div className="max-w-7xl mx-auto">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[
                          { title: "Thumbnail Intelligence", icon: BarChart3, desc: "Visual quality audit across all niches." },
                          { title: "Comparison Engine", icon: GitCompare, desc: "Side-by-side variant ranking logic." },
                          { title: "Confidence Calibration", icon: Target, desc: "Map prediction reliability (± pts)." },
                          { title: "Volatility Detection", icon: ShieldAlert, desc: "Identify high-risk experimental ideas." },
                          { title: "Explainability Layer", icon: MessageSquare, desc: "Reasoning behind every score." },
                          { title: "Niche Calibration", icon: Zap, desc: "Calibrated for Gaming, Tech, and more." }
                      ].map((feature, i) => (
                          <div key={i} className="p-10 rounded-[2.5rem] glass-card border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 premium-shadow group">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/10 transition-colors">
                                  <feature.icon className="w-5 h-5 text-zinc-500 group-hover:text-blue-500" />
                              </div>
                              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                              <p className="text-zinc-500 text-sm leading-relaxed mb-6">{feature.desc}</p>
                              <Link href="/features" className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest group-hover:text-white transition-colors">Learn More</Link>
                          </div>
                      ))}
                  </div>
              </div>
          </section>

          <section className="py-32 bg-transparent overflow-hidden relative border-t border-white/5">
              <div className="max-w-7xl mx-auto px-6 text-center">
                  <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to publish with <br /><span className="text-gradient">confidence?</span></h2>
                  <div className="flex justify-center gap-4 pt-8">
                      <Link href="/waitlist" className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all">Join Closed Beta</Link>
                      <Link href="/intelligence" className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 font-bold hover:bg-white/10 transition-all">Explore Tech</Link>
                  </div>
              </div>
          </section>

          <Waitlist />
        </main>
      </div>
      <Footer />
    </PageTransition>
  );
}
