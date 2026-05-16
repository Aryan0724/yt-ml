import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
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
      <Navbar />
      <main className="pt-44 pb-32">
        <section className="px-6 max-w-7xl mx-auto text-center mb-32">
          <h1 className="text-5xl md:text-8xl font-bold mb-8">The Full Intelligence <br /><span className="text-gradient">Suite.</span></h1>
          <p className="text-zinc-500 text-xl max-w-2xl mx-auto">
            Everything you need to optimize your upload strategy and reduce performance anxiety.
          </p>
        </section>

        <section className="px-6 max-w-7xl mx-auto space-y-32">
          {features.map((feature, i) => (
            <div key={feature.title} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-20 items-center`}>
                <div className="flex-1 space-y-8">
                    <div className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-zinc-400" />
                    </div>
                    <h2 className="text-4xl font-bold">{feature.title}</h2>
                    <p className="text-zinc-400 text-lg leading-relaxed">{feature.desc}</p>
                    <p className="text-zinc-500 leading-relaxed">{feature.details}</p>
                    <div className="pt-4">
                        <button className="flex items-center gap-2 text-sm font-bold text-white group">
                            Explore Technical Docs
                            <Zap className="w-4 h-4 text-blue-500 transition-transform group-hover:scale-125" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 w-full aspect-video rounded-[3rem] bg-zinc-950/50 border border-white/5 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent" />
                    <feature.icon className="w-32 h-32 text-zinc-800 opacity-20" />
                    <div className="absolute bottom-12 left-12 right-12">
                         <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[70%]" />
                         </div>
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
