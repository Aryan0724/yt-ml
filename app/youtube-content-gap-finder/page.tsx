import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { BreadcrumbSchema, FaqSchema, SoftwareAppSchema } from "@/components/seo/json-ld"
import { ContentGapFinder } from "@/components/tools/content-gap-finder"
import { ArrowRight, CheckCircle2, ShieldCheck, Compass, Search, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Free YouTube Content Gap Finder: Underserved Topics",
  description: "Find high-demand, low-competition YouTube topic gaps. Extract unserved viewer questions, benchmark saturation levels, and get engineered high-CTR packaging angles.",
  alternates: {
    canonical: "https://preyt.integralgroups.in/youtube-content-gap-finder",
  },
  openGraph: {
    title: "Free YouTube Content Gap Finder | PreYT Creator Intelligence",
    description: "Discover unserved audience demand, audience comment questions, and high-potential packaging whitespace.",
    url: "https://preyt.integralgroups.in/youtube-content-gap-finder",
    siteName: "PreYT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free YouTube Content Gap Finder | Discover Underserved Niches",
    description: "Discover unserved audience demand, audience comment questions, and high-potential packaging whitespace.",
  }
}

const GAP_FINDER_FAQS = [
  {
    question: "What is a content gap on YouTube?",
    answer: "A content gap occurs when there is high viewer search interest or comment demand for a specific question, problem, or subtopic, but existing videos either do not answer it or are severely outdated and low-quality."
  },
  {
    question: "How do you find underserved video topics?",
    answer: "The most reliable method is mining competitor comment sections for repeated questions ('How do you do X when Y happens?'), reviewing Google Trends breakout queries, and analyzing the gap between high search volume and low view satisfaction."
  },
  {
    question: "Why is targeting content gaps better than copying viral videos?",
    answer: "Replicating viral videos enters you into a saturated market where you compete directly with established creators with higher authority. Targeting content gaps positions your video as the definitive, unchallenged answer, yielding higher average view durations and faster recommendation velocity."
  },
  {
    question: "How does PreYT evaluate topic saturation?",
    answer: "PreYT measures saturation by evaluating upload density across format archetypes, tracking how many channels published identical thumbnail compositions within the past 90 days, and calculating whether audience interest is growing or experiencing fatigue."
  }
]

export default function YouTubeContentGapFinderPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-red-100 selection:text-red-900">
      <SoftwareAppSchema
        name="PreYT YouTube Content Gap Finder"
        description="Free online YouTube content gap analysis tool to uncover unserved viewer demand, topic saturation, and packaging whitespace."
        applicationCategory="BusinessApplication"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/features" },
          { name: "YouTube Content Gap Finder", url: "/youtube-content-gap-finder" }
        ]}
      />
      <FaqSchema items={GAP_FINDER_FAQS} />
      <Navbar variant="light" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Editorial Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono uppercase tracking-wider">
            <span>[ COMPETITIVE WHITESPACE ANALYSIS // ZERO SIGNUP ]</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
            YouTube Content Gap Finder: <br />
            <span className="text-red-600">Discover Underserved Viewer Demand</span>
          </h1>

          {/* 50-Word Direct Answer for Google AI Overviews & Featured Snippet */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-2xl mx-auto font-normal">
            A YouTube content gap finder identifies underserved viewer questions and topic whitespace that competitor channels have overlooked. By extracting high-volume queries from comment sections and search intent where existing video quality is poor, creators can produce high-relevance videos that capture breakout algorithmic distribution.
          </div>
        </div>

        {/* Interactive Content Gap Tool */}
        <ContentGapFinder />

        {/* Technical Deep Dive */}
        <section className="mt-24 pt-16 border-t border-neutral-200 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">
              [ STRATEGIC POSITIONING ]
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950">
              How to Win by Answering What Competitors Ignore
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              Most YouTube creators fail not because their video editing is poor, but because they enter saturated topics where established channels already hold viewer trust:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold font-mono text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-neutral-950">The Comment Mining Goldmine</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                When a viral video gets 1,000,000 views, hundreds of viewers leave comments pointing out edge cases, unanswered questions, and confusing points. Those comments are free, validated product demand for your next upload.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-900 font-bold font-mono text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-neutral-950">Contrarian Positioning</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                If 20 creators make videos claiming "X is the Best Investment in 2026", making a 21st video saying the same thing guarantees low impressions. A video analyzing "Why X is Actually Dangerous" instantly cuts through feed fatigue.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-900 font-bold font-mono text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-neutral-950">High Retention Density</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Videos that fill real content gaps achieve significantly higher average percentage viewed (APV) because the audience is genuinely seeking answers rather than passive entertainment, signaling top-tier quality to YouTube's ranking neural network.
              </p>
            </div>
          </div>
        </section>

        {/* Cross-Link Cluster */}
        <section className="mt-16 p-8 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-neutral-950">Need video ideas for your niche?</h3>
            <p className="text-xs text-neutral-600">
              Generate 6 high-demand video concepts paired with thumbnail briefs using our free Video Idea Generator.
            </p>
          </div>
          <Link
            href="/youtube-video-idea-generator"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            Open Idea Generator <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FAQ Section */}
        <section className="mt-20 pt-16 border-t border-neutral-200">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-neutral-950">Frequently Asked Questions</h2>
              <p className="text-xs text-neutral-500 font-mono">[ CONTENT GAP AUDITING &amp; TOPIC DEMAND ]</p>
            </div>

            <div className="space-y-4">
              {GAP_FINDER_FAQS.map((faq, i) => (
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
