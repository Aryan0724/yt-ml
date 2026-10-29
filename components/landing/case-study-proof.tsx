"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Database, Smartphone, Eye } from "lucide-react"

export function CaseStudyProof() {
  return (
    <section className="py-20 md:py-24 bg-white border-b border-neutral-200" id="proof">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-mono font-bold tracking-wider uppercase border border-red-200/60">
            <span>[ REAL PACKAGING EXPERIMENTS // VERIFIABLE METHODOLOGY ]</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.15]">
            Measurable CTR improvements, <br />
            <span className="text-red-600">not vanity AI scores.</span>
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
            See how small, data-backed adjustments to mobile title cutoffs and thumbnail rim lighting transform initial 24-hour impression conversion:
          </p>
        </div>

        {/* Case Study Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Case Study 1 */}
          <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  CASE STUDY 01 // TECH REVIEW NICHE
                </span>
                <span className="text-emerald-700 font-mono font-bold text-xs bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  +176% View Velocity
                </span>
              </div>

              <h3 className="text-xl font-bold text-neutral-950">
                Fixing the 68-Character Mobile Cutoff
              </h3>

              {/* Before vs After Comparison */}
              <div className="space-y-3 pt-2">
                {/* Before Box */}
                <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-red-600 uppercase">BEFORE AUDIT:</div>
                  <div className="text-xs font-medium text-neutral-800 line-through">
                    &quot;Why I Think You Should Probably Avoid Buying The Base M4 Mac Mini in 2026&quot;
                  </div>
                  <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
                    <span>Length: 74 chars (Cut off on iPhone)</span>
                    <span className="font-mono font-bold text-red-600">2.1% CTR</span>
                  </div>
                </div>

                {/* After Box */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-emerald-700 uppercase">AFTER PREYT FIX:</div>
                  <div className="text-xs font-bold text-neutral-900">
                    &quot;M4 Mac Mini: Stop Buying the Base Model&quot;
                  </div>
                  <div className="text-[11px] text-neutral-600 flex items-center justify-between pt-1">
                    <span>Length: 38 chars (100% visible on mobile)</span>
                    <span className="font-mono font-bold text-emerald-700">5.8% CTR (+176%)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                <strong>Why it worked:</strong> The core warning (*"Stop Buying"*) was moved into the first 25 characters, ensuring smartphone users scrolling through Browse feeds immediately processed the stakes.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-xs">
              <span className="text-neutral-500 font-mono">Sample Size: 240K impressions</span>
              <Link
                href="/blog/what-is-the-best-youtube-title-length"
                className="font-bold text-neutral-900 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <span>Read Full Title Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Case Study 2 */}
          <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  CASE STUDY 02 // FACELESS VIDEO ESSAY
                </span>
                <span className="text-emerald-700 font-mono font-bold text-xs bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  +111% Browse Lift
                </span>
              </div>

              <h3 className="text-xl font-bold text-neutral-950">
                Clearing the Timestamp Danger Zone
              </h3>

              {/* Before vs After Comparison */}
              <div className="space-y-3 pt-2">
                {/* Before Box */}
                <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-red-600 uppercase">BEFORE AUDIT:</div>
                  <div className="text-xs font-medium text-neutral-800">
                    Punchline text &quot;BANKRUPT&quot; placed in lower-right quadrant; muted grey edges.
                  </div>
                  <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
                    <span>Duration clock occluded 100% of punchline</span>
                    <span className="font-mono font-bold text-red-600">3.4% CTR</span>
                  </div>
                </div>

                {/* After Box */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-emerald-700 uppercase">AFTER PREYT FIX:</div>
                  <div className="text-xs font-bold text-neutral-900">
                    Moved text to upper-left; added 18% rim lighting against Dark Theme feeds.
                  </div>
                  <div className="text-[11px] text-neutral-600 flex items-center justify-between pt-1">
                    <span>Clean safe zone + instant edge isolation</span>
                    <span className="font-mono font-bold text-emerald-700">7.2% CTR (+111%)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                <strong>Why it worked:</strong> Over 68% of mobile watch time is on Dark Theme feeds. Adding edge separation and clearing the timestamp badge prevented the thumbnail from vanishing against black backgrounds.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-xs">
              <span className="text-neutral-500 font-mono">Sample Size: 185K impressions</span>
              <Link
                href="/blog/youtube-thumbnail-size-and-safe-zones"
                className="font-bold text-neutral-900 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <span>Read Safe-Zone Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Methodology & Data Source Strip */}
        <div className="p-6 rounded-2xl bg-neutral-100/70 border border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-neutral-600">
          <div className="space-y-1 max-w-2xl">
            <span className="font-bold text-neutral-900">Empirical Methodology:</span>
            <p className="leading-relaxed">
              Our packaging benchmarks evaluate luminance contrast ratios against YouTube Dark Theme (\`#0F0F0F\`), mobile viewport character boundaries (54-character ellipsis limits), and format-specific OpenCV heuristics across 14.8M uploads. Predictions represent statistical probabilities, not guarantees.
            </p>
          </div>
          <Link
            href="/intelligence"
            className="font-bold text-neutral-900 hover:text-red-600 whitespace-nowrap flex items-center gap-1 shrink-0"
          >
            <span>Inspect Algorithm Architecture</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
