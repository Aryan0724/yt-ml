"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Upload,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Monitor,
  Eye,
  RefreshCw,
  Trophy
} from "lucide-react"

const DEFAULT_VARIANTS = [
  {
    name: "Variant A (High Contrast)",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1280&q=80",
    contrastScore: 88,
    safeZoneRisk: "Safe",
    estCtr: "8.6%",
    pros: "Strong rim lighting separates subject from background; safe zone is completely unobstructed."
  },
  {
    name: "Variant B (Cluttered Text)",
    url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1280&q=80",
    contrastScore: 68,
    safeZoneRisk: "Moderate",
    estCtr: "6.2%",
    pros: "Warm aesthetic, but small text will be illegible on smartphone feeds."
  }
]

export function ThumbnailTester() {
  const [variantA, setVariantA] = useState(DEFAULT_VARIANTS[0])
  const [variantB, setVariantB] = useState(DEFAULT_VARIANTS[1])
  const [title, setTitle] = useState("Why Apple's M4 Chip Terrifies Intel & AMD (Hardware Deep Dive)")
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile")

  const handleUploadA = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVariantA({
        ...variantA,
        url: URL.createObjectURL(file),
        name: "Custom Variant A"
      })
    }
  }

  const handleUploadB = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVariantB({
        ...variantB,
        url: URL.createObjectURL(file),
        name: "Custom Variant B"
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Tool Container */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Title Input & Feed Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div className="flex-1 max-w-xl space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Video Title for Feed Simulation</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xs text-neutral-500 font-mono">View Mode:</span>
            <button
              type="button"
              onClick={() => setDeviceMode("mobile")}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                deviceMode === "mobile"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Feed</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                deviceMode === "desktop"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop Feed</span>
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Variant A */}
          <div className="space-y-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-red-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  A
                </span>
                <span className="font-bold text-sm text-neutral-950">{variantA.name}</span>
              </div>
              <label className="cursor-pointer text-[11px] font-bold text-red-600 hover:text-red-700 transition-colors">
                <span>Upload Replacement</span>
                <input type="file" accept="image/*" onChange={handleUploadA} className="hidden" />
              </label>
            </div>

            {/* Thumbnail Canvas */}
            <div className="relative rounded-xl overflow-hidden aspect-video border border-neutral-300 bg-neutral-900 shadow-xs">
              <img src={variantA.url} alt="Variant A" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[10px] font-bold">
                12:45
              </div>
            </div>

            {/* Simulated Title Underneath */}
            <div className="text-xs font-bold text-neutral-900 line-clamp-2">
              {title}
            </div>

            {/* Diagnostic Metrics */}
            <div className="pt-3 border-t border-neutral-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Contrast Score:</span>
                <span className="font-mono font-bold text-neutral-900">{variantA.contrastScore}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Timestamp Safe Area:</span>
                <span className="font-mono font-bold text-emerald-600">{variantA.safeZoneRisk}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Estimated Browse CTR:</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">{variantA.estCtr}</span>
              </div>
              <p className="text-[11px] text-neutral-600 pt-1 leading-relaxed">
                {variantA.pros}
              </p>
            </div>
          </div>

          {/* Variant B */}
          <div className="space-y-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-neutral-800 text-white font-mono font-bold text-xs flex items-center justify-center">
                  B
                </span>
                <span className="font-bold text-sm text-neutral-950">{variantB.name}</span>
              </div>
              <label className="cursor-pointer text-[11px] font-bold text-red-600 hover:text-red-700 transition-colors">
                <span>Upload Replacement</span>
                <input type="file" accept="image/*" onChange={handleUploadB} className="hidden" />
              </label>
            </div>

            {/* Thumbnail Canvas */}
            <div className="relative rounded-xl overflow-hidden aspect-video border border-neutral-300 bg-neutral-900 shadow-xs">
              <img src={variantB.url} alt="Variant B" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[10px] font-bold">
                12:45
              </div>
            </div>

            {/* Simulated Title Underneath */}
            <div className="text-xs font-bold text-neutral-900 line-clamp-2">
              {title}
            </div>

            {/* Diagnostic Metrics */}
            <div className="pt-3 border-t border-neutral-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Contrast Score:</span>
                <span className="font-mono font-bold text-neutral-900">{variantB.contrastScore}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Timestamp Safe Area:</span>
                <span className="font-mono font-bold text-amber-600">{variantB.safeZoneRisk}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Estimated Browse CTR:</span>
                <span className="font-mono font-bold text-neutral-700 text-sm">{variantB.estCtr}</span>
              </div>
              <p className="text-[11px] text-neutral-600 pt-1 leading-relaxed">
                {variantB.pros}
              </p>
            </div>
          </div>
        </div>

        {/* Comparative Diagnostic Verdict */}
        <div className="p-6 rounded-2xl bg-neutral-950 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 text-xs font-bold font-mono">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>DIAGNOSTIC WINNER: VARIANT A (+38% PREDICTED CTR)</span>
            </div>
            <p className="text-xs text-neutral-400 max-w-xl">
              Variant A delivers superior mobile glanceability and subject isolation. When scaled to a 120px smartphone screen, Variant A's focal contrast registers 2.4× faster than Variant B.
            </p>
          </div>
          <Link
            href="/tools/youtube-feed-preview"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            Test in Live Feed Simulator <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
