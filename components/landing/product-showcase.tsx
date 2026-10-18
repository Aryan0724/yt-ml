"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, X, Sparkles, Smartphone } from "lucide-react"

type NicheKey = "tech" | "gaming" | "productivity" | "finance"

interface NicheExample {
  category: string
  badTitle: string
  badCutoff: string
  badCtr: string
  badThumbnailText: string
  badFlaws: string[]
  goodTitle: string
  goodCtr: string
  goodThumbnailBadge: string
  goodWins: string[]
  viewsLift: string
}

const EXAMPLES: Record<NicheKey, NicheExample> = {
  tech: {
    category: "Tech & AI",
    badTitle: "My complete in-depth review of AI video editing tools in 2026 for beginners...",
    badCutoff: "My complete in-depth review of AI video editing tools in...",
    badCtr: "3.2% CTR",
    badThumbnailText: "AI Tools Review (Dark / Low Contrast)",
    badFlaws: [
      "Title cuts off at 48 characters on mobile phones",
      "Thumbnail blends into YouTube Dark Mode",
      "Sounds like a textbook instead of an exciting story",
    ],
    goodTitle: "I Tested 50 AI Video Tools (Only 3 Actually Work)",
    goodCtr: "9.4% CTR",
    goodThumbnailBadge: "ONLY 3 WORKED",
    goodWins: [
      "100% visible on all mobile screens (47 characters)",
      "High-contrast crimson badge stops the thumb-scroll",
      "Instant curiosity hook: viewers need to know which 3 won",
    ],
    viewsLift: "+193% More Views",
  },
  gaming: {
    category: "Gaming & Challenges",
    badTitle: "Playing GTA 6 with my friends and testing all the new hidden mechanics...",
    badCutoff: "Playing GTA 6 with my friends and testing all the...",
    badCtr: "3.8% CTR",
    badThumbnailText: "Gameplay Screenshot (Cluttered)",
    badFlaws: [
      "Punchline is hidden behind '...' on phone screens",
      "No clear stakes or challenge rule",
      "Blends into thousands of generic gameplay uploads",
    ],
    goodTitle: "I Survived 100 Days in GTA 6 on 1 HP (Impossible Challenge)",
    goodCtr: "11.2% CTR",
    goodThumbnailBadge: "1 HP ONLY",
    goodWins: [
      "Extreme challenge stakes established in 0.5 seconds",
      "Clear visual contrast against competitor feed",
      "Title fits perfectly on both iOS and Android apps",
    ],
    viewsLift: "+240% More Views",
  },
  productivity: {
    category: "Lifestyle & Productivity",
    badTitle: "The daily morning routine that helps me stay disciplined, focused and healthy...",
    badCutoff: "The daily morning routine that helps me stay disciplined...",
    badCtr: "3.5% CTR",
    badThumbnailText: "Coffee Cup Photo (Generic)",
    badFlaws: [
      "Vague promise that doesn't stand out",
      "Title truncates before explaining the value",
      "Zero emotional tension or curiosity",
    ],
    goodTitle: "The 5AM Routine That Ruined My Life (Honest Truth)",
    goodCtr: "9.8% CTR",
    goodThumbnailBadge: "I WAS WRONG",
    goodWins: [
      "Contrarian angle stands out against 1,000 positive routine videos",
      "High emotional curiosity: why did it ruin their life?",
      "Safe-zone length: fits without ellipsis",
    ],
    viewsLift: "+180% More Views",
  },
  finance: {
    category: "Business & Finance",
    badTitle: "How to build a successful one-person media business online in today's economy...",
    badCutoff: "How to build a successful one-person media business...",
    badCtr: "4.1% CTR",
    badThumbnailText: "Laptop on Desk (Bland)",
    badFlaws: [
      "Generic advice phrasing gets ignored",
      "Fails to establish credibility or specifics",
      "Gets lost in YouTube's black background",
    ],
    goodTitle: "Why I Shut Down My $20K/Month Agency (The Hidden Trap)",
    goodCtr: "10.5% CTR",
    goodThumbnailBadge: "$20K MISTAKE",
    goodWins: [
      "Counter-intuitive story: why would someone shut down $20K/mo?",
      "Specific number creates instant authority",
      "High visual punch stops the feed scroll",
    ],
    viewsLift: "+215% More Views",
  },
}

export function ProductShowcase() {
  const [activeNiche, setActiveNiche] = useState<NicheKey>("tech")
  const current = EXAMPLES[activeNiche]

  return (
    <section className="landing-col pt-4 pb-20 relative z-10" id="draft">
      
      {/* Big, Clear Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#EE1122] text-xs font-mono font-bold tracking-wider uppercase border border-red-200/80 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#EE1122]" />
          <span>WHAT PREYT ACTUALLY DOES</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#161512] leading-[1.12]">
          See the difference between a <br />
          <span className="text-neutral-400 line-through mr-2 font-medium">flop</span> 
          and a <span className="text-[#EE1122]">viral hit</span>.
        </h2>

        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Most videos don&apos;t fail because the video is bad. They fail because the title gets cut off on mobile phones, or the thumbnail is invisible in YouTube&apos;s dark mode.
        </p>

        {/* Niche Clickable Switcher */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-neutral-500 font-medium mr-1">Select a niche:</span>
          {(["tech", "gaming", "productivity", "finance"] as NicheKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveNiche(key)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeNiche === key
                  ? "bg-[#161512] text-white shadow-xs scale-102"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
              }`}
            >
              {EXAMPLES[key].category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Side-by-Side Comparison Container */}
      <div className="squircle-card p-6 sm:p-10 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
          
          {/* ================================================================= */}
          {/* LEFT: THE FLOP (WHAT MOST CREATORS DO)                            */}
          {/* ================================================================= */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-2 text-neutral-600 font-bold text-xs font-mono uppercase">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
                  <span>THE RAW DRAFT (TYPICAL FLOP)</span>
                </div>
                <span className="px-2.5 py-1 bg-neutral-200 text-neutral-700 font-mono text-xs font-bold rounded-lg">
                  {current.badCtr}
                </span>
              </div>

              {/* Real YouTube Mobile Feed Simulation */}
              <div className="bg-[#0f0f0f] rounded-2xl p-4 border border-neutral-800 text-white shadow-sm space-y-3">
                {/* Thumbnail Preview */}
                <div className="aspect-video bg-neutral-900 rounded-xl relative overflow-hidden flex items-center justify-center p-4 border border-neutral-800 text-center">
                  <span className="text-neutral-500 text-xs font-medium max-w-[200px]">
                    {current.badThumbnailText}
                  </span>
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-[10px] font-mono text-neutral-400 rounded">
                    12:45
                  </span>
                </div>

                {/* Video Info in Feed */}
                <div className="flex gap-3 pt-1">
                  <div className="w-8 h-8 rounded-full bg-neutral-700 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-neutral-300 leading-snug">
                      {current.badCutoff}
                      <span className="text-red-400 font-bold ml-1 bg-red-950/60 px-1 py-0.5 rounded text-[11px]">
                        [CUT OFF]
                      </span>
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Creator Channel • 1.2K views • 2 days ago
                    </p>
                  </div>
                </div>
              </div>

              {/* The 3 Fatal Flaws */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">
                  WHY THIS VIDEO WILL FLOP:
                </div>
                {current.badFlaws.map((flaw, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                    <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 shrink-0 flex items-center justify-center mt-0.5">
                      <X className="w-3.5 h-3.5" />
                    </div>
                    <span>{flaw}</span>
                  </div>
                ))}
              </div>

            </div>

            <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-400 font-medium">
              Outcome: YouTube stops recommending the video after 48 hours.
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT: THE PREYT WINNER                                           */}
          {/* ================================================================= */}
          <div className="rounded-2xl border-2 border-[#EE1122] bg-white p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-md relative">
            
            {/* Top Recommended Tag */}
            <div className="absolute -top-3.5 right-6 px-3 py-1 bg-[#EE1122] text-white text-xs font-bold rounded-full shadow-xs">
              {current.viewsLift}
            </div>

            <div className="space-y-6">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2 text-[#EE1122] font-bold text-xs font-mono uppercase">
                  <Sparkles className="w-4 h-4 text-[#EE1122]" />
                  <span>PREYT OPTIMIZED PACKAGE</span>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-bold rounded-lg">
                  {current.goodCtr}
                </span>
              </div>

              {/* Real YouTube Mobile Feed Simulation (Optimized) */}
              <div className="bg-[#0f0f0f] rounded-2xl p-4 border border-neutral-800 text-white shadow-sm space-y-3">
                {/* High Contrast Thumbnail */}
                <div className="aspect-video bg-neutral-950 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 border border-neutral-800">
                  <div className="flex justify-start">
                    <span className="px-2.5 py-1 bg-[#EE1122] text-white font-black text-xs uppercase tracking-wider rounded shadow-xs">
                      {current.goodThumbnailBadge}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span className="text-emerald-400 font-semibold">High Contrast Pop</span>
                    <span className="px-1.5 py-0.5 bg-black/80 text-white rounded">12:45</span>
                  </div>
                </div>

                {/* Video Info in Feed */}
                <div className="flex gap-3 pt-1">
                  <div className="w-8 h-8 rounded-full bg-[#EE1122] shrink-0 flex items-center justify-center text-white text-xs font-bold">
                    YT
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {current.goodTitle}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1.5">
                      <span>Creator Channel</span>
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>•</span>
                      <span className="text-[#EE1122] font-semibold">142K views</span>
                      <span>•</span>
                      <span className="text-emerald-400">Predicted CTR: {current.goodCtr}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* The 3 Winning Elements */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                  WHY THIS VIDEO WINS THE CLICK:
                </div>
                {current.goodWins.map((win, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-900 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 shrink-0 flex items-center justify-center mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{win}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Bottom Action */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Ready to film with confidence</span>
              </span>
              <Link
                href="/signup"
                className="action-button action-button--primary text-xs px-4 py-2 font-semibold shadow-xs"
              >
                <span>Test your title</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

          </div>

        </div>
      </div>

    </section>
  )
}
