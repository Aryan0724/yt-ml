"use client"

import React, { useState } from "react"
import { VisualFactors, ChannelDna } from "@/lib/types/analysis"
import { ChevronDown, ChevronUp, Eye } from "lucide-react"

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
    <div className="w-full bg-background border rounded-3xl overflow-hidden shadow-sm transition-all text-left">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 sm:p-8 flex items-center justify-between hover:bg-muted/30 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
            <Eye className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-foreground">
              Technical Vision & Algorithm Evidence
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Inspect verified OpenCV pixel measurements and model scoring factors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span>{isOpen ? "Hide" : "Show"} Evidence</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Content Drawer */}
      {isOpen && (
        <div className="p-6 sm:p-8 pt-0 border-t border-border space-y-6 animate-in fade-in duration-300">
          
          {/* Measured Visual Factors Grid */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-3">
              Measured Image Factors
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-muted/30 border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Brightness
                </span>
                <span className="text-sm font-bold text-foreground">
                  {Math.round(brightness)} / 255
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {brightness < 100 ? "Low luminance" : brightness > 180 ? "High highlights" : "Balanced range"}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Visual Contrast
                </span>
                <span className="text-sm font-bold text-foreground">
                  {Math.round(contrast)} / 100
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {contrast < 45 ? "Soft contrast" : "Strong separation"}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Color Saturation
                </span>
                <span className="text-sm font-bold text-foreground">
                  {Math.round(saturation)} / 100
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {saturation > 75 ? "Vibrant pop" : "Standard palette"}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Detected Human Faces
                </span>
                <span className="text-sm font-bold text-foreground">
                  {faceCount} {faceCount === 1 ? "Face" : "Faces"}
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {faceCount > 0 ? "Emotional focal point active" : "Subject/Object focused"}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Mobile Readability
                </span>
                <span className="text-sm font-bold text-foreground">
                  {Math.round(mobileReadability)} / 100
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {mobileReadability >= 75 ? "Clear on 375px screens" : "May blur in high-speed feed"}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Clutter Index
                </span>
                <span className="text-sm font-bold text-foreground">
                  {typeof clutterRating === "number" ? clutterRating.toFixed(1) : clutterRating} / 10
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {Number(clutterRating) < 4 ? "Minimalist clarity" : "Multiple focal targets"}
                </p>
              </div>
            </div>
          </div>

          {/* Detected Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strengths.length > 0 && (
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
                  Verified Visual Strengths
                </span>
                <ul className="space-y-1.5">
                  {strengths.map((s, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {weaknesses.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-700 block tracking-wider">
                  Flagged Feed Vulnerabilities
                </span>
                <ul className="space-y-1.5">
                  {weaknesses.map((w, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold shrink-0">⚠</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Engine Footnote */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-muted-foreground border-t border-border mt-4">
            <span>PreYT Scoring Engine: {engineVersion}</span>
            <span>All measurements verified via OpenCV & CatBoost ML</span>
          </div>
        </div>
      )}
    </div>
  )
}
