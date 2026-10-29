"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, ShieldCheck, MessageSquare } from "lucide-react"

export function FinalCta() {
  return (
    <section className="py-24 bg-neutral-950 text-white relative overflow-hidden" id="get-started">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-red-400 border border-white/15 text-xs font-mono font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ZERO FRICTION PRE-UPLOAD ONBOARDING</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Run your first video packaging audit free.
        </h2>

        <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto font-normal leading-relaxed">
          Catch mobile 54-character cutoffs and thumbnail safe-zone issues before you spend 40 hours filming. No credit card required.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/signup"
            className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm sm:text-base font-bold shadow-lg shadow-red-600/30 hover:scale-102 active:scale-98 transition-all inline-flex items-center gap-2"
          >
            <span>Run Free Video Audit</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/tools/youtube-feed-preview"
            className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm sm:text-base font-semibold border border-white/20 transition-all inline-flex items-center gap-2"
          >
            <span>Try Mobile Feed Previewer</span>
          </Link>
        </div>

        {/* Support & Contact Strip */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official YouTube Data API Integration · Privacy First</span>
          </div>
          <span>·</span>
          <Link
            href="/contact"
            className="text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Have custom studio questions? Contact our team &rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
