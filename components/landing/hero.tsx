"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

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
    <section className="landing-col pt-12 pb-20 md:pt-20 md:pb-28 relative z-10">
      {/* Terms.so Stacked Typewriter Headline */}
      <h1
        className="landing-headline min-h-[120px] sm:min-h-[160px] md:min-h-[190px] max-w-4xl"
        aria-label="Get more clicks on every video you publish."
      >
        <span className="landing-headline-line landing-headline-dark">
          <span>{LINES[0].slice(0, displayedChars[0])}</span>
          {displayedChars[0] < LINES[0].length && (
            <span className="inline-block w-0.5 h-8 sm:h-11 md:h-14 bg-white ml-1 animate-pulse align-middle" />
          )}
        </span>
        <span className="landing-headline-line text-[#EE1122]">
          <span>{LINES[1].slice(0, displayedChars[1])}</span>
          {displayedChars[0] >= LINES[0].length && (
            <span
              className={`inline-block w-0.5 h-8 sm:h-11 md:h-14 bg-[#EE1122] ml-1 animate-pulse align-middle transition-opacity duration-500 ${
                showChips ? "opacity-0" : "opacity-100"
              }`}
            />
          )}
        </span>
      </h1>

      {/* Short, direct subhead with smooth staggered fade-in */}
      <p
        className={`mt-6 text-base sm:text-lg md:text-xl text-white/95 max-w-2xl font-normal leading-relaxed drop-shadow-xs transition-all duration-700 ${
          showChips ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        Test your title, thumbnail, and topic on real mobile feeds before you film. Catch cutoffs and contrast issues in under 60 seconds.
      </p>

      {/* Single CTA Button with smooth staggered fade-in */}
      <div
        className={`mt-8 md:mt-10 flex flex-wrap items-center gap-4 transition-all duration-700 ${
          showChips ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <Link
          href="/signup"
          className="action-button action-button--hero-solid px-8 py-4 text-base font-bold shadow-lg hover:scale-102 active:scale-98 transition-transform inline-flex items-center gap-2"
        >
          <span>Sign In / Sign Up</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </Link>
      </div>

      {/* Trust Line with smooth staggered fade-in */}
      <div
        className={`mt-6 flex items-center gap-2.5 text-xs text-white/90 font-medium drop-shadow-xs transition-all duration-700 ${
          showChips ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex -space-x-1.5">
          <div className="w-4.5 h-4.5 rounded-full bg-red-500 border border-white/40 shadow-xs" />
          <div className="w-4.5 h-4.5 rounded-full bg-amber-400 border border-white/40 shadow-xs" />
          <div className="w-4.5 h-4.5 rounded-full bg-blue-500 border border-white/40 shadow-xs" />
        </div>
        <span>Free to start · No YouTube channel connection required</span>
      </div>
    </section>
  )
}
