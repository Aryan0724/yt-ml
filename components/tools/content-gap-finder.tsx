"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Copy,
  Check,
  Compass
} from "lucide-react"

interface GapResult {
  topic: string
  saturationScore: "Low (High Opportunity)" | "Moderate" | "Heavily Saturated"
  saturationColor: string
  underservedQuestions: string[]
  recommendedAngle: string
  engineeredTitle: string
  thumbnailBrief: string
}

const PRESET_TOPICS: Record<string, GapResult> = {
  "ai coding": {
    topic: "AI Coding & Autonomous Agents",
    saturationScore: "Moderate",
    saturationColor: "text-amber-700 bg-amber-50 border-amber-200",
    underservedQuestions: [
      "How do senior engineers actually debug hallucinated code without wasting hours?",
      "Can autonomous agents handle existing monolithic legacy codebases or only greenfield apps?",
      "What is the actual production cost per pull request when using multi-agent loops?"
    ],
    recommendedAngle: "Shift away from basic 'Hello World' demos toward production-grade architectural stress testing.",
    engineeredTitle: "I Put Autonomous AI in a 500k-Line Monolith (It Broke Everything)",
    thumbnailBrief: "Dark terminal screen with thousands of red error lines; autonomous agent logo in center; stressed engineer holding forehead."
  },
  "personal finance": {
    topic: "Personal Finance & Investing",
    saturationScore: "Heavily Saturated",
    saturationColor: "text-red-700 bg-red-50 border-red-200",
    underservedQuestions: [
      "Why are standard 3-fund Boglehead portfolios failing to outpace real suburban living costs?",
      "How do high-earners navigate tax drag without paying \$5,000 to wealth advisors?",
      "What happens to real estate investments if commercial debt triggers regional banking defaults?"
    ],
    recommendedAngle: "Expose hidden institutional fees and explain macro inflation mechanisms using empirical spreadsheets.",
    engineeredTitle: "The Retirement Math That Advisors Don't Show You in 2026",
    thumbnailBrief: "Spreadsheet cell showing -$340,000 in red; retirement book crossed out; clean high-contrast graph."
  },
  "fitness": {
    topic: "Fitness & Strength Training",
    saturationScore: "Heavily Saturated",
    saturationColor: "text-red-700 bg-red-50 border-red-200",
    underservedQuestions: [
      "How do people working 10-hour desk jobs eliminate anterior pelvic tilt without 2-hour gym sessions?",
      "Why does standard bodybuilding volume cause chronic tendonitis in lifters over 30?",
      "What is the minimum effective dose of cardio for cognitive longevity rather than fat loss?"
    ],
    recommendedAngle: "Ditch generic workout routines and focus on biomechanical recovery for sedentary desk workers.",
    engineeredTitle: "Fix Your Desk Slouch in 48 Hours (Biomechanical Breakdown)",
    thumbnailBrief: "Side-by-side spine alignment scan; red curvature line vs green straight line; 0 face required."
  },
  "video essays": {
    topic: "Video Essays & Cultural Commentary",
    saturationScore: "Low (High Opportunity)",
    saturationColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    underservedQuestions: [
      "Why do modern TV shows look so dark and desaturated even on high-end OLED displays?",
      "How did algorithmic recommendation feeds dismantle regional music and youth subcultures?",
      "What psychological mechanisms explain the sudden revival of early 2000s physical media?"
    ],
    recommendedAngle: "Investigative documentary forensic analysis tracing aesthetic decline to corporate cost-cutting.",
    engineeredTitle: "The Lighting Conspiracy: Why Modern Movies Look Pitch Black",
    thumbnailBrief: "Side-by-side movie still comparison: bright saturated 1999 frame vs pitch-black 2025 shot; magnifying glass over shadows."
  }
}

export function ContentGapFinder() {
  const [searchTerm, setSearchTerm] = useState<string>("ai coding")
  const [copied, setCopied] = useState<boolean>(false)

  const activeResult: GapResult = useMemo(() => {
    const key = Object.keys(PRESET_TOPICS).find((k) =>
      searchTerm.toLowerCase().includes(k)
    )
    if (key && PRESET_TOPICS[key]) {
      return PRESET_TOPICS[key]
    }

    // Dynamic generation fallback for any custom user input
    return {
      topic: searchTerm.trim() || "Your Niche Topic",
      saturationScore: "Moderate",
      saturationColor: "text-amber-700 bg-amber-50 border-amber-200",
      underservedQuestions: [
        `What are the most common real-world failure points that beginner guides on ${searchTerm} gloss over?`,
        `How do experienced professionals actually benchmark ROI when implementing ${searchTerm}?`,
        `What are the unspoken contrarian truths about ${searchTerm} that mainstream creators avoid saying?`
      ],
      recommendedAngle: `Avoid broad beginner summaries. Deliver an empirical, data-backed case study that directly answers the unaddressed failure modes of ${searchTerm}.`,
      engineeredTitle: `Why 90% of Advice on ${searchTerm.slice(0, 25)} is Completely Wrong`,
      thumbnailBrief: `High-contrast split composition; left side shows conventional popular myth crossed out in red; right side shows raw benchmark spreadsheet with green checkmark.`
    }
  }, [searchTerm])

  const copyBrief = () => {
    const text = `TOPIC: ${activeResult.topic}\nWHITESPACE TITLE: ${activeResult.engineeredTitle}\nTHUMBNAIL BRIEF: ${activeResult.thumbnailBrief}\nUNDERSERVED QUESTIONS:\n- ${activeResult.underservedQuestions.join("\n- ")}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Tool Container */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Search & Topic Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
            <label htmlFor="topic-input">Enter Your Topic, Niche, or Channel Focus</label>
            <span className="font-mono text-neutral-400 text-[11px]">Real-time whitespace mapping</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="topic-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. AI Coding, Personal Finance, Fitness, Video Essays..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-300 bg-white text-sm font-medium text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-2xs"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1">
            <span className="text-[11px] text-neutral-500 font-mono shrink-0">Sample Niches:</span>
            {Object.entries(PRESET_TOPICS).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSearchTerm(key)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
                  searchTerm === key
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                {item.topic}
              </button>
            ))}
          </div>
        </div>

        {/* Content Gap Results Diagnostic Card */}
        <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                [ NICHE SATURATION AUDIT ]
              </span>
              <h3 className="text-lg font-bold text-neutral-950">{activeResult.topic}</h3>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${activeResult.saturationColor}`}>
              Market Saturation: {activeResult.saturationScore}
            </div>
          </div>

          {/* Underserved Audience Questions */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-red-600" />
              <span>Underserved Viewer Questions (High Demand, Low Supply)</span>
            </div>
            <p className="text-xs text-neutral-500">
              Questions frequently asked in YouTube comment sections that existing top-ranking videos fail to resolve:
            </p>
            <div className="space-y-2">
              {activeResult.underservedQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-neutral-200 text-xs font-medium text-neutral-800 flex items-start gap-2.5 shadow-2xs"
                >
                  <span className="font-mono text-red-600 font-bold text-[11px] mt-0.5">0{idx + 1}.</span>
                  <span className="leading-relaxed">{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Whitespace Packaging Angle */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Recommended Breakthrough Angle</span>
            </div>
            <p className="text-xs text-neutral-700 bg-white p-4 rounded-xl border border-neutral-200 leading-relaxed font-normal">
              {activeResult.recommendedAngle}
            </p>
          </div>

          {/* Engineered High-CTR Video Concept */}
          <div className="p-5 rounded-2xl bg-white border border-red-200/80 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">
                [ PACKAGING BLUEPRINT FOR THIS GAP ]
              </span>
              <button
                type="button"
                onClick={copyBrief}
                className="inline-flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-red-600 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Concept</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <div className="text-[11px] font-mono text-neutral-400">ENGINEERED TITLE:</div>
              <div className="text-sm font-bold text-neutral-950 mt-0.5">&quot;{activeResult.engineeredTitle}&quot;</div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-neutral-400">THUMBNAIL VISUAL DIRECTION:</div>
              <div className="text-xs text-neutral-600 mt-0.5 leading-relaxed">{activeResult.thumbnailBrief}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
