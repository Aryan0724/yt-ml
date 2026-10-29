import type { Metadata } from "next";
import { NavbarLight } from "@/components/landing/navbar-light";
import { Footer } from "@/components/landing/footer";
import { PageTransition } from "@/components/global/page-transition";
import { BreadcrumbSchema } from "@/components/seo/json-ld";
import { Zap, RefreshCcw, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog & Release Notes | PreYT YouTube Analytics Platform",
  description: "Track the evolution of the PreYT Creator Decision Engine: Model updates, format-native computer vision releases, and algorithmic upgrades.",
  alternates: {
    canonical: "https://preyt.integralgroups.in/changelog",
  },
  openGraph: {
    title: "Changelog & Release Notes | PreYT YouTube Analytics Platform",
    description: "Track new features, model upgrades, and packaging intelligence improvements.",
    url: "https://preyt.integralgroups.in/changelog",
    siteName: "PreYT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Changelog & Release Notes | PreYT YouTube Analytics Platform",
    description: "Track new features, model upgrades, and packaging intelligence improvements.",
  }
};

const updates = [
  {
    version: "6.0.0",
    date: "October 2026",
    title: "The Format-Native & Outlier Release",
    desc: "Launched format-native OpenCV computer-vision pipelines (Faceless, Cooking, Gaming, Tech), pHash thumbnail originality shield, and niche outlier scanner.",
    icon: Sparkles,
    features: ["Format-Native OpenCV CV", "Niche Outlier Ratio Detection (3x/5x/10x)", "pHash Thumbnail Originality", "Closed-Loop Feedback Self-Calibration"]
  },
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
    version: "1.0.0",
    date: "March 2026",
    title: "Initial System Launch",
    desc: "PreYT v1.0 engine deployed with title hook evaluation, basic thumbnail contrast testing, and early creator beta testing.",
    icon: Zap,
    features: ["Title Hook Evaluator", "Contrast Scoring", "Initial Feed Simulator"]
  }
];

export default function ChangelogPage() {
  return (
    <PageTransition>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Changelog", url: "/changelog" }
        ]}
      />
      <NavbarLight />
      <main className="pt-24 pb-32 px-6 bg-[#FAF9F6] min-h-screen">
        <section className="max-w-[1200px] mx-auto space-y-16 pt-12">
            <div>
                <div className="text-[9px] font-mono font-bold text-[#FF0000] uppercase tracking-[0.2em] mb-4">[ RELEASES // TELEMETRY ]</div>
                <h1 className="font-display text-4xl sm:text-6xl font-bold mb-4 text-zinc-900 tracking-tight">
                  PreYT Platform Changelog <br /><span className="text-[#FF0000]">&amp; Release Notes</span>
                </h1>
                <p className="text-xs font-mono text-zinc-500 leading-relaxed max-w-2xl">
                    Every algorithmic update, computer vision refinement, and feature release documented with technical precision.
                </p>
            </div>

            <div className="space-y-6">
                {updates.map((update) => (
                    <div key={update.version} className="p-8 rounded-[4px] bg-white border border-zinc-200 shadow-[2px_2px_0px_rgba(0,0,0,0.04)] space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                            <span className="font-mono text-xs font-bold text-[#FF0000] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                                v{update.version}
                            </span>
                            <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">{update.date}</span>
                        </div>
                        <h2 className="font-display text-2xl font-bold text-zinc-900">{update.title}</h2>
                        <p className="text-xs font-mono text-zinc-500 leading-relaxed">{update.desc}</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {update.features.map((f) => (
                                <span key={f} className="text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-1 bg-white border border-zinc-200 text-zinc-600 rounded-[2px]">
                                    + {f}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
