import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { PageTransition } from "@/components/global/page-transition";
import { Boxes, Zap, Globe, Cpu, Target } from "lucide-react";

export default function IntegralGroupsPage() {
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-44 pb-32 relative overflow-hidden">
        {/* Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-[0.05] pointer-events-none">
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-zinc-500 rounded-full blur-[200px]" />
        </div>

        <section className="px-6 max-w-7xl mx-auto text-center mb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-8">
            Studio Profile
          </div>
          <h1 className="text-5xl md:text-8xl font-bold mb-8">Built Under the <br /><span className="text-gradient">Integral Groups.</span></h1>
          <p className="text-zinc-400 text-xl max-w-3xl mx-auto leading-relaxed">
            An execution-first systems studio focused on intelligent infrastructure, automation, and next-generation digital products.
          </p>
        </section>

        <section className="px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="p-12 rounded-[3rem] glass-card border-white/5 space-y-8">
                <div className="w-16 h-16 rounded-[2rem] bg-white/5 flex items-center justify-center">
                    <Boxes className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-3xl font-bold">Systems Thinking.</h3>
                <p className="text-zinc-500 leading-relaxed">
                    We don't build features; we build systems. Every product under Integral Groups is an iteration on an intelligent architecture designed for scalability and operational excellence.
                </p>
            </div>
            <div className="p-12 rounded-[3rem] glass-card border-white/5 space-y-8">
                <div className="w-16 h-16 rounded-[2rem] bg-white/5 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-3xl font-bold">Execution First.</h3>
                <p className="text-zinc-500 leading-relaxed">
                    The difference between a research project and a product is execution. We prioritize performance, reliability, and real-world impact over abstract complexity.
                </p>
            </div>
        </section>

        <section className="mt-44 px-6 max-w-7xl mx-auto text-center">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold mb-16">Intelligence as <br />Infrastructure.</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "AI Infrastructure", icon: Cpu },
                        { label: "Global Systems", icon: Globe },
                        { label: "Creator Intelligence", icon: Target },
                        { label: "Future Automation", icon: Zap }
                    ].map((item) => (
                        <div key={item.label} className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                                <item.icon className="w-5 h-5 text-zinc-500" />
                            </div>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
