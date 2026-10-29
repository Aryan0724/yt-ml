"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Play } from "lucide-react"
import { LiveAuditWidget } from "@/components/landing/live-audit-widget"

export function Hero() {
  const scrollToAudit = (e: React.MouseEvent) => {
    e.preventDefault()
    const elem = document.getElementById("interactive-audit")
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToReport = (e: React.MouseEvent) => {
    e.preventDefault()
    const elem = document.getElementById("sample-report")
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="pt-8 pb-16 md:pt-12 md:pb-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Copy Box */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/95 text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>PRE-UPLOAD YOUTUBE INTELLIGENCE</span>
          </div>

          {/* Primary Clear Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Know whether your YouTube video package works{" "}
            <span className="text-red-400">before you spend 40 hours making it.</span>
          </h1>

          {/* Direct Explanatory Subhead */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto font-normal leading-relaxed">
            Analyze your topic, title, and thumbnail against real YouTube mobile feeds. Make fewer blind bets and get specific fixes before you press record.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#interactive-audit"
              onClick={scrollToAudit}
              className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm sm:text-base font-bold shadow-lg shadow-red-600/30 hover:scale-102 active:scale-98 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Run Free Video Audit</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#sample-report"
              onClick={scrollToReport}
              className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm sm:text-base font-semibold border border-white/20 hover:border-white/30 backdrop-blur-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>See Sample Report</span>
            </a>
          </div>

          {/* Trust Line */}
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-300 font-medium pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Free to start · No YouTube channel login required · Instant 60-second result</span>
          </div>
        </div>

        {/* Live Interactive Audit Widget Above the Fold */}
        <div className="pt-2">
          <LiveAuditWidget />
        </div>
      </div>
    </section>
  )
}
