import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { PageTransition } from "@/components/global/page-transition";
import { Target, ShieldCheck, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-44 pb-32 px-6">
        <section className="max-w-4xl mx-auto space-y-24">
            <div className="text-center">
                <h1 className="text-5xl md:text-8xl font-bold mb-8">The Story of <br /><span className="text-gradient">Certainty.</span></h1>
                <p className="text-zinc-500 text-xl leading-relaxed">
                    Diamond Intelligence was born out of a simple observation: creators are working harder than ever, but publishing with less certainty.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 pt-24 border-t border-white/5">
                {[
                    { title: "Our Mission", icon: Target, desc: "To provide creators with professional-grade decision intelligence." },
                    { title: "Our Philosophy", icon: ShieldCheck, desc: "Accuracy over aesthetics. Signal over noise. Certainty over hype." },
                    { title: "Our Studio", icon: Zap, desc: "Built by Integral Groups, a systems-first execution studio." }
                ].map((item) => (
                    <div key={item.title} className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                            <item.icon className="w-6 h-6 text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="p-16 rounded-[3rem] glass-card border-white/5 text-center">
                <h2 className="text-3xl font-bold mb-8">Built for the Professional Creator.</h2>
                <p className="text-zinc-400 leading-relaxed mb-10">
                    We don't build tools for everyone. We build for the serious creator who treats their channel like a high-performance system.
                </p>
            </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
