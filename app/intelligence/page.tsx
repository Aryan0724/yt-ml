import type { Metadata } from "next";
import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { PageTransition } from "@/components/global/page-transition";
import { BreadcrumbSchema } from "@/components/seo/json-ld";
import { Search, Layers, TrendingUp, ShieldCheck, Zap, RefreshCcw } from "lucide-react";

export const metadata: Metadata = {
  title: "Intelligence Engine — PreYT Algorithmic Architecture",
  description: "Explore the PreYT intelligence architecture: Forensic title analysis, format-native OpenCV computer vision, and feedback-loop calibration.",
  alternates: {
    canonical: "/intelligence",
  },
  openGraph: {
    title: "PreYT Intelligence Engine — Algorithmic Packaging Forensics",
    description: "Statistical certainty for YouTube packaging. Linguistic forensics, visual benchmarking, and volatility modeling.",
    url: "https://preyt.integralgroups.in/intelligence",
    siteName: "PreYT",
  },
  twitter: {
    card: "summary_large_image",
    title: "PreYT Intelligence Engine — Algorithmic Packaging Forensics",
    description: "Statistical certainty for YouTube packaging. Linguistic forensics, visual benchmarking, and volatility modeling.",
  }
};

const modules = [
  { 
    title: "Linguistic Forensics", 
    desc: "Deep analysis of hook strength, curiosity gaps, and power-word placement.",
    icon: Search
  },
  { 
    title: "Visual Benchmarking", 
    desc: "Format-native OpenCV computer vision for saturation, contrast, and focal point salience.",
    icon: Layers
  },
  { 
    title: "Confidence Calibration", 
    desc: "Evaluating the stability of a prediction based on historical niche variance and model certainty.",
    icon: TrendingUp
  },
  { 
    title: "Volatility Logic", 
    desc: "Identifying if a concept is high-risk/high-novelty or a stable predictable performer.",
    icon: ShieldCheck
  },
  { 
    title: "Feedback Memory & Calibration", 
    desc: "Learning from real-world upload outcomes to self-calibrate channel elasticity.",
    icon: RefreshCcw
  },
  { 
    title: "Step-by-Step Fixes", 
    desc: "Actionable technical instructions to boost a thumbnail's performance tier.",
    icon: Zap
  }
];

export default function IntelligencePage() {
  return (
    <PageTransition>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Intelligence", url: "/intelligence" }
        ]}
      />
      <Navbar />
      <main className="pt-32 pb-24">
        <section className="px-6 max-w-7xl mx-auto mb-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-8">The Engine of <br /><span className="text-gradient">Certainty.</span></h1>
            <p className="text-zinc-400 text-xl leading-relaxed">
              PreYT isn't a recommendation tool. It's a psychological forensic engine that dissects performance signals across visual and linguistic dimensions before you publish.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
          {modules.map((item) => (
            <div key={item.title} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <item.icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold mb-3">{item.title}</h2>
              <p className="text-zinc-400 leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
