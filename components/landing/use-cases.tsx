"use client"

import React from "react"
import Link from "next/link"
import { User, Users, Building, ArrowRight, CheckCircle2 } from "lucide-react"

const USE_CASES = [
  {
    icon: User,
    role: "Independent Creators (10K – 100K)",
    headline: "Stop making blind packaging bets on weekly uploads.",
    description:
      "You don't have a full-time design team or budget for endless post-publish thumbnail testing. Run a 60-second pre-upload audit to ensure your title doesn't cut off and your thumbnail doesn't vanish on mobile.",
    bulletPoints: [
      "Check 54-character title cutoffs",
      "Avoid dark mode feed contrast bleed",
      "Find unserved topics from competitor comment gaps"
    ],
    ctaText: "Start Free Creator Plan",
    ctaLink: "/signup"
  },
  {
    icon: Users,
    role: "Full-Time Channels & Pro Creators",
    headline: "Align your editor and thumbnail designer before filming.",
    description:
      "Share interactive audit reports with your thumbnail artist and scriptwriter so everyone agrees on the curiosity hook and visual focus before rendering 4K video files.",
    bulletPoints: [
      "Shareable audit report links",
      "Perceptual hash originality shield",
      "Real-time mobile feed previewer"
    ],
    ctaText: "Explore Pro Features",
    ctaLink: "/features"
  },
  {
    icon: Building,
    role: "Studios & Production Agencies",
    headline: "Standardize packaging quality across 20+ client channels.",
    description:
      "Deliver data-backed packaging reports to clients and brand sponsors before publishing. Eliminate subjective debates with empirical contrast metrics and safe-zone adherence.",
    bulletPoints: [
      "Multi-channel client benchmarks",
      "Exportable packaging PDF audits",
      "Dedicated strategist & team seats"
    ],
    ctaText: "Explore Studio Solutions",
    ctaLink: "/pricing"
  }
]

export function UseCases() {
  return (
    <section className="py-20 md:py-24 bg-white border-b border-neutral-200" id="use-cases">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-mono font-bold tracking-wider uppercase border border-red-200/60">
            <span>[ BUILT FOR CREATORS AT EVERY STAGE ]</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.12]">
            Who uses PreYT before <br />
            <span className="text-red-600">hitting upload.</span>
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
            From solo YouTubers seeking their first breakout browse recommendations to multi-channel production teams protecting client CTR:
          </p>
        </div>

        {/* 3 Use Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {USE_CASES.map((uc, idx) => {
            const Icon = uc.icon
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                    <Icon className="w-5 h-5 text-red-400" />
                  </div>

                  <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                    [ {uc.role} ]
                  </div>

                  <h3 className="text-lg font-bold text-neutral-950 leading-snug">
                    {uc.headline}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                    {uc.description}
                  </p>

                  <ul className="space-y-2 pt-2 text-xs text-neutral-700">
                    {uc.bulletPoints.map((pt, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-neutral-200/80">
                  <Link
                    href={uc.ctaLink}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-red-600 transition-colors"
                  >
                    <span>{uc.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
