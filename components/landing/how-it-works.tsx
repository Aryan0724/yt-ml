"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Type, Sliders, CheckCircle2 } from "lucide-react"

const STEPS = [
  {
    num: "01",
    title: "Paste Your Draft Title & Thumbnail",
    description:
      "Enter your working title and upload your thumbnail canvas. No YouTube account connection, login, or channel permissions required.",
    detail: "Supports PNG, JPG, WebP. Checks first 54 characters."
  },
  {
    num: "02",
    title: "PreYT Simulates Real Mobile Feeds",
    description:
      "Our computer-vision engine tests luminance contrast against dark mode (#0F0F0F) and checks if YouTube's duration clock overlays critical faces or text.",
    detail: "Runs 120px squint test and safe-zone obstruction check."
  },
  {
    num: "03",
    title: "Get Exact Fixes Before You Film",
    description:
      "Receive specific, plain-English adjustments: 'Move the outcome to the first 4 words' or 'Increase subject rim lighting by 15% to separate from dark feed'.",
    detail: "Make changes before you spend 40 hours recording."
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 md:py-24 bg-white border-b border-neutral-200" id="how-it-works">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-mono font-bold tracking-wider uppercase border border-red-200/60">
            <span>[ THE 3-STEP JOURNEY ]</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.12]">
            How creators audit a video <br />
            <span className="text-red-600">in under 60 seconds.</span>
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
            A fast, repeatable pre-filming checkpoint between finishing your outline and picking up your camera:
          </p>
        </div>

        {/* 3 Step Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white font-mono font-bold text-base flex items-center justify-center">
                  {step.num}
                </div>

                <h3 className="text-lg font-bold text-neutral-950">
                  {step.title}
                </h3>

                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/80 text-[11px] font-mono text-neutral-500">
                {step.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
