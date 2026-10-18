import Link from "next/link"
import { ArrowRight, Sparkles, TrendingUp, Search, Sliders, Smartphone, Check, ArrowDown } from "lucide-react"

export function FlowchartPipeline() {
  return (
    <section className="py-24 bg-white border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Curved Underline */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono tracking-wider uppercase">
            <span>[ AUTOPILOT PIPELINE ]</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight leading-[1.12]">
            PreYT is your pre-upload <br />
            <span className="curved-underline">optimization autopilot.</span>
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto font-normal leading-relaxed">
            Eliminate the stress of guessing your next upload. Four connected steps from raw idea to algorithmic breakout.
          </p>
        </div>

        {/* Rivalflow-Style Connected Flowchart */}
        <div className="space-y-6 max-w-3xl mx-auto">
          
          {/* STEP 1: TOPIC RADAR */}
          <div className="p-6 sm:p-7 rounded-2xl border border-neutral-200 bg-neutral-50/70 card-shadow-hover">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-red-600 font-bold">
                  <span>STEP 01 // TOPIC DISCOVERY</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-950">
                  Detect Breakout Demand Before Niche Saturation
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-md">
                  PreYT tracks 4.8M videos daily. When search interest surges for a question while creator competition remains in low tier, you receive an immediate alert.
                </p>
              </div>

              {/* Visual Mini Card */}
              <div className="p-3.5 bg-white rounded-xl border border-neutral-200 shrink-0 w-full sm:w-60 shadow-2xs space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-neutral-500 text-[11px]">
                  <span>QUERY SURGE</span>
                  <span className="text-red-600 font-bold">+340%</span>
                </div>
                <div className="font-bold text-neutral-900 font-sans truncate">
                  "AI Video Editing 2026"
                </div>
                <div className="text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <Check className="w-3 h-3" /> Low Competition Window
                </div>
              </div>
            </div>
          </div>

          {/* Connector Arrow */}
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
              <ArrowDown className="w-4 h-4 text-red-600" />
            </div>
          </div>

          {/* STEP 2: PACKAGING SCORER */}
          <div className="p-6 sm:p-7 rounded-2xl border border-neutral-200 bg-neutral-50/70 card-shadow-hover">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-red-600 font-bold">
                  <span>STEP 02 // PACKAGING SCORER</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-950">
                  Score 20 Title & Thumbnail Variants
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-md">
                  Our model ranks your title drafts against 14M benchmark videos on curiosity loops, character cutoff limits, and emotional stakes.
                </p>
              </div>

              {/* Visual Mini Ranking Card */}
              <div className="p-3.5 bg-white rounded-xl border border-neutral-200 shrink-0 w-full sm:w-60 shadow-2xs space-y-1.5 text-xs font-mono">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-neutral-500">RANKED VARIANTS</span>
                  <span className="text-red-600 font-bold">TOP PICK</span>
                </div>
                <div className="p-1.5 bg-red-50 rounded border border-red-200 font-sans text-xs font-bold text-red-950 truncate">
                  1. "I Tested 50 AI Tools..." (9.4%)
                </div>
                <div className="p-1.5 bg-neutral-50 rounded font-sans text-xs text-neutral-600 truncate">
                  2. "Why 90% of Tools Fail..." (8.2%)
                </div>
              </div>
            </div>
          </div>

          {/* Connector Arrow */}
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
              <ArrowDown className="w-4 h-4 text-red-600" />
            </div>
          </div>

          {/* STEP 3: LIVE FEED SIMULATION */}
          <div className="p-6 sm:p-7 rounded-2xl border border-neutral-200 bg-neutral-50/70 card-shadow-hover">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-red-600 font-bold">
                  <span>STEP 03 // LIVE SIMULATION</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-950">
                  Preview in the Live Mobile Feed
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-md">
                  Verify that your thumbnail pops next to active competitors on YouTube Dark Theme and passes the 54-character mobile truncation check.
                </p>
              </div>

              {/* Visual Mini Simulator Badge */}
              <div className="p-3.5 bg-white rounded-xl border border-neutral-200 shrink-0 w-full sm:w-60 shadow-2xs space-y-2 text-xs">
                <div className="flex justify-between items-center font-mono text-[11px] text-neutral-500">
                  <span>FEED CONTRAST</span>
                  <span className="text-green-700 font-bold">89% PASS</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                  <div className="bg-green-600 h-full w-[89%]" />
                </div>
                <div className="text-[11px] text-neutral-500 font-mono">
                  Safe Area: 47/54 Chars (No Cutoff)
                </div>
              </div>
            </div>
          </div>

          {/* Connector Arrow */}
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
              <ArrowDown className="w-4 h-4 text-red-600" />
            </div>
          </div>

          {/* STEP 4: WATCH VIEWS SOAR (Rivalflow style proof) */}
          <div className="p-6 sm:p-7 rounded-2xl border-2 border-red-600 bg-red-50/15 card-shadow-hover">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-red-700 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  <span>STEP 04 // ALGORITHMIC BROWSE PUSH</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-950">
                  Watch Your Video's Browse Impressions Soar
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-md">
                  Because your title and thumbnail clear the 70% retention and 8%+ CTR thresholds, YouTube's Browse Features pushes your upload to wider audience cohorts.
                </p>
              </div>

              {/* Visual Mini Analytics Card */}
              <div className="p-4 bg-white rounded-xl border border-red-200 shrink-0 w-full sm:w-60 shadow-sm space-y-1 text-center">
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">30-DAY VIEW VELOCITY</span>
                <div className="text-2xl font-black text-neutral-950 font-mono">
                  340,000 <span className="text-xs text-red-600 font-sans font-bold">Views</span>
                </div>
                <div className="text-[11px] font-mono text-green-700 font-bold">
                  ▲ +206% vs Channel Baseline
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Flowchart Action */}
        <div className="mt-14 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-full shadow-sm hover:shadow transition-all"
          >
            <span>Start Free Channel Audit</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}
