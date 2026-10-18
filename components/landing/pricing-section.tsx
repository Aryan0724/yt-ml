"use client"

import Link from "next/link"
import { Check, ArrowRight, Sparkles } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/forever",
    description: "For independent creators evaluating packaging on upcoming videos.",
    features: [
      "3 Video Packaging Audits / month",
      "Mobile Viewport Truncation Check",
      "Thumbnail Dark Feed Contrast Score",
      "Core Curiosity Gap Diagnostic",
      "Standard Community Support",
    ],
    buttonText: "Start Free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro Creator",
    price: "$29",
    period: "/mo",
    description: "For active channels publishing weekly and competing for browse traffic.",
    features: [
      "Unlimited Pre-Upload Audits",
      "Real-Time Topic Radar & Surge Alerts",
      "Competitor Gap Reverse-Engineering",
      "20 Title Variant Generator & Scoring",
      "iPhone & Android Mobile Safe Area Simulator",
      "Priority API Processing",
    ],
    buttonText: "Start 14-Day Free Trial",
    href: "/signup?plan=pro",
    popular: true,
  },
  {
    name: "Media Studio",
    price: "$79",
    period: "/mo",
    description: "For production companies, editing agencies, and multi-channel networks.",
    features: [
      "Everything in Pro Creator",
      "Multi-Channel Packaging Benchmarks",
      "Team Collaboration & Editor Seats (Up to 5)",
      "Thumbnail A/B Head-to-Head Compare",
      "Exportable Client Packaging PDF Reports",
      "Dedicated Strategist Support",
    ],
    buttonText: "Start Studio Trial",
    href: "/signup?plan=studio",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-24 bg-white border-b border-neutral-200" id="pricing">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider">
            <span>[ TRANSPARENT PRICING ]</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight leading-tight">
            Predictable pricing that <br />
            <span className="curved-underline">pays for itself</span> in one upload.
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto font-normal leading-relaxed">
            One extra high-CTR video covers an entire year of PreYT. Cancel or upgrade anytime with one click.
          </p>
        </div>

        {/* Pricing Cards Grid (8-point grid, consistent padding) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between p-8 rounded-2xl border transition-all ${
                plan.popular 
                  ? "bg-white border-2 border-red-600 card-shadow scale-102 z-10" 
                  : "bg-white border-neutral-200 card-shadow hover:border-neutral-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-red-600 text-white text-[11px] font-mono font-bold uppercase tracking-wider rounded-full shadow-xs flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>MOST POPULAR</span>
                </div>
              )}
              
              <div>
                <div className="mb-6 space-y-2">
                  <h3 className="text-xl font-bold text-neutral-950">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-neutral-600 min-h-[36px] leading-relaxed">
                    {plan.description}
                  </p>
                  <div className="pt-2 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-neutral-950 tracking-tight font-mono">
                      {plan.price}
                    </span>
                    <span className="text-xs font-semibold text-neutral-500 font-mono">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 space-y-3">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    INCLUDED CAPABILITIES:
                  </div>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                      <Check className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-6">
                <Link
                  href={plan.href}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold transition-all ${
                    plan.popular
                      ? "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-xs"
                      : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200"
                  }`}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Trust Footer */}
        <div className="mt-12 text-center text-xs text-neutral-500 font-mono">
          <span>✓ NO HIDDEN FEES</span>
          <span className="mx-2">•</span>
          <span>✓ 14-DAY MONEY-BACK GUARANTEE</span>
          <span className="mx-2">•</span>
          <span>✓ INSTANT CANCELLATION</span>
        </div>

      </div>
    </section>
  )
}
