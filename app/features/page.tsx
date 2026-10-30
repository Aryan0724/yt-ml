import type { Metadata } from "next";
import Link from "next/link";
import { NavbarLight } from "@/components/landing/navbar-light";
import { Footer } from "@/components/landing/footer";
import { PageTransition } from "@/components/global/page-transition";
import { BreadcrumbSchema, SoftwareAppSchema } from "@/components/seo/json-ld";
import { GitCompare, Target, ShieldAlert, BarChart3, MessageSquare, Zap, RefreshCcw, Layout, Flame, Fingerprint, ArrowRight, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Features: YouTube Packaging & Analysis Tools",
  description: "Explore PreYT's YouTube research and analysis tools, with clear examples of how each feature helps creators plan and evaluate content.",
  alternates: {
    canonical: "https://preyt.integralgroups.in/features",
  },
  openGraph: {
    title: "Features: YouTube Packaging & Analysis Tools",
    description: "Analyze thumbnails, test mobile cutoffs, and discover content gaps before you film.",
    url: "https://preyt.integralgroups.in/features",
    siteName: "PreYT",
  },
  twitter: {
    card: "summary_large_image",
    title: "PreYT Features — YouTube Content Analysis Tools",
    description: "Analyze thumbnails, test mobile cutoffs, and discover content gaps before you film.",
  }
};

const features = [
  {
    title: "Format-Native OpenCV Intelligence",
    desc: "Dedicated visual perception models tailored to your exact video format.",
    icon: Layout,
    details: "Faceless documentary, cooking, gaming, tech, anime, and personality formats are evaluated with niche-specific OpenCV computer vision algorithms."
  },
  {
    title: "Niche Outlier Detection",
    desc: "Reverse-engineer what packaging formulas are breaking out in your niche right now.",
    icon: Flame,
    details: "Scans recent uploads and calculates outlier ratios (3x, 5x, 10x average channel baseline views) so you only produce validated concepts."
  },
  {
    title: "pHash Thumbnail Originality Shield",
    desc: "Perceptual hash analysis to protect against saturated template churn.",
    icon: Fingerprint,
    details: "Calculates a 64-bit DCT perceptual hash fingerprint to classify packaging tropes and score originality against competitor feeds."
  },
  {
    title: "AI A/B Comparison Engine",
    desc: "Side-by-side variant ranking to identify the highest-probability winner.",
    icon: GitCompare,
    details: "Upload up to 4 variants. The engine ranks them by predicted breakout probability and provides relative lift percentages."
  },
  {
    title: "Confidence Calibration & Risk",
    desc: "Know the statistical reliability of your prediction before trusting it.",
    icon: Target,
    details: "We use a confidence interval system (± pts) to tell you exactly how certain the model is about its output."
  },
  {
    title: "Explainability & Action Angles",
    desc: "Structured reasoning and high-converting title formulas behind every score.",
    icon: MessageSquare,
    details: "Understand the 'why' with specific strengths, weaknesses, and 1-click alternative hook formulas."
  }
];

export default function FeaturesPage() {
  return (
    <PageTransition>
      <SoftwareAppSchema />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Features", url: "/features" }
        ]}
      />
      <NavbarLight />
      <main className="pt-24 pb-32 bg-[#FAF9F6] min-h-screen">
        <div className="relative w-full border-b border-zinc-200">
          <div className="absolute top-0 left-[8%] lg:left-[15%] -translate-y-1/2 bg-[#FAF9F6] px-3 text-[8px] font-mono text-zinc-400 font-bold tracking-wider">[ 01 / CAPABILITIES ]</div>
        </div>
        <section className="px-6 max-w-[1200px] mx-auto text-center mb-24 pt-20">
          <div className="text-[9px] font-mono font-bold text-[#FF0000] uppercase tracking-[0.2em] mb-4">[ FULL INTELLIGENCE SUITE ]</div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold mb-6 text-zinc-900 tracking-tight">
            YouTube Thumbnail, Title &amp; <br /><span className="text-[#FF0000]">Packaging Analysis Features</span>
          </h1>
          <p className="text-xs font-mono text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Everything you need to optimize your upload strategy and eliminate performance anxiety before filming.
          </p>
        </section>

        <section className="px-6 max-w-[1200px] mx-auto space-y-16 pb-16">
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

        {/* Free Utilities & Niche Blueprints Internal Navigation Hub */}
        <section className="px-6 max-w-[1200px] mx-auto border-t border-zinc-200 pt-16 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-[9px] font-mono font-bold text-[#FF0000] uppercase tracking-[0.2em] mb-2">[ PUBLIC TOOLS &amp; BLUEPRINTS ]</div>
              <h2 className="font-display text-3xl font-bold text-zinc-900 tracking-tight">Free Creator Diagnostics</h2>
            </div>
            <Link
              href="/tools/youtube-feed-preview"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FF0000] hover:underline"
            >
              Open Mobile Feed Simulator <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/tools/youtube-feed-preview"
              className="p-6 rounded-[4px] bg-white border border-zinc-200 shadow-sm hover:border-black transition-all group space-y-3"
            >
              <div className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest">[ UTILITY ]</div>
              <h3 className="font-bold text-sm text-zinc-900 group-hover:text-[#FF0000] transition-colors">
                Mobile Feed Simulator
              </h3>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                Test your draft thumbnail and title across simulated iPhone and Android viewports before rendering.
              </p>
            </Link>

            <Link
              href="/vs/vidiq"
              className="p-6 rounded-[4px] bg-white border border-zinc-200 shadow-sm hover:border-black transition-all group space-y-3"
            >
              <div className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest">[ COMPARISON ]</div>
              <h3 className="font-bold text-sm text-zinc-900 group-hover:text-[#FF0000] transition-colors">
                PreYT vs vidIQ
              </h3>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                Why modern YouTube distribution rewards visual glanceability over legacy keyword tags.
              </p>
            </Link>

            <Link
              href="/vs/1of10"
              className="p-6 rounded-[4px] bg-white border border-zinc-200 shadow-sm hover:border-black transition-all group space-y-3"
            >
              <div className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest">[ COMPARISON ]</div>
              <h3 className="font-bold text-sm text-zinc-900 group-hover:text-[#FF0000] transition-colors">
                PreYT vs 1of10
              </h3>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                Outlier discovery coupled with 64-bit DCT perceptual hash saturation protection.
              </p>
            </Link>

            <Link
              href="/youtube-packaging/faceless-documentary"
              className="p-6 rounded-[4px] bg-white border border-zinc-200 shadow-sm hover:border-black transition-all group space-y-3"
            >
              <div className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest">[ NICHE BLUEPRINT ]</div>
              <h3 className="font-bold text-sm text-zinc-900 group-hover:text-[#FF0000] transition-colors">
                Faceless Documentary Packaging
              </h3>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                Zero-face penalty override, cool cinematic Kelvin grading, and high-stakes curiosity titles.
              </p>
            </Link>

            <Link
              href="/youtube-packaging/gaming-esports"
              className="p-6 rounded-[4px] bg-white border border-zinc-200 shadow-sm hover:border-black transition-all group space-y-3"
            >
              <div className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest">[ NICHE BLUEPRINT ]</div>
              <h3 className="font-bold text-sm text-zinc-900 group-hover:text-[#FF0000] transition-colors">
                Gaming &amp; Esports Packaging
              </h3>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                Neon HSV saturation thresholds, character rim lighting strokes, and high-contrast diagonal vectors.
              </p>
            </Link>

            <Link
              href="/youtube-packaging/cooking-culinary"
              className="p-6 rounded-[4px] bg-white border border-zinc-200 shadow-sm hover:border-black transition-all group space-y-3"
            >
              <div className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest">[ NICHE BLUEPRINT ]</div>
              <h3 className="font-bold text-sm text-zinc-900 group-hover:text-[#FF0000] transition-colors">
                Cooking &amp; Food Packaging
              </h3>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                Appetite induction, warm 3,000K chrominance, and Laplacian food texture variance.
              </p>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
