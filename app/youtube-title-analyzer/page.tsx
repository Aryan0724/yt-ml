import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { BreadcrumbSchema, FaqSchema, SoftwareAppSchema } from "@/components/seo/json-ld"
import { TitleAnalyzer } from "@/components/tools/title-analyzer"
import { ArrowRight, CheckCircle2, ShieldCheck, Smartphone, Sparkles, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Free YouTube Title Analyzer: Mobile Cutoffs & Score",
  description: "Analyze your YouTube video titles for 54-character mobile truncation, curiosity gap strength, and emotional power words. Get instant high-CTR title alternatives.",
  alternates: {
    canonical: "https://preyt.integralgroups.in/youtube-title-analyzer",
  },
  openGraph: {
    title: "Free YouTube Title Analyzer | PreYT Creator Intelligence",
    description: "Check your YouTube title for mobile cutoffs, power words, and curiosity loops in real time.",
    url: "https://preyt.integralgroups.in/youtube-title-analyzer",
    siteName: "PreYT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free YouTube Title Analyzer | Mobile Cutoffs & Curiosity Score",
    description: "Check your YouTube title for mobile cutoffs, power words, and curiosity loops in real time.",
  }
}

const TITLE_ANALYZER_FAQS = [
  {
    question: "What is the best title length for a YouTube video?",
    answer: "The optimal YouTube title length is between 40 and 52 characters (6 to 9 words). This ensures your entire title and curiosity hook remain visible on smartphone screens without being abruptly truncated with an ellipsis (...)."
  },
  {
    question: "Where does YouTube cut off titles on mobile?",
    answer: "On both iOS and Android YouTube apps, titles are typically truncated between 50 and 55 characters depending on character width. Any crucial information placed after character 54 is hidden behind an ellipsis until a user clicks the video."
  },
  {
    question: "What is a 'curiosity gap' in a YouTube title?",
    answer: "A curiosity gap is the cognitive dissonance created when a title gives the viewer enough context to understand what the video is about, but withholds the outcome, creating an irresistible psychological urge to click to resolve the tension."
  },
  {
    question: "Do numbers in YouTube titles increase CTR?",
    answer: "Yes. Empirical studies across millions of uploads show that specific numbers (e.g. '$10,000', '48 Hours', '3 Mistakes') increase click-through rates by an average of 14% to 19% because they signal concrete, measurable value rather than vague advice."
  },
  {
    question: "Should I include keywords in my YouTube title for SEO?",
    answer: "Yes, but prioritize human curiosity over keyword stuffing. YouTube search accounts for less than 15% of views for most channels; the vast majority come from Browse and Suggested feeds where human emotional tension and glanceability drive 85%+ of clicks."
  }
]

export default function YouTubeTitleAnalyzerPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-red-100 selection:text-red-900">
      <SoftwareAppSchema
        name="PreYT YouTube Title Analyzer"
        description="Free online YouTube video title analyzer for mobile character limits, curiosity gap evaluation, and high-CTR hook recommendations."
        applicationCategory="BusinessApplication"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/features" },
          { name: "YouTube Title Analyzer", url: "/youtube-title-analyzer" }
        ]}
      />
      <FaqSchema items={TITLE_ANALYZER_FAQS} />
      <Navbar variant="light" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Editorial Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono uppercase tracking-wider">
            <span>[ FREE CREATOR UTILITY // ZERO SIGNUP ]</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
            YouTube Title Analyzer: <br />
            <span className="text-red-600">Mobile Cutoffs &amp; Curiosity Score</span>
          </h1>

          {/* 50-Word Direct Answer for Google AI Overviews & Featured Snippet */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-2xl mx-auto font-normal">
            A YouTube title analyzer evaluates your video title for mobile truncation limits, curiosity gap strength, emotional power words, and click potential before publishing. Because 72% of views occur on mobile feeds where titles cut off after 54 characters, keeping your primary hook concise prevents viewers from scrolling past.
          </div>
        </div>

        {/* Interactive Analyzer Tool */}
        <TitleAnalyzer />

        {/* Technical Architecture Deep Dive */}
        <section className="mt-24 pt-16 border-t border-neutral-200 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">
              [ TITLE SYNTAX SCIENCE ]
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950">
              The Anatomy of a High-Converting YouTube Title
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              Analyzing millions of browse feed impressions reveals consistent syntax patterns that separate viral outliers from videos that stall at initial distribution:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold font-mono text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-neutral-950">The Front-Loaded Hook</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Put your stakes and primary subject in the first 4 words. If your title starts with "In Today's Video We Are Exploring...", the viewer has already scrolled to the next creator before learning what the video is about.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-900 font-bold font-mono text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-neutral-950">Specific Data Points</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Specificity creates perceived credibility. Compare "How to Build a Startup" with "How I Built a $10M Startup With 0 Employees". Numbers anchor the premise in empirical reality, multiplying click confidence.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-900 font-bold font-mono text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-neutral-950">Title-Thumbnail Synergy</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Never repeat the exact title text inside the thumbnail. The thumbnail should establish the emotional tension (the reaction or visual conflict), while the title explains the stakes or premise. Together they create an irresistible synergy.
              </p>
            </div>
          </div>
        </section>

        {/* Cross-Link Cluster */}
        <section className="mt-16 p-8 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-neutral-950">Now test your thumbnail image contrast</h3>
            <p className="text-xs text-neutral-600">
              Run your draft thumbnail through our free Thumbnail Analyzer to evaluate safe areas and dark mode edge separation.
            </p>
          </div>
          <Link
            href="/youtube-thumbnail-analyzer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            Open Thumbnail Analyzer <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FAQ Section */}
        <section className="mt-20 pt-16 border-t border-neutral-200">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-neutral-950">Frequently Asked Questions</h2>
              <p className="text-xs text-neutral-500 font-mono">[ YOUTUBE TITLE OPTIMIZATION &amp; CTR ]</p>
            </div>

            <div className="space-y-4">
              {TITLE_ANALYZER_FAQS.map((faq, i) => (
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
