"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Radar,
  ActivitySquare,
  Users,
  BarChart3,
  Check,
  ArrowRight,
  Search,
  Moon,
  Sun,
  Flame,
  MessageSquare,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Layers,
} from "lucide-react"

export function CoreCapabilities() {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [draftMode, setDraftMode] = useState<"dark" | "light">("dark")

  return (
    <section id="capabilities" className="py-24 bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Section Header with TubeBuddy-inspired clear headline */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#EE1122] text-xs font-mono font-bold uppercase tracking-wider border border-red-200/60">
            <Layers className="w-3.5 h-3.5" />
            <span>PREYT PLATFORM CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#161512] leading-[1.12]">
            Stop guessing. <br className="hidden sm:inline" />
            <span className="text-[#EE1122]">Start knowing.</span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl font-normal leading-relaxed">
            Data-backed intelligence built to help you find surging topics, optimize mobile feed CTR, and audit video packaging before filming.
          </p>

          {/* Goal Selector Tabs (TubeBuddy-inspired clarity) */}
          <div className="pt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider mr-1">
              Filter by Goal:
            </span>
            {[
              { id: "all", label: "All Capabilities" },
              { id: "research", label: "01. Research & Discovery" },
              { id: "contrast", label: "02. Titles & Thumbnails" },
              { id: "competitor", label: "03. Competitor Intel" },
              { id: "audit", label: "04. Pre-Upload Audit" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id)
                  if (tab.id !== "all") {
                    const el = document.getElementById(`cap-${tab.id}`)
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#161512] text-white border-[#161512] shadow-xs"
                    : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 1: YOUTUBE RESEARCH AND DISCOVERY (Text Left, Mockup Right)           */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "research") && (
          <div
            id="cap-research"
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-8 border-t border-neutral-100"
          >
            {/* Text Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#EE1122] text-[11px] font-mono font-bold tracking-wider uppercase border border-red-200/60">
                <Radar className="w-3 h-3" />
                <span>01 / RESEARCH AND DISCOVERY</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161512] leading-tight">
                Find what content your audience craves before your niche saturates.
              </h3>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                No more guessing what to film. PreYT scans search momentum, view-to-subscriber velocity, and competitor comment sections to reveal proven topics weeks ahead of competitor saturation.
              </p>

              {/* Pill tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "Find Topics Before Competitors",
                  "High Demand, Low Supply",
                  "Avoid Saturated Ideas",
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 font-medium"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard/radar"
                  className="inline-flex items-center gap-2 action-button action-button--primary text-sm font-semibold"
                >
                  <span>Explore Topic Radar</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Mockup Column (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="squircle-card p-6 sm:p-8 bg-neutral-950 text-white rounded-3xl border border-neutral-800 shadow-xl space-y-6">
                {/* Simulated Radar Search Header */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800 text-xs font-mono">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Search className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Topic Query: <span className="text-white font-semibold">"ai video editing"</span></span>
                  </div>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE DEMAND RADAR
                  </span>
                </div>

                {/* Surging Topic Card */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-mono uppercase text-orange-400 font-bold tracking-wider">
                          Surging Topic (+340% 30d Velocity)
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                        AI Video Workflows for Solo Creators
                      </h4>
                    </div>
                    <span className="self-start sm:self-auto px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 text-xs font-mono font-bold border border-emerald-800/80">
                      High Demand Gap
                    </span>
                  </div>

                  {/* Meters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                      <div className="text-neutral-400 text-[11px] font-mono">AUDIENCE DEMAND</div>
                      <div className="text-lg font-bold font-mono text-white">94/100</div>
                      <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="w-[94%] h-full bg-[#EE1122] rounded-full" />
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                      <div className="text-neutral-400 text-[11px] font-mono">CREATOR SUPPLY</div>
                      <div className="text-lg font-bold font-mono text-emerald-400">Low (Gap)</div>
                      <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="w-[32%] h-full bg-emerald-500 rounded-full" />
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                      <div className="text-neutral-400 text-[11px] font-mono">SATURATION RISK</div>
                      <div className="text-lg font-bold font-mono text-blue-400">Early Wave</div>
                      <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="w-[20%] h-full bg-blue-500 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Key Insight */}
                  <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-xs text-neutral-300 font-sans flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>High-Opportunity Angle:</strong> Audiences are asking for end-to-end timeline automation rather than high-level tool roundups. Prime window before competitor saturation.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROW 2: TITLE AND THUMBNAIL TOOLS (Mockup Left, Text Right - Alternating)   */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "contrast") && (
          <div
            id="cap-contrast"
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-8 border-t border-neutral-100"
          >
            {/* Visual Mockup Column (7 Cols) */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="squircle-card p-6 sm:p-8 bg-neutral-950 text-white rounded-3xl border border-neutral-800 shadow-xl space-y-5">
                {/* Header with Dark/Light Mode Switcher */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-neutral-400">FEED GLANCEABILITY TEST:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                      94% CONTRAST PASS
                    </span>
                  </div>
                  <div className="flex items-center bg-neutral-900 rounded-lg p-0.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setDraftMode("dark")}
                      className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                        draftMode === "dark" ? "bg-neutral-800 text-white font-bold" : "text-neutral-500 hover:text-white"
                      }`}
                    >
                      <Moon className="w-3 h-3" />
                      <span>Dark (#0F0F0F)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraftMode("light")}
                      className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                        draftMode === "light" ? "bg-white text-neutral-900 font-bold" : "text-neutral-500 hover:text-white"
                      }`}
                    >
                      <Sun className="w-3 h-3" />
                      <span>Light</span>
                    </button>
                  </div>
                </div>

                {/* Simulated Feed Video Card */}
                <div
                  className={`p-5 rounded-2xl border transition-colors ${
                    draftMode === "dark"
                      ? "bg-[#0f0f0f] border-neutral-800 text-white"
                      : "bg-white border-neutral-200 text-neutral-950"
                  }`}
                >
                  <div className="aspect-video bg-neutral-900 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 border border-neutral-800">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-[#EE1122] text-white font-mono font-black text-[11px] uppercase tracking-wider rounded">
                        WINNER VARIANT
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-500/90 text-white font-mono text-[10px] font-bold rounded">
                        WCAG 2.1 AAA Compliant
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
                      <span>Zero Dark-Border Bleed</span>
                      <span className="px-1.5 py-0.5 bg-black/80 text-white rounded">11:42</span>
                    </div>
                  </div>

                  {/* Title Truncation Comparison */}
                  <div className="mt-4 space-y-2.5">
                    {/* Failing option */}
                    <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs space-y-1">
                      <div className="flex items-center justify-between text-red-500 font-mono text-[11px] font-bold">
                        <span>❌ FAILING DRAFT (71 CHARS — TRUNCATED ON MOBILE)</span>
                        <span>CLIPPED AT CHAR 48</span>
                      </div>
                      <p className="line-through opacity-75 font-mono text-[11px]">
                        "Why I think most AI video editing tools are too expensive and hard to learn..."
                      </p>
                    </div>

                    {/* Audited option */}
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                      <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">
                        <span>✅ AUDITED (42 CHARS — 100% VISIBLE HOOK)</span>
                        <span>SAFE ZONE PASS</span>
                      </div>
                      <p className="font-semibold text-xs">
                        "I Tested 50 Video Editors (Only 2 Work)"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-5 order-1 lg:order-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#EE1122] text-[11px] font-mono font-bold tracking-wider uppercase border border-red-200/60">
                <ActivitySquare className="w-3 h-3" />
                <span>02 / TITLE AND THUMBNAIL TOOLS</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161512] leading-tight">
                Simulate mobile feeds and test dark-mode contrast.
              </h3>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                Over 70% of YouTube feed impressions happen on phones where titles truncate after 48 characters. Audit title cutoffs and test whether your thumbnail stands out against YouTube Dark Theme before publishing.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "Mobile Title Cutoff (48 Letters)",
                  "Dark Mode Contrast Check",
                  "Title Clickability & Hook Rating",
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 font-medium"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard/analyze"
                  className="inline-flex items-center gap-2 action-button action-button--primary text-sm font-semibold"
                >
                  <span>Test in Contrast Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROW 3: COMPETITOR INTELLIGENCE (Text Left, Mockup Right)                  */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "competitor") && (
          <div
            id="cap-competitor"
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-8 border-t border-neutral-100"
          >
            {/* Text Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#EE1122] text-[11px] font-mono font-bold tracking-wider uppercase border border-red-200/60">
                <Users className="w-3 h-3" />
                <span>03 / COMPETITOR INTELLIGENCE</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161512] leading-tight">
                Reverse-engineer what top rivals do differently.
              </h3>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                Compare your channel side-by-side with your niche's leaders. Discover upload frequency gaps, audience demographic overlaps, and winning title structures that generate outlier view multipliers.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "Compare 30-Day Views",
                  "Viral Format Multipliers (3.8x)",
                  "Steal Rival Comment Questions",
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 font-medium"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard/channel"
                  className="inline-flex items-center gap-2 action-button action-button--primary text-sm font-semibold"
                >
                  <span>Compare Channels</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Mockup Column (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="squircle-card p-6 sm:p-8 bg-neutral-950 text-white rounded-3xl border border-neutral-800 shadow-xl space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800 text-xs font-mono">
                  <span className="text-neutral-400">
                    HEAD-TO-HEAD: <span className="text-white font-bold">Your Channel vs Top Niche Leader</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                    NICHE BENCHMARK
                  </span>
                </div>

                {/* Head-to-Head Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                    <div className="text-[11px] font-mono text-neutral-400 uppercase">YOUR CHANNEL BASELINE</div>
                    <div className="text-xl font-extrabold text-white font-mono">42.5K views/30d</div>
                    <div className="text-[11px] text-neutral-400 font-sans">Cadence: 2.1 videos/mo</div>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                    <div className="text-[11px] font-mono text-neutral-400 uppercase">NICHE LEADER AVERAGE</div>
                    <div className="text-xl font-extrabold text-emerald-400 font-mono">185K views/30d</div>
                    <div className="text-[11px] text-neutral-400 font-sans">Cadence: 3.8 videos/mo</div>
                  </div>
                </div>

                {/* Outlier multiplier findings */}
                <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>OUTLIER FORMAT DETECTED (3.8x MULTIPLIER)</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    Videos structured with contrarian titles (e.g. <em>"Why I Stopped Using..."</em>) average <strong>3.8x more views</strong> than generic tool tutorials in this niche.
                  </p>
                </div>

                {/* Unserved comment demand question */}
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                      UNANSWERED RIVAL COMMENT DEMAND
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      HIGH CONTENT GAP
                    </span>
                  </div>
                  <div className="text-xs text-white italic bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                    "Does anyone know how to configure this on Windows without WSL? Top tutorial skipped the whole setup!"
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    412 upvotes in competitor comments · 0 competing videos found
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROW 4: PRE-UPLOAD VIDEO ANALYSIS (Mockup Left, Text Right - Alternating)   */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "audit") && (
          <div
            id="cap-audit"
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-8 border-t border-neutral-100"
          >
            {/* Visual Mockup Column (7 Cols) */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="squircle-card p-6 sm:p-8 bg-neutral-950 text-white rounded-3xl border border-neutral-800 shadow-xl space-y-5">
                {/* Header with Readiness Score */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                  <div>
                    <div className="text-[11px] font-mono text-neutral-400 uppercase">DIAGNOSTIC REPORT</div>
                    <div className="text-base font-bold text-white mt-0.5">Pre-Upload Readiness Verdict</div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-extrabold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      READY TO FILM (SCORE: 91/100)
                    </span>
                  </div>
                </div>

                {/* 4 Diagnostic Checklist Items */}
                <div className="space-y-2.5">
                  {[
                    {
                      label: "Title Curiosity Hook",
                      status: "Pass",
                      detail: "Tension front-loaded within the first 35 characters. No filler prefixes.",
                      pass: true,
                    },
                    {
                      label: "Mobile Viewport Safe-Zone",
                      status: "Pass",
                      detail: "42 characters total. Full hook visible on all smartphone screens.",
                      pass: true,
                    },
                    {
                      label: "Dark Feed Contrast Ratio",
                      status: "Pass (94%)",
                      detail: "Perimeter lighting prevents bleeding into YouTube's #0F0F0F dark mode.",
                      pass: true,
                    },
                    {
                      label: "First 30s Retention Anchor",
                      status: "Pass",
                      detail: "Intro confirms title paradox within the first 12 seconds.",
                      pass: true,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-white flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 pl-5.5 font-sans leading-normal">
                          {item.detail}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-800/80 shrink-0">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Benchmark Citation */}
                <div className="pt-2 text-[11px] font-mono text-neutral-500 flex items-center justify-between border-t border-neutral-800">
                  <span>Model: 14.8M Uploads Baseline</span>
                  <span className="text-neutral-400">PreYT Intelligence Engine</span>
                </div>
              </div>
            </div>

            {/* Text Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-5 order-1 lg:order-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#EE1122] text-[11px] font-mono font-bold tracking-wider uppercase border border-red-200/60">
                <BarChart3 className="w-3 h-3" />
                <span>04 / PRE-UPLOAD VIDEO ANALYSIS</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161512] leading-tight">
                Identify why videos fail and fix them before filming.
              </h3>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                Get an in-depth diagnostic report for any draft. We evaluate packaging tension, viewer glanceability, and hook retention before you hit record so you never waste 40 hours producing a video that flops.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "Benchmarked Against 14.8M Videos",
                  "Mobile Glanceability Rating",
                  "Pre-Filming Packaging Checklist",
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 font-medium"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard/analyze"
                  className="inline-flex items-center gap-2 action-button action-button--primary text-sm font-semibold"
                >
                  <span>Audit a Video Concept</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
