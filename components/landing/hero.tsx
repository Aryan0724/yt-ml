"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"

const LINES = [
  "Get more clicks on every video",
  "you publish."
]

export function Hero() {
  const [displayedChars, setDisplayedChars] = useState<number[]>([
    LINES[0].length,
    LINES[1].length
  ])
  const [showChips, setShowChips] = useState(true)

  // Smooth typewriter reveal on load
  useEffect(() => {
    setDisplayedChars([0, 0])
    setShowChips(false)

    let lineIdx = 0
    let charIdx = 0

    const interval = setInterval(() => {
      if (lineIdx < LINES.length) {
        if (charIdx <= LINES[lineIdx].length) {
          setDisplayedChars((prev) => {
            const next = [...prev]
            next[lineIdx] = charIdx
            return next
          })
          charIdx++
        } else {
          lineIdx++
          charIdx = 0
        }
      } else {
        setShowChips(true)
        clearInterval(interval)
      }
    }, 24)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="landing-col pt-12 pb-20 md:pt-16 md:pb-24 relative z-10">
      {/* Category Eyebrow Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-mono font-bold tracking-wider uppercase mb-6 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-red-400" />
        <span>PRE-UPLOAD PACKAGING INTELLIGENCE</span>
      </div>

      {/* Primary Keyword-Focused H1 for Search Engines & Visitors */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.08] max-w-4xl mb-4">
        Pre-Upload YouTube Analytics for <br className="hidden sm:inline" />
        <span className="text-[#EE1122]">Titles, Thumbnails &amp; Video Ideas</span>
      </h1>

      {/* Dynamic Animated Value Proposition */}
      <div
        className="landing-headline min-h-[60px] sm:min-h-[80px] max-w-3xl text-xl sm:text-2xl md:text-3xl text-white/90 font-bold"
        aria-label="Get more clicks on every video you publish."
      >
        <span>{LINES[0].slice(0, displayedChars[0])} </span>
        <span className="text-red-400">{LINES[1].slice(0, displayedChars[1])}</span>
        {displayedChars[0] >= LINES[0].length && (
          <span
            className={`inline-block w-0.5 h-6 sm:h-8 bg-red-400 ml-1 animate-pulse align-middle transition-opacity duration-500 ${
              showChips ? "opacity-0" : "opacity-100"
            }`}
          />
        )}
      </div>

      {/* Direct Explanatory Subhead */}
      <p
        className={`mt-4 text-base sm:text-lg text-white/90 max-w-2xl font-normal leading-relaxed drop-shadow-xs transition-all duration-700 ${
          showChips ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        Evaluate your packaging before filming. Analyze thumbnails for mobile contrast, check 54-character title cutoffs, and discover high-demand competitor content gaps.
      </p>

      {/* CTA Buttons */}
      <div
        className={`mt-8 flex flex-wrap items-center gap-4 transition-all duration-700 ${
          showChips ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <Link
          href="/signup"
          className="action-button action-button--hero-solid px-8 py-4 text-sm sm:text-base font-bold shadow-lg hover:scale-102 active:scale-98 transition-transform inline-flex items-center gap-2"
        >
          <span>Start Free Packaging Audit</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </Link>
        <Link
          href="/tools/youtube-feed-preview"
          className="action-button action-button--hero-ghost text-sm sm:text-base font-semibold px-6 py-4 border border-white/20 hover:border-white/40 text-white"
        >
          <span>Try Free Mobile Simulator</span>
        </Link>
      </div>

      {/* Trust Line */}
      <div
        className={`mt-6 flex items-center gap-2.5 text-xs text-white/80 font-medium drop-shadow-xs transition-all duration-700 ${
          showChips ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex -space-x-1.5">
          <div className="w-4.5 h-4.5 rounded-full bg-red-500 border border-white/40 shadow-xs" />
          <div className="w-4.5 h-4.5 rounded-full bg-amber-400 border border-white/40 shadow-xs" />
          <div className="w-4.5 h-4.5 rounded-full bg-blue-500 border border-white/40 shadow-xs" />
        </div>
        <span>Free to start · No YouTube channel login or password required</span>
      </div>
    </section>
  )
}
