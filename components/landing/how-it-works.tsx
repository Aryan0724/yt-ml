"use client"

import { Search, Sparkles, TrendingUp } from "lucide-react"

function StepCell({
  num,
  title,
  desc,
  icon: Icon
}: {
  num: string
  title: string
  desc: string
  icon: React.ElementType
}) {
  return (
    <div className="bg-white p-8 md:p-10 text-left flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200 last:border-r-0 hover:bg-neutral-50/70 transition-all group">
      <div className="space-y-5">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-[#EE1122] border border-red-100 group-hover:scale-105 transition-transform duration-300">
          <Icon className="w-6 h-6" />
        </div>
        
        <span className="text-xs font-mono text-[#EE1122] font-bold tracking-widest">{num}</span>
        <h4 className="text-lg sm:text-xl font-bold text-[#161512] leading-snug">{title}</h4>
        <p className="text-xs sm:text-sm font-normal text-neutral-600 leading-relaxed">{desc}</p>
      </div>

      <div className="pt-6 mt-6 border-t border-neutral-100 text-xs font-mono text-neutral-400">
        Estimated time: {num === "STEP 01" ? "10 seconds" : num === "STEP 02" ? "Instant scan" : "Ready to film"}
      </div>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section className="landing-col py-20 border-b border-neutral-200" id="process">
      
      {/* Header */}
      <div className="mb-14 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono font-bold tracking-widest text-[#EE1122] uppercase bg-red-50 rounded-full border border-red-200/60 shadow-2xs">
          <span>[ HOW IT WORKS ]</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#161512] leading-[1.12]">
          Three steps to <br className="hidden sm:inline" />
          <span className="text-[#EE1122]">more YouTube views</span>.
        </h2>

        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
          A simple, frictionless workflow designed to fit right before your filming or editing sprint.
        </p>
      </div>

      {/* 3 Step Card Row */}
      <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white grid grid-cols-1 md:grid-cols-3 gap-0 relative shadow-sm">
        
        <StepCell
          num="STEP 01"
          title="Type Your Working Idea"
          desc="Paste your draft title or drop in a thumbnail sketch. You don't need to connect your channel or grant any permissions to test."
          icon={Search}
        />

        <StepCell
          num="STEP 02"
          title="14.8M Benchmark Scan"
          desc="Our system simulates real mobile feeds, checks character truncations on phone screens, and scores dark mode thumbnail contrast."
          icon={Sparkles}
        />

        <StepCell
          num="STEP 03"
          title="Publish The Winner"
          desc="Pick the high-CTR title and thumbnail variant that won't get cut off. Know your video will win the click before you hit record."
          icon={TrendingUp}
        />

      </div>

    </section>
  )
}
