"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Download,
  Share2,
  Sparkles,
  Smartphone,
  Eye,
  Sliders
} from "lucide-react"

export function SampleReport() {
  const [activeTab, setActiveTab] = useState<"summary" | "mobile" | "contrast" | "curiosity">("summary")

  return (
    <section className="py-20 md:py-24 bg-neutral-50/70 border-b border-neutral-200" id="sample-report">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-mono font-bold tracking-wider uppercase border border-red-200/60">
              <FileText className="w-3.5 h-3.5" />
              <span>ACTUAL AUDIT OUTPUT // NUANCED DIAGNOSIS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.12]">
              See what a PreYT audit <br />
              <span className="text-red-600">actually looks like.</span>
            </h2>

            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
              No black-box mystery scores. Every evaluation includes a plain-English explanation, visual evidence, and the exact adjustments needed before you press record.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              <span>Run My Own Free Audit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Realistic Report Showcase Container */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
          {/* Report Top Meta Bar */}
          <div className="p-6 sm:p-8 bg-neutral-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span>AUDIT REF: #PR-84920</span>
                <span>·</span>
                <span>STATUS: COMPLETE</span>
                <span>·</span>
                <span className="text-emerald-400 font-bold">READY FOR REVIEW</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Packaging Audit: &quot;Why Apple's M4 Chip Terrifies Intel &amp; AMD&quot;
              </h3>
            </div>

            <div className="flex items-center gap-4 self-start md:self-auto">
              <div className="text-right">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">OVERALL READINESS</div>
                <div className="text-2xl font-black font-mono text-white">76 <span className="text-xs text-neutral-400">/ 100</span></div>
              </div>
              <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                2 Critical Fixes
              </div>
            </div>
          </div>

          {/* Report Tab Switcher */}
          <div className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-neutral-100/70 border-b border-neutral-200 overflow-x-auto text-xs font-semibold text-neutral-600">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeTab === "summary" ? "bg-white text-neutral-950 shadow-2xs font-bold" : "hover:text-neutral-950"
              }`}
            >
              Executive Summary
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mobile")}
              className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeTab === "mobile" ? "bg-white text-neutral-950 shadow-2xs font-bold" : "hover:text-neutral-950"
              }`}
            >
              Mobile Viewport Cutoff (54 Chars)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("contrast")}
              className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeTab === "contrast" ? "bg-white text-neutral-950 shadow-2xs font-bold" : "hover:text-neutral-950"
              }`}
            >
              Dark Theme Contrast Forensics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("curiosity")}
              className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeTab === "curiosity" ? "bg-white text-neutral-950 shadow-2xs font-bold" : "hover:text-neutral-950"
              }`}
            >
              Curiosity &amp; Hook Tension
            </button>
          </div>

          {/* Report Body Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Nuanced Findings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Finding 1 */}
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">TITLE VIEWABILITY</span>
                  <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold">
                    Truncates
                  </span>
                </div>
                <div className="text-sm font-bold text-neutral-950">
                  Length: 62 characters
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  Cuts off at character 52 on iPhone 15 feeds. The word &quot;AMD&quot; and the subtitle are invisible behind the ellipsis.
                </p>
                <div className="pt-2 border-t border-neutral-200 text-[11px] font-mono text-red-600 font-bold">
                  Fix: Shorten to 44 chars before filming.
                </div>
              </div>

              {/* Finding 2 */}
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">EDGE SEPARATION</span>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                    Passes (5.2:1)
                  </span>
                </div>
                <div className="text-sm font-bold text-neutral-950">
                  Contrast: 5.2:1 (Target: &gt;= 4.5:1)
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  Gold die lighting creates strong foreground isolation against black backdrop. Retains clear bounding box on Dark Theme.
                </p>
                <div className="pt-2 border-t border-neutral-200 text-[11px] font-mono text-emerald-600 font-bold">
                  Status: Approved for production.
                </div>
              </div>

              {/* Finding 3 */}
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">TIMESTAMP SAFETY</span>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                    100% Unobstructed
                  </span>
                </div>
                <div className="text-sm font-bold text-neutral-950">
                  Bottom-Right Zone: Clear
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  No text, logos, or chip schematics placed in the lower-right 20% danger quadrant. Duration badge will not obscure key assets.
                </p>
                <div className="pt-2 border-t border-neutral-200 text-[11px] font-mono text-emerald-600 font-bold">
                  Status: Safe from badge occlusion.
                </div>
              </div>
            </div>

            {/* Prescribed Exact Before/After Fix */}
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-600" />
                  <h4 className="text-sm font-bold text-neutral-950">
                    Recommended Publishing Adjustments
                  </h4>
                </div>
                <span className="text-xs font-mono text-neutral-400">Predicted CTR Lift: +1.8% to +2.4%</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1">
                  <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase">CURRENT TITLE DRAFT:</div>
                  <div className="text-xs font-medium text-neutral-800 line-through">
                    &quot;Why Apple's M4 Chip Terrifies Intel &amp; AMD (Hardware Deep Dive)&quot;
                  </div>
                  <div className="text-[11px] text-amber-600 pt-1">
                    Cuts off on mobile at: &quot;Why Apple's M4 Chip Terrifies Intel &amp;...&quot;
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <div className="text-[10px] font-mono font-bold text-emerald-700 uppercase">RECOMMENDED TITLE FIX:</div>
                  <div className="text-xs font-bold text-neutral-950">
                    &quot;Why Apple's M4 Chip Terrifies Intel&quot;
                  </div>
                  <div className="text-[11px] text-emerald-700 pt-1">
                    38 characters · 100% visible on all smartphones · Clean curiosity gap
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
