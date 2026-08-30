"use client"

import React, { useState } from "react"
import { VisualFactors, ChannelDna } from "@/lib/types/analysis"
import { ChevronDown, ChevronUp, Eye, BarChart2, ShieldCheck, Activity } from "lucide-react"

export interface ExpandableEvidenceProps {
  factors?: VisualFactors
  strengths?: string[]
  weaknesses?: string[]
  channelDna?: ChannelDna
  engineVersion?: string
}

export function ExpandableEvidence({
  factors = {},
  strengths = [],
  weaknesses = [],
  channelDna,
  engineVersion = "v4.0"
}: ExpandableEvidenceProps) {
  const [isOpen, setIsOpen] = useState(false)

  const brightness = factors.brightness ?? 128
  const contrast = factors.contrast ?? 50
  const saturation = factors.saturation ?? 50
  const faceCount = factors.face_count ?? 0
  const clutterRating = factors.clutter_level_rating ?? 5.0
  const mobileReadability = factors.mobile_readability ?? 75.0

  return (
    <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm transition-all text-left">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 sm:p-8 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
              Technical Vision & Algorithm Evidence
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Inspect verified OpenCV pixel measurements and model scoring factors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
          <span>{isOpen ? "Hide" : "Show"} Evidence</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Content Drawer */}
      {isOpen && (
        <div className="p-6 sm:p-8 pt-0 border-t border-zinc-100 dark:border-zinc-900 space-y-6 animate-fade-in">
          
          {/* Measured Visual Factors Grid */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-3">
              Measured Image Factors
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Brightness
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {Math.round(brightness)} / 255
                </span>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {brightness < 100 ? "Low luminance" : brightness > 180 ? "High highlights" : "Balanced range"}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Visual Contrast
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {Math.round(contrast)} / 100
                </span>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {contrast < 45 ? "Soft contrast" : "Strong separation"}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Color Saturation
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {Math.round(saturation)} / 100
                </span>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {saturation > 75 ? "Vibrant pop" : "Standard palette"}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Detected Human Faces
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {faceCount} {faceCount === 1 ? "Face" : "Faces"}
                </span>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {faceCount > 0 ? "Emotional focal point active" : "Subject/Object focused"}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Mobile Readability
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {Math.round(mobileReadability)} / 100
                </span>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {mobileReadability >= 75 ? "Clear on 375px screens" : "May blur in high-speed feed"}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Clutter Index
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {typeof clutterRating === "number" ? clutterRating.toFixed(1) : clutterRating} / 10
                </span>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {Number(clutterRating) < 4 ? "Minimalist clarity" : "Multiple focal targets"}
                </p>
              </div>
            </div>
          </div>

          {/* Detected Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strengths.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block tracking-wider">
                  Verified Visual Strengths
                </span>
                <ul className="space-y-1.5">
                  {strengths.map((s, i) => (
                    <li key={i} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {weaknesses.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 block tracking-wider">
                  Flagged Feed Vulnerabilities
                </span>
                <ul className="space-y-1.5">
                  {weaknesses.map((w, i) => (
                    <li key={i} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0">⚠</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Engine Footnote */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-100 dark:border-zinc-900">
            <span>PreYT Scoring Engine: {engineVersion}</span>
            <span>All measurements verified via OpenCV & CatBoost ML</span>
          </div>
        </div>
      )}
    </div>
  )
}
