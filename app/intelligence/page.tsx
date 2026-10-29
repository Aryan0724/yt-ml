import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { BreadcrumbSchema, FaqSchema, SoftwareAppSchema } from "@/components/seo/json-ld"
import {
  Brain,
  Cpu,
  Layers,
  Search,
  Zap,
  TrendingUp,
  ShieldCheck,
  RefreshCcw,
  Sparkles,
  ArrowRight,
  Eye,
  Camera,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Workflow,
  BarChart3,
  Maximize2
} from "lucide-react"

export const metadata: Metadata = {
  title: "YouTube Creator Intelligence & Video Performance Analytics | PreYT",
  description: "Explore the PreYT intelligence architecture: Forensic title analysis, format-native OpenCV computer vision, 64-bit DCT perceptual hash originality shields, and closed-loop calibration.",
  alternates: {
    canonical: "https://preyt.integralgroups.in/intelligence",
  },
  openGraph: {
    title: "YouTube Creator Intelligence & Video Performance Analytics | PreYT",
    description: "Statistical certainty for YouTube packaging. Linguistic forensics, visual benchmarking, and volatility modeling.",
    url: "https://preyt.integralgroups.in/intelligence",
    siteName: "PreYT",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Creator Intelligence & Video Performance Analytics | PreYT",
    description: "Statistical certainty for YouTube packaging. Linguistic forensics, visual benchmarking, and volatility modeling.",
  }
}

const INTELLIGENCE_FAQS = [
  {
    question: "How does PreYT predict CTR before a video is published?",
    answer: "PreYT processes your draft thumbnail and title through a 5-stage pipeline: (1) NLP semantic curiosity and character-truncation scoring, (2) OpenCV format-native visual forensics measuring luminance contrast and timestamp occlusion, (3) 64-bit DCT perceptual hash saturation checking, (4) channel-baseline view velocity modeling, and (5) archetype-calibrated CTR forecasting."
  },
  {
    question: "Why do traditional tools fail at thumbnail scoring?",
    answer: "Legacy tools apply a flat, one-size-fits-all checklist (e.g., always requiring an exaggerated human face). This penalizes faceless documentary channels (Fern, Moon) and cooking channels, where face presence is irrelevant or counterproductive. PreYT uses format-native archetypes with zero-face penalty overrides and niche-specific color temperature heuristics."
  },
  {
    question: "What is the 64-bit DCT Perceptual Hash (pHash) Originality Shield?",
    answer: "When viral thumbnail concepts are replicated by hundreds of creators, YouTube viewers develop banner fatigue, and browse CTR collapses. PreYT computes a 64-bit Discrete Cosine Transform perceptual fingerprint of your thumbnail and compares it against saturated tropes to ensure your visual composition retains distinctiveness in crowded feeds."
  },
  {
    question: "How does the closed-loop feedback mechanism work?",
    answer: "Once a video is published, PreYT tracks 7-day YouTube Analytics performance and calculates the prediction error delta (Delta = Actual - Predicted). This telemetry recalibrates the elasticity coefficients for that creator's channel over time, compounding accuracy."
  }
]

export default function IntelligencePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 selection:bg-red-100 selection:text-red-900 flex flex-col justify-between">
      <SoftwareAppSchema
        name="PreYT Intelligence Engine"
        description="Pre-upload visual prediction and outlier detection engine for YouTube packaging."
        applicationCategory="BusinessApplication"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Intelligence Engine", url: "/intelligence" }
        ]}
      />
      <FaqSchema items={INTELLIGENCE_FAQS} />
      <Navbar variant="light" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-24">
        {/* Section 1: Hero Header */}
        <section className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold tracking-wider uppercase">
            <Cpu className="w-3.5 h-3.5 text-red-600" />
            <span>ALGORITHMIC ARCHITECTURE // DEEP DIVE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-neutral-950 tracking-tight leading-[1.08]">
            YouTube Creator Intelligence &amp; <br />
            <span className="text-red-600">Video Performance Analytics</span>
          </h1>

          <p className="text-base sm:text-xl text-neutral-600 font-normal leading-relaxed">
            PreYT is not a generic checklist. It is an algorithmic forensic pipeline that decomposes video packaging across visual, linguistic, and historical dimensions to forecast browse performance before filming.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-2xs">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              14.8M Uploads Baseline
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              6 OpenCV Archetype Pipelines
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-2xs">
              <Fingerprint className="w-3.5 h-3.5 text-purple-500" />
              64-bit DCT pHash Shield
            </span>
          </div>
        </section>

        {/* Section 2: 5-Stage Algorithmic Pipeline Visual Flow */}
        <section className="space-y-8">
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">[ PIPELINE SPECIFICATION ]</div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
              The 5-Stage Algorithmic Forensic Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl">
              Every draft submitted to PreYT traverses five distinct analysis layers before generating a single calibrated score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: "01",
                name: "Lexical Entropy",
                tag: "NLP ENGINE",
                desc: "Semantic tension, curiosity delta, power-word positioning, and 54-char mobile ellipsis cutoff.",
                icon: Search,
                metric: "Curiosity Index"
              },
              {
                step: "02",
                name: "Computer Vision",
                tag: "OPENCV 4.8",
                desc: "Kelvin color temp, Canny edge complexity, facial bounding box, and 15% timestamp safe zone.",
                icon: Camera,
                metric: "Glanceability"
              },
              {
                step: "03",
                name: "Originality Shield",
                tag: "64-BIT DCT",
                desc: "Perceptual hashing to detect formula saturation, copycat tropes, and viewer fatigue penalties.",
                icon: Fingerprint,
                metric: "pHash Distance"
              },
              {
                step: "04",
                name: "Velocity Baseline",
                tag: "TIME-SERIES",
                desc: "Calculates channel median views, normalizing for subscriber elasticity and outlier multipliers.",
                icon: TrendingUp,
                metric: "Outlier Ratio"
              },
              {
                step: "05",
                name: "Self-Calibration",
                tag: "FEEDBACK LOOP",
                desc: "Telemetry engine comparing 7-day real outcomes against predictions to eliminate bias.",
                icon: RefreshCcw,
                metric: "Δ Error Tuning"
              }
            ].map((stage, i) => (
              <div
                key={stage.step}
                className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4 hover:border-red-300 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 group-hover:text-red-600">
                      STAGE_{stage.step}
                    </span>
                    <span className="text-[9px] font-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded border border-neutral-200/60">
                      {stage.tag}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-800 group-hover:text-red-600 group-hover:bg-red-50 transition-colors">
                    <stage.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-neutral-950 group-hover:text-red-600 transition-colors">
                    {stage.name}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                    {stage.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-neutral-100 text-[10px] font-mono text-neutral-400">
                  Target: <span className="font-bold text-neutral-700">{stage.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Deep Technical Breakdown — Visual & Linguistic Logic */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Box 1: Computer Vision */}
          <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-mono font-bold uppercase">
                <Camera className="w-3 h-3 text-red-600" />
                <span>OPENCV HEURISTIC ENGINE</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-950">
                Format-Native Visual Processing
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                Generic thumbnail tools punish creators for not having faces. PreYT utilizes an adaptive neural dispatcher that detects content archetype before executing OpenCV routines:
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="flex items-center justify-between text-neutral-900 font-bold">
                  <span>Faceless Documentary Rule:</span>
                  <span className="text-red-600">0% Face Penalty</span>
                </div>
                <p className="text-[11px] text-neutral-500 font-sans">
                  Evaluates 4.8:1 edge contrast and cool Kelvin grade ($5,200K$) instead of demanding human facial reactions.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="flex items-center justify-between text-neutral-900 font-bold">
                  <span>Cooking Chrominance Rule:</span>
                  <span className="text-red-600">Kelvin 2,800K Warmth</span>
                </div>
                <p className="text-[11px] text-neutral-500 font-sans">
                  Inspects red/yellow chrominance in LAB color space and Laplacian texture variance to ensure appetite appeal.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="flex items-center justify-between text-neutral-900 font-bold">
                  <span>Timestamp Danger Zone:</span>
                  <span className="text-red-600">Lower-Right 15%</span>
                </div>
                <p className="text-[11px] text-neutral-500 font-sans">
                  Calculates pixel overlap against YouTube's native duration badge to prevent critical punchline occlusion.
                </p>
              </div>
            </div>
          </div>

          {/* Box 2: pHash Saturation Shield */}
          <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-mono font-bold uppercase">
                <Fingerprint className="w-3 h-3 text-purple-600" />
                <span>64-BIT DCT PERCEPTUAL HASH</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-950">
                The Anti-Burnout Saturation Shield
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                When an outlier goes viral, 50+ creators clone it within 14 days. Viewers develop subconscious visual fatigue, and the YouTube browse algorithm lowers impression allocation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-950 text-white space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">pHash Formula:</span>
                <span className="text-emerald-400">DCT Matrix (8x8 Low-Freq)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Hamming Distance &lt; 10:</span>
                <span className="text-red-400 font-bold">Severe Cliché Penalty (-28% CTR)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Hamming Distance 10–22:</span>
                <span className="text-amber-400">Moderate Formula Saturation</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Hamming Distance &gt; 25:</span>
                <span className="text-emerald-400 font-bold">High Novelty Breakthrough (+45% Lift)</span>
              </div>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              PreYT ensures your concept borrows proven structural curiosity without triggering the browse model&apos;s copycat penalty.
            </p>
          </div>
        </section>

        {/* Section 4: Closed-Loop Calibration Architecture */}
        <section className="p-8 sm:p-12 rounded-3xl bg-neutral-950 text-white space-y-8 shadow-xl">
          <div className="max-w-2xl space-y-2">
            <div className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">[ CLOSED-LOOP TELEMETRY ]</div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Self-Calibrating Error Backpropagation
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Static prediction engines degrade over time as the YouTube recommendation algorithm updates. PreYT incorporates a closed-loop feedback mechanism:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div className="text-neutral-500">[ STEP 01 ]</div>
              <div className="font-bold text-white text-sm">Forecast Emission</div>
              <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                Prior to publishing, PreYT calculates predicted CTR ($\hat{y}$) and assigns a confidence interval ($\pm 4.2\%$).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div className="text-neutral-500">[ STEP 02 ]</div>
              <div className="font-bold text-white text-sm">Real Outcome Telemetry</div>
              <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                7 days post-upload, actual YouTube Analytics CTR ($y$) is ingested via YouTube Data API v3.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div className="text-red-500 font-bold">[ STEP 03 / CALIBRATION ]</div>
              <div className="font-bold text-white text-sm">Delta Recalibration</div>
              <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                $\Delta = y - \hat{y}$ updates the channel elasticity vector, ensuring predictions become progressively more accurate.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Cross-Link to Format Blueprints & Free Simulator */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">[ APPLIED INTELLIGENCE ]</div>
              <h2 className="text-2xl font-bold text-neutral-950">Explore Format-Specific Heuristics</h2>
            </div>
            <Link
              href="/tools/youtube-feed-preview"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline font-mono"
            >
              Launch Free Simulator <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                slug: "faceless-documentary",
                name: "Faceless Documentary",
                spec: "0% Face Penalty · 5,200K Cool Cast"
              },
              {
                slug: "cooking-culinary",
                name: "Cooking & Culinary",
                spec: "Appetite Induction · 2,800K Warmth"
              },
              {
                slug: "gaming-esports",
                name: "Gaming & Esports",
                spec: "HSV Saturation > 180 · Rim Strokes"
              },
              {
                slug: "tech-reviews",
                name: "Tech Reviews",
                spec: "Industrial Silhouette · < 3 Spec Words"
              }
            ].map((niche) => (
              <Link
                key={niche.slug}
                href={`/youtube-packaging/${niche.slug}`}
                className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-red-300 hover:shadow-xs transition-all group space-y-1.5"
              >
                <div className="text-xs font-bold text-neutral-950 group-hover:text-red-600 transition-colors">
                  {niche.name} Blueprint
                </div>
                <div className="text-[11px] font-mono text-neutral-500">
                  {niche.spec}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 6: FAQ Accordion for SEO Rich Snippets */}
        <section className="pt-8 border-t border-neutral-200">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-neutral-950">Frequently Asked Questions</h2>
              <p className="text-xs text-neutral-500 font-mono">[ ARCHITECTURAL PERSPECTIVE ]</p>
            </div>

            <div className="space-y-4">
              {INTELLIGENCE_FAQS.map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-2 shadow-2xs">
                  <h3 className="text-sm font-bold text-neutral-950">{faq.question}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 7: Conversion Banner */}
        <section className="p-8 sm:p-12 rounded-3xl bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">[ INSTANT FEEDBACK ]</div>
            <h3 className="text-2xl font-bold tracking-tight">Put the Intelligence Engine to Work</h3>
            <p className="text-xs text-neutral-400">
              Test your thumbnail in our live feed simulator or run a full pre-upload packaging audit before you film.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/tools/youtube-feed-preview"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              Free Mobile Simulator <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              Sign Up Free
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
