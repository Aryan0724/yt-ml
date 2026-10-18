"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Play } from "lucide-react"

const LINES = [
  "Audit packaging with AI.",
  "Mine competitor comment gaps.",
  "Review thumbnails with your editor.",
  "You’ll never flop a video again."
]

export function Hero() {
  const [displayedChars, setDisplayedChars] = useState<number[]>([
    LINES[0].length,
    LINES[1].length,
    LINES[2].length,
    LINES[3].length
  ])
  const [showChips, setShowChips] = useState(true)

  // Smooth typewriter reveal on load
  useEffect(() => {
    setDisplayedChars([0, 0, 0, 0])
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
    }, 20)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="landing-col pt-12 pb-20 md:pt-20 md:pb-32 relative z-10">
      {/* Exact Terms.so Stacked Headline on Dark YouTube Gradient */}
      <h1
        className="landing-headline min-h-[170px] sm:min-h-[220px]"
        aria-label="Turn data into your next viral video. Simulate mobile feed CTR. Steal competitor gaps. Make every video a hit — powered by data."
      >
        <span className="landing-headline-line landing-headline-brand">
          <span>{LINES[0].slice(0, displayedChars[0])}</span>
          {displayedChars[0] < LINES[0].length && (
            <span className="inline-block w-0.5 h-6 bg-white ml-0.5 animate-pulse" />
          )}
        </span>
        <span className="landing-headline-line landing-headline-brand">
          <span>{LINES[1].slice(0, displayedChars[1])}</span>
          {displayedChars[0] >= LINES[0].length && displayedChars[1] < LINES[1].length && (
            <span className="inline-block w-0.5 h-6 bg-white ml-0.5 animate-pulse" />
          )}
        </span>
        <span className="landing-headline-line landing-headline-brand">
          <span>{LINES[2].slice(0, displayedChars[2])}</span>
          {displayedChars[1] >= LINES[1].length && displayedChars[2] < LINES[2].length && (
            <span className="inline-block w-0.5 h-6 bg-white ml-0.5 animate-pulse" />
          )}
        </span>
        <span className="landing-headline-line landing-headline-dark">
          <span>{LINES[3].slice(0, displayedChars[3])}</span>
          {displayedChars[2] >= LINES[2].length && displayedChars[3] < LINES[3].length && (
            <span className="inline-block w-0.5 h-6 bg-white ml-0.5 animate-pulse" />
          )}
        </span>
      </h1>

      {/* Subhead with clear creator value prop */}
      <p
        className={`mt-6 text-base sm:text-lg md:text-xl text-white/95 max-w-2xl font-normal leading-relaxed drop-shadow-xs transition-all duration-700 ${
          showChips ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        Pick the perfect topic, title, and thumbnail based on real YouTube data. Audit your drafts against 14.8M uploads before you spend 40 hours filming.
      </p>

      {/* Terms.so Hero Action Chips */}
      <div
        className={`mt-8 md:mt-10 flex flex-wrap items-center gap-3.5 transition-all duration-700 ${
          showChips ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <Link
          href="/signup"
          className="action-button action-button--hero-solid px-7 py-3.5 text-[15px] font-semibold shadow-md hover:scale-102 active:scale-98 transition-transform"
        >
          Start Free Trial
        </Link>
        <a
          href="#draft"
          className="action-button px-6 py-3.5 text-[15px] font-semibold flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md shadow-sm transition-all hover:scale-102 active:scale-98"
        >
          <div className="w-4 h-4 rounded-full bg-white/30 text-white flex items-center justify-center text-[8px] pl-0.5">
            <Play className="w-2.5 h-2.5 fill-white" />
          </div>
          <span>Watch a demo</span>
        </a>
      </div>

      {/* Trust pill */}
      <div
        className={`mt-6 flex items-center gap-3 text-xs text-white/90 font-medium drop-shadow-xs transition-all duration-700 ${
          showChips ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex -space-x-1.5">
          <div className="w-5 h-5 rounded-full bg-red-500 border border-white/40 shadow-xs" />
          <div className="w-5 h-5 rounded-full bg-amber-400 border border-white/40 shadow-xs" />
          <div className="w-5 h-5 rounded-full bg-blue-500 border border-white/40 shadow-xs" />
        </div>
        <span className="text-white/90 font-medium">Trusted by 5,000+ creators • No credit card required</span>
      </div>
    </section>
  )
}
