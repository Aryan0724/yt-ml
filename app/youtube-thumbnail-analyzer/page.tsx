import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { BreadcrumbSchema, FaqSchema, SoftwareAppSchema } from "@/components/seo/json-ld"
import { ThumbnailAnalyzer } from "@/components/tools/thumbnail-analyzer"
import { ArrowRight, CheckCircle2, ShieldCheck, Eye, Layers, Smartphone } from "lucide-react"

export const metadata: Metadata = {
  title: "Free YouTube Thumbnail Analyzer: Contrast & Safe Zones",
  description: "Analyze your YouTube thumbnail for mobile glanceability, dark mode contrast, luminance separation, and the bottom-right timestamp danger zone before uploading.",
  alternates: {
    canonical: "https://preyt.integralgroups.in/youtube-thumbnail-analyzer",
  },
  openGraph: {
    title: "Free YouTube Thumbnail Analyzer | PreYT Creator Intelligence",
    description: "Analyze YouTube thumbnail contrast, safe-zone duration badge overlays, and mobile squint visibility in under 30 seconds.",
    url: "https://preyt.integralgroups.in/youtube-thumbnail-analyzer",
    siteName: "PreYT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free YouTube Thumbnail Analyzer | Check Contrast & Safe Zones",
    description: "Analyze YouTube thumbnail contrast, safe-zone duration badge overlays, and mobile squint visibility.",
  }
}

const THUMBNAIL_ANALYZER_FAQS = [
  {
    question: "What is a YouTube thumbnail analyzer?",
    answer: "A YouTube thumbnail analyzer is a diagnostic tool that evaluates image contrast ratios, luminance distribution, mobile glanceability, and duration timestamp safe areas. It helps creators identify visual flaws that lower click-through rates before publishing videos."
  },
  {
    question: "What is the optimal contrast ratio for a YouTube thumbnail?",
    answer: "For maximum glanceability on small smartphone screens, aim for a subject-to-background contrast ratio of at least 4.5:1. High focal contrast ensures your primary subject immediately separates from the background within 150 milliseconds of scrolling."
  },
  {
    question: "Where is the YouTube thumbnail danger zone located?",
    answer: "The bottom-right quadrant (approximately 15% to 20% of the canvas area) is permanently covered by YouTube's video duration badge (e.g., '14:28'). Never place facial expressions, punchline text, key products, or brand logos in this corner."
  },
  {
    question: "Why does dark mode contrast matter for thumbnails?",
    answer: "Over 68% of YouTube mobile watch time occurs on Dark Mode feeds. Dark thumbnails with low perimeter luminance bleed into the black background, causing viewers to scroll past without noticing the composition. Adding 15% edge rim lighting ensures immediate isolation."
  },
  {
    question: "What is the 120-pixel squint test?",
    answer: "The squint test is a visual processing benchmark: when a thumbnail is scaled down to 120 pixels wide (typical smartphone feed dimension) or viewed with narrowed eyes, can a viewer instantly comprehend the central subject and emotional tension? Cluttered thumbnails fail this test."
  }
]

export default function YouTubeThumbnailAnalyzerPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-red-100 selection:text-red-900">
      <SoftwareAppSchema
        name="PreYT YouTube Thumbnail Analyzer"
        description="Free online YouTube thumbnail analyzer for contrast ratios, safe-zone timestamp detection, and mobile glanceability scoring."
        applicationCategory="DesignApplication"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/features" },
          { name: "YouTube Thumbnail Analyzer", url: "/youtube-thumbnail-analyzer" }
        ]}
      />
      <FaqSchema items={THUMBNAIL_ANALYZER_FAQS} />
      <Navbar variant="light" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Editorial Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono uppercase tracking-wider">
            <span>[ FREE BROWSER UTILITY // ZERO SIGNUP ]</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
            YouTube Thumbnail Analyzer: <br />
            <span className="text-red-600">Contrast, Safe Zones &amp; Glanceability</span>
          </h1>

          {/* 50-Word Direct Answer for Google AI Overviews & Featured Snippet */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-2xl mx-auto font-normal">
            A YouTube thumbnail analyzer tests your image for mobile contrast, luminance separation, and safe zones before uploading. By evaluating edge separation against dark and light feeds and keeping key subjects out of the bottom-right timestamp zone, creators optimize mobile glanceability and improve click-through rates (CTR).
          </div>
        </div>

        {/* Interactive Analyzer Tool */}
        <ThumbnailAnalyzer />

        {/* Technical Architecture Deep Dive */}
        <section className="mt-24 pt-16 border-t border-neutral-200 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">
              [ PACKAGING FORENSICS ]
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950">
              The Three Visual Pillars of High-CTR Thumbnails
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              YouTube algorithms do not evaluate thumbnails by subjective artistic taste. They measure the statistical rate at which impressions convert into clicks. That conversion hinges on three visual variables:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold font-mono text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-neutral-950">Luminance Edge Contrast</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                When a user scrolls at high thumb velocity, the visual cortex processes brightness contrast first, before text or fine shapes. If your subject lacks rim lighting or luminance separation from the background, the eye never slows down.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-900 font-bold font-mono text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-neutral-950">The Bottom-Right Safe Area</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                The native video duration clock overlay covers the lower-right 15% of your canvas. Punchline text, critical reactions, or key props located in this danger zone become completely illegible on smartphones.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-900 font-bold font-mono text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-neutral-950">120px Mobile Squint Viability</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Over 72% of impressions occur on mobile feeds where thumbnails are roughly 120 pixels wide. If your thumbnail requires desktop-scale resolution to understand, it will underperform in the initial recommendation tier.
              </p>
            </div>
          </div>
        </section>

        {/* Cross-Link Cluster */}
        <section className="mt-16 p-8 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-neutral-950">Need to check your draft title as well?</h3>
            <p className="text-xs text-neutral-600">
              Run your video title through our free Title Analyzer to detect mobile 54-character cutoffs and curiosity gaps.
            </p>
          </div>
          <Link
            href="/youtube-title-analyzer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            Open Title Analyzer <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FAQ Section */}
        <section className="mt-20 pt-16 border-t border-neutral-200">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-neutral-950">Frequently Asked Questions</h2>
              <p className="text-xs text-neutral-500 font-mono">[ THUMBNAIL DIAGNOSTICS &amp; SAFE ZONES ]</p>
            </div>

            <div className="space-y-4">
              {THUMBNAIL_ANALYZER_FAQS.map((faq, i) => (
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
