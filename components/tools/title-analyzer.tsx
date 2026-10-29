"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Type,
  Smartphone,
  Eye,
  Sliders
} from "lucide-react"

const SAMPLE_TITLES = [
  "Why Most Programmers Are Getting Replaced in 2026",
  "I Built a $10M SaaS Business With 0 Employees (Full Breakdown)",
  "Stop Buying OLED Monitors Until You Watch This Video",
  "The Hidden YouTube Algorithm Update Nobody Noticed"
]

const POWER_WORDS = [
  "why", "how", "stop", "never", "secret", "exposed", "truth", "ruined", "mistake",
  "shocking", "million", "ultimate", "broken", "fixed", "trap", "hidden", "nobody",
  "warning", "finally", "fast", "insane", "rules", "formula", "blueprint"
]

export function TitleAnalyzer() {
  const [title, setTitle] = useState<string>(SAMPLE_TITLES[0])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const charLimit = 54
  const length = title.length
  const words = title.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length

  const isTruncated = length > charLimit
  const mobileVisible = isTruncated ? title.slice(0, charLimit) + "..." : title

  // Power words found
  const foundPowerWords = useMemo(() => {
    const lower = title.toLowerCase()
    return POWER_WORDS.filter((word) => lower.includes(word))
  }, [title])

  const hasNumbers = /\d+/.test(title)
  const hasParentheses = /\(.*?\)|\[.*?\]/.test(title)
  const hasQuestion = /\?/.test(title)

  // Calculate score
  const scoreData = useMemo(() => {
    let score = 50

    // Length scoring
    if (length >= 35 && length <= 54) {
      score += 20 // Sweet spot
    } else if (length > 54 && length <= 70) {
      score += 10
    } else if (length > 70) {
      score -= 10
    } else if (length < 25) {
      score -= 5
    }

    // Power words scoring
    if (foundPowerWords.length >= 2) {
      score += 15
    } else if (foundPowerWords.length === 1) {
      score += 10
    }

    // Specific numbers bonus
    if (hasNumbers) score += 10

    // Curiosity / stakes bonus
    if (hasParentheses) score += 5

    score = Math.min(98, Math.max(35, score))

    const grade = score >= 85 ? "Excellent" : score >= 70 ? "Good" : "Needs Optimization"

    return { score, grade }
  }, [length, foundPowerWords, hasNumbers, hasParentheses])

  // Suggested Hook Variations
  const suggestions = useMemo(() => {
    const cleanSubject = words.slice(0, 4).join(" ") || "Your Subject"
    return [
      {
        formula: "The Counter-Intuitive Truth",
        text: `Why ${cleanSubject} is Actually Failing in 2026`,
        hookType: "Curiosity Gap"
      },
      {
        formula: "The Warning Archetype",
        text: `Stop Ignoring ${cleanSubject} (Before It's Too Late)`,
        hookType: "High Stakes"
      },
      {
        formula: "The Specific Breakdown",
        text: `I Analyzed ${cleanSubject} for 30 Days (Here's What Happened)`,
        hookType: "Empirical Proof"
      },
      {
        formula: "The Direct Revelation",
        text: `The Truth About ${cleanSubject} Nobody Wants to Admit`,
        hookType: "Contrarian Loop"
      }
    ]
  }, [words])

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Interactive Tool Container */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Sample Title Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs text-neutral-500 font-mono shrink-0">Try Examples:</span>
          {SAMPLE_TITLES.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTitle(t)}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all shrink-0 max-w-xs truncate"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Title Input Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
            <label htmlFor="title-input">Enter Your Draft YouTube Video Title</label>
            <span className={`font-mono text-[11px] ${isTruncated ? "text-amber-600 font-bold" : "text-neutral-500"}`}>
              {length} / 100 characters · {wordCount} words
            </span>
          </div>
          <div className="relative">
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Why Most Programmers Are Getting Replaced in 2026..."
              className="w-full px-4 py-3.5 rounded-xl border border-neutral-300 bg-white text-sm font-medium text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Mobile Cutoff Visualization */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
              <Smartphone className="w-4 h-4 text-neutral-500" />
              <span>Simulated Mobile Feed Cutoff (First 54 Characters)</span>
            </div>
            {isTruncated ? (
              <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                TRUNCATED BY {length - charLimit} CHARACTERS
              </span>
            ) : (
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                100% VISIBLE ON MOBILE
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-neutral-200 font-medium text-xs sm:text-sm text-neutral-900 leading-snug">
            {isTruncated ? (
              <span>
                <span className="text-neutral-900 font-bold">{title.slice(0, charLimit)}</span>
                <span className="text-red-500 font-mono font-bold">... [HIDDEN] </span>
                <span className="text-neutral-400 line-through text-xs">{title.slice(charLimit)}</span>
              </span>
            ) : (
              <span className="text-neutral-900 font-semibold">{title}</span>
            )}
          </div>
          <p className="text-[11px] text-neutral-500">
            72% of YouTube impressions appear on mobile devices. Ensure your main curiosity gap or punchline is established before character 54.
          </p>
        </div>

        {/* Diagnostics & Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Main Score */}
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">
                TITLE CLICK POTENTIAL
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-neutral-950">{scoreData.score}</span>
                <span className="text-sm font-bold text-neutral-500">/ 100</span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-center ${
              scoreData.score >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}>
              {scoreData.grade}
            </div>
          </div>

          {/* Checklist */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="text-xs font-bold text-neutral-900">Algorithmic Heuristics Checklist</div>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                {length <= 54 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span className="text-neutral-700">Mobile Truncation: {length <= 54 ? "Safe" : "Exceeds 54 chars"}</span>
              </div>

              <div className="flex items-center gap-2">
                {foundPowerWords.length > 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span className="text-neutral-700">
                  Power Words: {foundPowerWords.length > 0 ? foundPowerWords.join(", ") : "None detected"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasNumbers ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-neutral-300 shrink-0" />
                )}
                <span className="text-neutral-700">Specific Numbers: {hasNumbers ? "Included" : "None (+10% CTR boost)"}</span>
              </div>

              <div className="flex items-center gap-2">
                {hasParentheses ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-neutral-300 shrink-0" />
                )}
                <span className="text-neutral-700">Clarifier Tag: {hasParentheses ? "Present" : "Optional (e.g. [Full Guide])"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative High-CTR Hook Formulations */}
        <div className="pt-4 border-t border-neutral-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span>One-Click High-CTR Title Alternatives</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Generated using proven curiosity gap formulas from top-performing YouTube uploads.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {suggestions.map((sug, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase">
                    <span>{sug.formula}</span>
                    <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded font-bold">{sug.hookType}</span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-900 leading-snug">
                    {sug.text}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <span className="text-[11px] font-mono text-neutral-500">{sug.text.length} chars</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(sug.text, idx)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-700 hover:text-red-600 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Title</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
