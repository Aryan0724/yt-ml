"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="landing-col pt-12 pb-20 md:pt-20 md:pb-28 relative z-10">
      {/* High-Impact Simplified Headline */}
      <h1
        className="landing-headline max-w-3xl"
        aria-label="Get more clicks on every video you publish."
      >
        <span className="landing-headline-dark">
          Get more clicks on every video{" "}
          <span className="text-[#EE1122]">you publish.</span>
        </span>
      </h1>

      {/* Short, direct subhead with clear value */}
      <p className="mt-6 text-base sm:text-lg md:text-xl text-white/95 max-w-2xl font-normal leading-relaxed drop-shadow-xs">
        Test your title, thumbnail, and topic on real mobile feeds before you film. Catch cutoffs and contrast issues in under 60 seconds.
      </p>

      {/* Single CTA Button: Sign In / Sign Up */}
      <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-4">
        <Link
          href="/signup"
          className="action-button action-button--hero-solid px-8 py-4 text-base font-bold shadow-lg hover:scale-102 active:scale-98 transition-transform inline-flex items-center gap-2"
        >
          <span>Sign In / Sign Up</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </Link>
      </div>

      {/* Trust Line */}
      <div className="mt-6 flex items-center gap-2.5 text-xs text-white/90 font-medium drop-shadow-xs">
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
