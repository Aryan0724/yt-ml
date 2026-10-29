"use client"

import Link from "next/link"
import { Check, ArrowRight, Sparkles, ShieldCheck } from "lucide-react"

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
      "Zero Credit Card Required",
    ],
    buttonText: "Run Free Audits",
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
      "Dedicated Model Support via Slack",
    ],
    buttonText: "Start Studio Trial",
    href: "/signup?plan=studio",
    popular: false,
  },
]

interface PricingSectionProps {
  isMainHeading?: boolean
}

export function PricingSection({ isMainHeading = false }: PricingSectionProps) {
  return (
    <section className="py-24 bg-white border-b border-neutral-200" id="pricing">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider">
            <span>[ TRANSPARENT PRICING ]</span>
          </div>

          {isMainHeading ? (
            <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              Predictable pricing that <br />
              <span className="text-red-600">pays for itself</span> in one upload.
            </h1>
          ) : (
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              Predictable pricing that <br />
              <span className="text-red-600">pays for itself</span> in one upload.
            </h2>
          )}

          <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto font-normal leading-relaxed">
            Start completely free. No credit card required. Upgrade when you need unlimited audits and competitor radar.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between p-8 rounded-3xl transition-all duration-200 ${
                plan.popular
                  ? "bg-white border-2 border-red-600 shadow-xl md:-translate-y-2"
                  : "bg-white border border-neutral-200 shadow-xs hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider py-1 px-3.5 rounded-full shadow-sm flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  Most Popular
                </div>
              )}

              <div>
                {/* Header */}
                <div className="space-y-1 mb-6">
                  <h3 className="text-xl font-bold text-neutral-950">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-normal leading-relaxed min-h-[32px]">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-neutral-100">
                  <span className="text-4xl sm:text-5xl font-black text-neutral-950 tracking-tight font-mono">
                    {plan.price}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium font-mono">
                    {plan.period}
                  </span>
                </div>

                {/* Feature List */}
                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-neutral-700 leading-normal font-medium">
                      <div className="mt-0.5 rounded-full bg-red-50 text-red-600 p-0.5 shrink-0">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Link
                href={plan.href}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  plan.popular
                    ? "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
                    : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-200"
                }`}
              >
                <span>{plan.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Guarantee Strip */}
        <div className="mt-12 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>30-day money-back guarantee on all paid plans · Cancel anytime with one click in your billing settings</span>
        </div>

      </div>
    </section>
  )
}
