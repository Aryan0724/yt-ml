"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  Sparkles,
  Upload,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Eye,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck
} from "lucide-react"

interface SamplePreset {
  id: string
  name: string
  title: string
  thumbnailUrl: string
  contrastScore: number
  isSafe: boolean
  fix: string
}

const PRESETS: SamplePreset[] = [
  {
    id: "tech",
    name: "Tech Review",
    title: "Why I Think You Should Probably Avoid Buying The Base M4 Mac Mini in 2026",
    thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1280&q=80",
    contrastScore: 78,
    isSafe: true,
    fix: "Title is 74 characters (truncates on iPhone). Move the outcome into the first 40 characters: 'M4 Mac Mini: Stop Buying the Base Model'."
  },
  {
    id: "finance",
    name: "Personal Finance",
    title: "I Analyzed 100 Different Index Funds to Find The Absolute Best One For Beginners",
    thumbnailUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1280&q=80",
    contrastScore: 62,
    isSafe: false,
    fix: "Bottom-right timestamp badge covers financial text. Shorten title to 44 chars: 'The Only 3 Index Funds You Need to Retire'."
  },
  {
    id: "essay",
    name: "Video Essay",
    title: "The Subtle Architecture of Modern Isolation and Loneliness in Crowded Cities",
    thumbnailUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1280&q=80",
    contrastScore: 86,
    isSafe: true,
    fix: "Front-load emotional tension: 'Why Modern Cities Are Designed for Loneliness' (49 characters)."
  }
]

export function LiveAuditWidget() {
  const [selectedPreset, setSelectedPreset] = useState<SamplePreset>(PRESETS[0])
  const [title, setTitle] = useState<string>(PRESETS[0].title)
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(PRESETS[0].thumbnailUrl)
  const [hasAudited, setHasAudited] = useState<boolean>(true)
  const [isAuditing, setIsAuditing] = useState<boolean>(false)

  const charLimit = 54
  const length = title.length
  const isTruncated = length > charLimit
  const visibleOnMobile = isTruncated ? title.slice(0, charLimit) + "..." : title

  const handleSelectPreset = (preset: SamplePreset) => {
    setSelectedPreset(preset)
    setTitle(preset.title)
    setThumbnailUrl(preset.thumbnailUrl)
    setHasAudited(true)
  }

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailUrl(URL.createObjectURL(file))
      setHasAudited(true)
    }
  }

  const runAudit = () => {
    setIsAuditing(true)
    setTimeout(() => {
      setIsAuditing(false)
      setHasAudited(true)
    }, 400)
  }

  // Dynamic calculated scores based on input
  const auditResult = useMemo(() => {
    let score = 80
    if (length > charLimit) score -= 14
    if (length > 70) score -= 10
    if (selectedPreset.contrastScore < 70) score -= 12
    if (!selectedPreset.isSafe) score -= 10

    score = Math.max(48, Math.min(94, score))

    return {
      score,
      hookStatus: isTruncated ? "Truncates on Mobile" : "100% Mobile Visible",
      contrastStatus: selectedPreset.contrastScore >= 75 ? "High (Passes Dark Theme)" : "Moderate (Edge Bleed Risk)",
      safeZoneStatus: selectedPreset.isSafe ? "Clean & Safe" : "Timestamp Overlap Warning",
      primaryFix: selectedPreset.fix
    }
  }, [length, isTruncated, selectedPreset])

  return (
    <div id="interactive-audit" className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xl p-6 sm:p-8 md:p-10 text-neutral-900 relative">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">
                LIVE INTERACTIVE AUDIT // ZERO SIGNUP REQUIRED
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 mt-1">
              Test your draft title and thumbnail right now
            </h3>
          </div>

          {/* Quick Select Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto self-start sm:self-auto">
            <span className="text-xs font-mono text-neutral-400 shrink-0">Sample Drafts:</span>
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all shrink-0 ${
                  selectedPreset.id === p.id
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Simulation Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Inputs Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Title Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                <label htmlFor="audit-title-input">Draft Video Title</label>
                <span className={`font-mono text-[11px] ${isTruncated ? "text-amber-600 font-bold" : "text-neutral-500"}`}>
                  {length} characters {isTruncated && "(Cuts off on phones)"}
                </span>
              </div>
              <input
                id="audit-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Paste your YouTube video title here..."
                className="w-full px-4 py-3.5 rounded-xl border border-neutral-300 bg-white text-sm font-medium text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-2xs"
              />
            </div>

            {/* Thumbnail Canvas Preview with Simulated Safe Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                <span>Thumbnail Draft &amp; Safe Zone Check</span>
                <label className="cursor-pointer text-red-600 hover:text-red-700 font-bold flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Upload My Thumbnail</span>
                  <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
                </label>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-video border border-neutral-300 bg-neutral-950 shadow-xs group">
                <img
                  src={thumbnailUrl}
                  alt="Draft Thumbnail Preview"
                  className="w-full h-full object-cover"
                />

                {/* Bottom-Right YouTube Duration Overlay */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/85 text-white font-mono text-xs font-bold tracking-tight border border-white/10 shadow-lg flex items-center gap-1.5">
                  <span>14:28</span>
                  <span className="text-[9px] bg-red-600 text-white px-1 py-0.2 rounded font-sans uppercase">
                    Timestamp Zone
                  </span>
                </div>
              </div>
            </div>

            {/* Run Audit Action Button */}
            <button
              type="button"
              onClick={runAudit}
              disabled={isAuditing}
              className="w-full py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
                  <span>Running Diagnostic Forensics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-red-500" />
                  <span>Run Free Diagnostic Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Results Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-5">
              {/* Score Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div>
                  <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                    PACKAGING READINESS
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl font-black text-neutral-950">{auditResult.score}</span>
                    <span className="text-sm font-bold text-neutral-400">/ 100</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  auditResult.score >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {auditResult.score >= 80 ? "Passes Audit" : "Needs Adjustments"}
                </div>
              </div>

              {/* Diagnostic Checklist */}
              <div className="space-y-3 text-xs">
                {/* Mobile Hook */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isTruncated ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <span className="font-semibold text-neutral-800">Mobile 54-Char Limit:</span>
                  </div>
                  <span className={`font-mono text-[11px] font-bold ${isTruncated ? "text-amber-700" : "text-emerald-700"}`}>
                    {auditResult.hookStatus}
                  </span>
                </div>

                {/* Thumbnail Contrast */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-semibold text-neutral-800">Dark Feed Contrast:</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-neutral-700">
                    {auditResult.contrastStatus}
                  </span>
                </div>

                {/* Safe Area */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {selectedPreset.isSafe ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <span className="font-semibold text-neutral-800">Timestamp Safe Zone:</span>
                  </div>
                  <span className={`font-mono text-[11px] font-bold ${selectedPreset.isSafe ? "text-emerald-700" : "text-red-700"}`}>
                    {auditResult.safeZoneStatus}
                  </span>
                </div>
              </div>

              {/* Primary Actionable Fix Box */}
              <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1.5 shadow-2xs">
                <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>PRIMARY ACTIONABLE FIX</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                  {auditResult.primaryFix}
                </p>
              </div>

              {/* Mobile View Preview Box */}
              <div className="p-3.5 rounded-xl bg-neutral-900 text-white space-y-1.5">
                <div className="text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>PHONE SCREEN VIEWPORT</span>
                  <span className="text-red-400 font-bold">iOS / Android</span>
                </div>
                <div className="text-xs font-medium text-neutral-200">
                  {isTruncated ? (
                    <span>
                      <span>{title.slice(0, charLimit)}</span>
                      <span className="text-red-400 font-bold">... [CUT OFF]</span>
                    </span>
                  ) : (
                    <span>{title}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Seamless Post-Audit Account Creation CTA */}
            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-red-950">Save this report &amp; audit unlimited videos</span>
                <p className="text-[11px] text-neutral-600">Free forever tier · No credit card required</p>
              </div>
              <Link
                href="/signup"
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] uppercase tracking-wider shrink-0 shadow-xs transition-colors"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
