"use client"

import React from "react"
import Link from "next/link"
import { Search, Sliders, Compass, ArrowRight, CheckCircle2, Sparkles } from "lucide-react"

const BENEFITS = [
  {
    icon: Search,
    step: "01",
    tag: "TOPIC SELECTION",
    simpleBenefit: "Know if viewers actually want this video before you film.",
    technicalExplanation:
      "We scan YouTube search volume gaps and audience comment demand to find topics with high viewer appetite but weak competitor coverage.",
    toolLink: "/youtube-content-gap-finder",
    toolText: "Try Content Gap Finder"
  },
  {
    icon: Sliders,
    step: "02",
    tag: "PACKAGING AUDIT",
    simpleBenefit: "Know if people will understand your title and thumbnail at a glance.",
    technicalExplanation:
      "We test 54-character mobile title truncation, dark-mode thumbnail contrast, and timestamp danger-zone overlays before you upload.",
    toolLink: "/youtube-thumbnail-analyzer",
    toolText: "Try Thumbnail Analyzer"
  },
  {
    icon: Compass,
    step: "03",
    tag: "COMPETITOR GAP RADAR",
    simpleBenefit: "Answer the exact questions top creators leave unaddressed.",
    technicalExplanation:
      "We mine competitor comment sections for recurring viewer confusion, turning unaddressed audience demand into proven video concepts.",
    toolLink: "/youtube-video-idea-generator",
    toolText: "Try Video Idea Generator"
  }
]

export function ThreeBenefits() {
  return (
    <section className="py-20 md:py-24 bg-neutral-50/60 border-b border-neutral-200" id="benefits">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-mono font-bold tracking-wider uppercase border border-red-200/60">
            <span>[ ONE CONNECTED WORKFLOW ]</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.12]">
            One simple workflow from <br />
            <span className="text-red-600">raw outline to publish-ready package.</span>
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
            Stop jumping between keyword tools, competitor tabs, and Photoshop. PreYT connects your topic idea directly to your title and thumbnail test in one 60-second check before you film.
          </p>
        </div>

        {/* 3 Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BENEFITS.map((b, idx) => {
            const Icon = b.icon
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all space-y-6 flex flex-col justify-between shadow-2xs group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-neutral-400">
                      STEP {b.step}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">
                    [ {b.tag} ]
                  </div>

                  {/* Simple Benefit */}
                  <h3 className="text-xl font-bold text-neutral-950 leading-snug group-hover:text-red-600 transition-colors">
                    {b.simpleBenefit}
                  </h3>

                  {/* Technical Explanation */}
                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                    {b.technicalExplanation}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <Link
                    href={b.toolLink}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 group-hover:text-red-600 transition-colors"
                  >
                    <span>{b.toolText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
