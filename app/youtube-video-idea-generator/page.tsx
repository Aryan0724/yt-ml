import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { BreadcrumbSchema, FaqSchema, SoftwareAppSchema } from "@/components/seo/json-ld"
import { IdeaGenerator } from "@/components/tools/idea-generator"
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Lightbulb, Target } from "lucide-react"

export const metadata: Metadata = {
  title: "Free YouTube Video Idea Generator | High-CTR Concepts (PreYT)",
  description: "Generate viral YouTube video ideas with paired thumbnail concepts, title curiosity hooks, and estimated CTR benchmarks. Built for creators and production studios.",
  alternates: {
    canonical: "https://preyt.integralgroups.in/youtube-video-idea-generator",
  },
  openGraph: {
    title: "Free YouTube Video Idea Generator | PreYT Creator Intelligence",
    description: "Generate viral video concepts with paired thumbnail briefs and curiosity hooks across Tech, Finance, Gaming, and Video Essays.",
    url: "https://preyt.integralgroups.in/youtube-video-idea-generator",
    siteName: "PreYT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free YouTube Video Idea Generator | High-CTR Concepts",
    description: "Generate viral video concepts with paired thumbnail briefs and curiosity hooks across Tech, Finance, Gaming, and Video Essays.",
  }
}

const IDEA_GENERATOR_FAQS = [
  {
    question: "How does a YouTube video idea generator work?",
    answer: "A video idea generator pairs high-demand niche topics with proven packaging archetypes (such as Contrarian Breakdowns, Extreme Challenges, and Exposés). It provides both the title hook and thumbnail visual direction before you write a script or film."
  },
  {
    question: "What makes a YouTube video idea go viral?",
    answer: "Virality is determined by packaging-first resonance: an irresolvable curiosity gap in the title, a high-contrast thumbnail that registers on mobile feeds within 150 milliseconds, and high audience retention that signals value to YouTube's recommendation neural network."
  },
  {
    question: "Why should you design thumbnails before filming?",
    answer: "The 'Packaging-First' philosophy states that if an idea cannot be distilled into a clear 5-word title and an arresting 16:9 visual composition, the video will struggle to earn impressions regardless of production budget. Validating the concept beforehand saves dozens of filming hours."
  },
  {
    question: "What are the highest-converting YouTube video archetypes?",
    answer: "The four highest-performing archetypes on modern YouTube are: 1) The Contrarian Truth ('Why [X] is Actually Ruining Your [Y]'), 2) The Extreme Case Study ('How I [Achieved Result] in [Timeframe]'), 3) The David vs Goliath Rivalry ('The Tool That Will Kill [Giant]'), and 4) The Industry Exposé ('How [Industry] Secretly Scams You')."
  }
]

export default function YouTubeVideoIdeaGeneratorPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-red-100 selection:text-red-900">
      <SoftwareAppSchema
        name="PreYT YouTube Video Idea Generator"
        description="Free online YouTube video idea generator producing high-CTR concepts, paired thumbnail briefs, and curiosity hooks."
        applicationCategory="BusinessApplication"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/features" },
          { name: "YouTube Video Idea Generator", url: "/youtube-video-idea-generator" }
        ]}
      />
      <FaqSchema items={IDEA_GENERATOR_FAQS} />
      <Navbar variant="light" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Editorial Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono uppercase tracking-wider">
            <span>[ PACKAGING-FIRST IDEATION // ZERO FRICTION ]</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
            YouTube Video Idea Generator: <br />
            <span className="text-red-600">High-CTR Concepts &amp; Thumbnail Hooks</span>
          </h1>

          {/* 50-Word Direct Answer for Google AI Overviews & Featured Snippet */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-2xl mx-auto font-normal">
            A YouTube video idea generator produces high-demand content concepts paired with proven thumbnail compositions and curiosity-driven title hooks. By validating the packaging archetype before writing scripts or filming, creators ensure their video ideas target unserved audience demand and achieve high click-through rates on modern browse feeds.
          </div>
        </div>

        {/* Interactive Idea Generator Tool */}
        <IdeaGenerator />

        {/* Technical Deep Dive */}
        <section className="mt-24 pt-16 border-t border-neutral-200 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">
              [ PACKAGING-FIRST FRAMEWORK ]
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950">
              Why 80% of Video Performance is Decided in Ideation
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              Most creators spend 40 hours filming and editing, only to spend 15 minutes drafting a title and thumbnail right before uploading. This order of operations creates catastrophic distribution failure:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold font-mono text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-neutral-950">The Idea Bottleneck</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                If the core concept does not immediately trigger curiosity or stakes, no thumbnail contrast or 4K camera quality can save it. The YouTube algorithm allocates initial impression batches based solely on packaging click velocity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-900 font-bold font-mono text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-neutral-950">The Visual Hook Check</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Before filming, ask: "Can this video's stakes be visually communicated in a single static frame?" If your concept requires a paragraph of explanation to grasp, it cannot succeed on smartphone recommendation feeds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-900 font-bold font-mono text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-neutral-950">Avoiding Saturation Traps</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Replicating an idea that went viral 6 months ago often leads to algorithm suppression. By the time copycats saturate the feed, viewers have developed visual fatigue. Combine proven archetypes with novel niches to stay original.
              </p>
            </div>
          </div>
        </section>

        {/* Cross-Link Cluster */}
        <section className="mt-16 p-8 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-neutral-950">Have a title ready? Test its mobile truncation limit</h3>
            <p className="text-xs text-neutral-600">
              Run your draft title through our free Title Analyzer to detect mobile 54-character cutoffs and curiosity gaps.
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
              <p className="text-xs text-neutral-500 font-mono">[ YOUTUBE PACKAGING-FIRST IDEATION ]</p>
            </div>

            <div className="space-y-4">
              {IDEA_GENERATOR_FAQS.map((faq, i) => (
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
