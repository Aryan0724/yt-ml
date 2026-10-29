import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sliders,
  Eye,
  Camera,
  Maximize2
} from "lucide-react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { BreadcrumbSchema, FaqSchema, SoftwareAppSchema } from "@/components/seo/json-ld"
import {
  NICHE_PACKAGING_DATA,
  getAllNicheSlugs,
  getNicheData
} from "@/lib/niche-packaging-data"

interface PageProps {
  params: Promise<{
    niche: string
  }>
}

export async function generateStaticParams() {
  const slugs = getAllNicheSlugs()
  return slugs.map((slug) => ({
    niche: slug
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const niche = getNicheData(resolvedParams.niche)

  if (!niche) {
    return {
      title: "Packaging Guide Not Found | PreYT",
      description: "Niche packaging blueprint not found."
    }
  }

  return {
    title: `${niche.name} YouTube Packaging Blueprint & CTR Benchmarks | PreYT`,
    description: niche.metaDescription,
    alternates: {
      canonical: `/youtube-packaging/${niche.slug}`,
    },
    openGraph: {
      title: `${niche.name} YouTube Packaging Blueprint & CTR Benchmarks`,
      description: niche.metaDescription,
      url: `https://preyt.integralgroups.in/youtube-packaging/${niche.slug}`,
      siteName: "PreYT",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${niche.name} YouTube Packaging Blueprint & CTR Benchmarks`,
      description: niche.metaDescription,
    }
  }
}

export default async function NichePackagingPage({ params }: PageProps) {
  const resolvedParams = await params
  const niche = getNicheData(resolvedParams.niche)

  if (!niche) {
    notFound()
  }

  const allNiches = Object.values(NICHE_PACKAGING_DATA).filter((n) => n.slug !== niche.slug)

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-red-100 selection:text-red-900 pt-16">
      <SoftwareAppSchema
        name={`PreYT ${niche.name} Packaging Intelligence`}
        description={niche.metaDescription}
        applicationCategory="DesignApplication"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "YouTube Packaging Benchmarks", url: "/features" },
          { name: niche.name, url: `/youtube-packaging/${niche.slug}` }
        ]}
      />
      <FaqSchema items={niche.faqs} />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Editorial Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono uppercase tracking-wider">
            <span>[ ARCHETYPE // {niche.archetypeCode} ]</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
            {niche.headline}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
            {niche.subtitle}. Architectural packaging heuristics, OpenCV computer-vision thresholds, and proven title formulas calibrated for modern YouTube recommendation feeds.
          </p>
        </div>

        {/* Core Benchmark Key Metrics Grid */}
        <section className="space-y-4">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
            [ ARCHETYPE_METRIC_BENCHMARKS ]
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase">Target CTR Range</div>
              <div className="text-xl sm:text-2xl font-black text-neutral-950">{niche.benchmarks.targetCtrRange}</div>
              <div className="text-[11px] text-neutral-500">Initial browse impression batches</div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase">Optimal Title Words</div>
              <div className="text-xl sm:text-2xl font-black text-neutral-950">{niche.benchmarks.optimalWordsInTitle}</div>
              <div className="text-[11px] text-neutral-500">Mobile glance speed</div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase">Mobile Ellipsis Cutoff</div>
              <div className="text-xl sm:text-2xl font-black text-neutral-950">{niche.benchmarks.mobileCutoffChar} chars</div>
              <div className="text-[11px] text-neutral-500">Character limit before &quot;...&quot;</div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase">Face Required?</div>
              <div className="text-xl sm:text-2xl font-black text-red-600">
                {niche.benchmarks.faceRequired ? "Yes (25-45% Area)" : "No (0% Face Penalty)"}
              </div>
              <div className="text-[11px] text-neutral-500">Heuristic model weight</div>
            </div>
          </div>
        </section>

        {/* OpenCV Computer Vision Specifications */}
        <section className="space-y-6 pt-4">
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">[ COMPUTER VISION FORENSICS ]</div>
            <h2 className="text-2xl font-bold text-neutral-950">PreYT OpenCV Algorithmic Rules for {niche.name}</h2>
            <p className="text-xs text-neutral-600">
              Unlike generic tools that apply a flat checklist to every video, PreYT evaluates your packaging against these format-specific computer vision heuristics:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {niche.openCvHeuristics.map((heuristic, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
                <div className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-widest">
                  [ HEURISTIC_0{idx + 1} ]
                </div>
                <h3 className="text-sm font-bold text-neutral-950">{heuristic.rule}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{heuristic.technicalExplanation}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-neutral-100/70 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-neutral-900">Color Grading Calibration: </span>
              <span className="text-neutral-600">{niche.benchmarks.idealColorTemp} · Contrast Ratio: {niche.benchmarks.contrastRatio}</span>
            </div>
            <span className="font-mono text-[11px] text-neutral-500 bg-white px-2 py-1 rounded border border-neutral-200 shrink-0">
              {niche.benchmarks.saturationProfile}
            </span>
          </div>
        </section>

        {/* High-CTR Title Formulas Lab */}
        <section className="space-y-6 pt-4">
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">[ FORMULA ARCHITECTURE ]</div>
            <h2 className="text-2xl font-bold text-neutral-950">Proven Title Syntaxes for {niche.name}</h2>
            <p className="text-xs text-neutral-600">
              Title formulas engineered to create an irresolvable curiosity gap within the first 6 words.
            </p>
          </div>

          <div className="space-y-4">
            {niche.titleFormulas.map((formula, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-mono font-bold text-neutral-900">{formula.formula}</div>
                  <div className="text-[10px] font-mono text-red-700 bg-red-100/60 px-2.5 py-0.5 rounded-full shrink-0">
                    {formula.curiosityTrigger}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-neutral-200 text-xs font-medium text-neutral-800">
                  <span className="text-neutral-400 font-mono text-[11px] mr-2">Example:</span>
                  &quot;{formula.example}&quot;
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common Packaging Mistakes & Architectural Fixes */}
        <section className="space-y-6 pt-4">
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">[ FAILURE MODES ]</div>
            <h2 className="text-2xl font-bold text-neutral-950">Common Packaging Traps in {niche.name}</h2>
            <p className="text-xs text-neutral-600">
              Why technically well-produced videos die in the initial impression batches:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {niche.packagingMistakes.map((mistake, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-600">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>MISTAKE: {mistake.mistake}</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{mistake.whyItHurts}</p>
                </div>
                <div className="pt-3 border-t border-neutral-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>THE FIX:</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{mistake.theFix}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Free Tool Cross-Promotion Banner */}
        <section className="p-8 rounded-2xl bg-neutral-950 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">[ FREE TESTING UTILITY ]</div>
            <h2 className="text-xl font-bold">Preview Your {niche.name} Thumbnail Live</h2>
            <p className="text-xs text-neutral-400 max-w-xl">
              Upload your draft thumbnail and title into our mobile feed simulator. Check timestamp safe-areas and character cutoffs before rendering final video assets.
            </p>
          </div>
          <Link
            href="/tools/youtube-feed-preview"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            Launch Free Previewer <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Other Niche Hubs Internal Links */}
        <section className="pt-8 border-t border-neutral-200 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-neutral-950">Explore Other YouTube Format Blueprints</h2>
            <p className="text-xs text-neutral-500 font-mono">[ ARCHETYPE DIRECTORY ]</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allNiches.map((otherNiche) => (
              <Link
                key={otherNiche.slug}
                href={`/youtube-packaging/${otherNiche.slug}`}
                className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-red-300 transition-all group space-y-1.5"
              >
                <div className="text-[9px] font-mono font-bold text-neutral-400 group-hover:text-red-600 uppercase tracking-wider">
                  [ {otherNiche.archetypeCode} ]
                </div>
                <div className="text-xs font-bold text-neutral-950 group-hover:text-red-600 transition-colors">
                  {otherNiche.name}
                </div>
                <div className="text-[11px] text-neutral-500 line-clamp-2">
                  {otherNiche.subtitle}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Accordion Section for SEO Rich Snippets */}
        <section className="pt-8 border-t border-neutral-200">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-neutral-950">Frequently Asked Questions</h2>
              <p className="text-xs text-neutral-500 font-mono">[ {niche.name.toUpperCase()} PACKAGING INTEL ]</p>
            </div>

            <div className="space-y-4">
              {niche.faqs.map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <h3 className="text-sm font-bold text-neutral-950">{faq.question}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
