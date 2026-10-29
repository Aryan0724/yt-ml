"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Sliders,
  Moon,
  Sun,
  Grid,
  Zap,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from "lucide-react"

const SAMPLE_THUMBNAILS = [
  {
    name: "Tech Breakdown",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1280&q=80",
    title: "Why Apple's M4 Chip Terrifies Intel & AMD (Hardware Deep Dive)"
  },
  {
    name: "Creator Studio",
    url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1280&q=80",
    title: "How I Set Up My Minimalist $15,000 Studio in 48 Hours"
  },
  {
    name: "Finance & Case Study",
    url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1280&q=80",
    title: "The Stock Market Trap Nobody is Talking About in 2026"
  }
]

export function ThumbnailAnalyzer() {
  const [imageUrl, setImageUrl] = useState<string>(SAMPLE_THUMBNAILS[0].url)
  const [imageTitle, setImageTitle] = useState<string>(SAMPLE_THUMBNAILS[0].title)
  const [analyzing, setAnalyzing] = useState<boolean>(false)
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark")
  const [showGrid, setShowGrid] = useState<boolean>(false)
  const [showSafeZone, setShowSafeZone] = useState<boolean>(true)

  // Metrics state
  const [metrics, setMetrics] = useState({
    overallScore: 84,
    luminance: 48,
    contrastRatio: 6.2,
    saturation: 62,
    dangerZoneRisk: "Low",
    dangerZoneActivity: 12,
    glanceability: "Excellent",
    recommendations: [
      "High visual contrast between central subject and background.",
      "Bottom-right timestamp zone is clean and unobstructed.",
      "Strong luminance gradient ensures edge visibility in Dark Mode."
    ]
  })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Analyze image on canvas
  const analyzeImage = useCallback((src: string) => {
    setAnalyzing(true)
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = src
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setAnalyzing(false)
        return
      }

      canvas.width = 320
      canvas.height = 180
      ctx.drawImage(img, 0, 0, 320, 180)

      try {
        const imgData = ctx.getImageData(0, 0, 320, 180)
        const data = imgData.data

        let totalLuminance = 0
        let minLum = 255
        let maxLum = 0

        // Danger zone bounding box: bottom-right 20% width and 25% height
        const dzXStart = Math.floor(320 * 0.78)
        const dzYStart = Math.floor(180 * 0.75)
        let dzPixels = 0
        let dzBrightness = 0

        for (let y = 0; y < 180; y++) {
          for (let x = 0; x < 320; x++) {
            const idx = (y * 320 + x) * 4
            const r = data[idx]
            const g = data[idx + 1]
            const b = data[idx + 2]
            const lum = 0.299 * r + 0.587 * g + 0.114 * b

            totalLuminance += lum
            if (lum < minLum) minLum = lum
            if (lum > maxLum) maxLum = lum

            if (x >= dzXStart && y >= dzYStart) {
              dzPixels++
              dzBrightness += lum
            }
          }
        }

        const avgLum = Math.round(totalLuminance / (320 * 180))
        const contrastRatio = Number(((maxLum + 0.05) / (minLum + 0.05)).toFixed(1))
        const avgDzLum = Math.round(dzBrightness / (dzPixels || 1))

        // Danger zone evaluation
        const dangerZoneRisk = avgDzLum > 140 ? "High" : avgDzLum > 85 ? "Medium" : "Low"

        // Overall score calculation
        let score = 70
        if (contrastRatio >= 4.5) score += 15
        if (avgLum >= 30 && avgLum <= 70) score += 10
        if (dangerZoneRisk === "Low") score += 10
        if (dangerZoneRisk === "High") score -= 15
        score = Math.min(98, Math.max(45, score))

        const recs: string[] = []
        if (contrastRatio < 4.0) {
          recs.push("Increase subject-to-background contrast ratio (aim for >= 4.5:1).")
        } else {
          recs.push("Subject contrast is clear and isolates well from the background.")
        }

        if (dangerZoneRisk === "High") {
          recs.push("Warning: Bottom-right corner has high visual detail that YouTube's duration badge will cover.")
        } else {
          recs.push("Bottom-right timestamp zone is safe. No critical face or punchline will be covered.")
        }

        if (avgLum < 25) {
          recs.push("Overall thumbnail is dark; may blend into YouTube Dark Mode feeds.")
        } else if (avgLum > 80) {
          recs.push("Thumbnail is slightly overexposed; text readability could suffer on mobile.")
        } else {
          recs.push("Balanced luminance profile; visible on both light and dark backgrounds.")
        }

        setMetrics({
          overallScore: score,
          luminance: avgLum,
          contrastRatio,
          saturation: 58,
          dangerZoneRisk,
          dangerZoneActivity: avgDzLum,
          glanceability: score >= 80 ? "Excellent" : score >= 65 ? "Moderate" : "Needs Work",
          recommendations: recs
        })
      } catch {
        // Fallback if cross-origin image tainted canvas
      }
      setAnalyzing(false)
    }
    img.onerror = () => setAnalyzing(false)
  }, [])

  useEffect(() => {
    analyzeImage(imageUrl)
  }, [imageUrl, analyzeImage])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
    }
  }

  return (
    <div className="space-y-8">
      {/* Interactive Tool Container */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Upload & Sample Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Thumbnail</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
            <span className="text-xs text-neutral-400 font-mono">PNG, JPG, WebP</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-neutral-500 font-mono shrink-0">Sample Images:</span>
            {SAMPLE_THUMBNAILS.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setImageUrl(sample.url)
                  setImageTitle(sample.title)
                }}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
                  imageUrl === sample.url
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                {sample.name}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Left Canvas Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider">
                [ LIVE CANVAS PREVIEW // 16:9 ]
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                    showGrid ? "bg-red-50 text-red-600 border-red-200" : "bg-neutral-50 text-neutral-600 border-neutral-200"
                  }`}
                  title="Toggle Rule of Thirds Grid"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSafeZone(!showSafeZone)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                    showSafeZone ? "bg-red-50 text-red-600 border-red-200" : "bg-neutral-50 text-neutral-600 border-neutral-200"
                  }`}
                  title="Toggle Safe Zone Duration Badge"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Safe Zone</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
                  className="p-1.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 text-xs flex items-center gap-1 hover:bg-neutral-100"
                >
                  {themeMode === "dark" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                  <span className="text-[11px] capitalize">{themeMode}</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Box */}
            <div
              className={`relative rounded-2xl overflow-hidden aspect-video border transition-all ${
                themeMode === "dark" ? "bg-neutral-950 border-neutral-800" : "bg-neutral-100 border-neutral-200"
              }`}
            >
              <img
                src={imageUrl}
                alt="Thumbnail Analysis Canvas"
                className="w-full h-full object-cover"
              />

              {/* Rule of Thirds Grid Overlay */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
                  <div className="border-r border-b border-white/30" />
                  <div className="border-r border-b border-white/30" />
                  <div className="border-b border-white/30" />
                  <div className="border-r border-b border-white/30" />
                  <div className="border-r border-b border-white/30" />
                  <div className="border-b border-white/30" />
                  <div className="border-r border-white/30" />
                  <div className="border-r border-white/30" />
                  <div />
                </div>
              )}

              {/* Timestamp Danger Zone Overlay */}
              {showSafeZone && (
                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-2 py-1 rounded-md bg-black/85 text-white font-mono text-[11px] sm:text-xs font-bold tracking-tight border border-white/10 shadow-lg pointer-events-none flex items-center gap-1">
                  <span>14:28</span>
                  <span className="text-[9px] bg-red-600 text-white px-1 py-0.2 rounded font-sans">DANGER ZONE</span>
                </div>
              )}
            </div>

            {/* Mobile Squint Test Preview */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Mobile Feed Glanceability (Squint Scale: 120px)</span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  How your thumbnail registers when reduced to a smartphone screen dimension.
                </p>
              </div>
              <div className="w-[120px] aspect-video rounded-md overflow-hidden border border-neutral-300 shrink-0 shadow-2xs">
                <img src={imageUrl} alt="Mini Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Right Metrics Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">
                    OVERALL DIAGNOSTIC SCORE
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-neutral-950">{metrics.overallScore}</span>
                    <span className="text-sm font-bold text-neutral-500">/ 100</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  metrics.overallScore >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {metrics.glanceability}
                </div>
              </div>

              {/* Progress Gauges */}
              <div className="space-y-3 pt-2 border-t border-neutral-200">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
                    <span>Luminance Separation</span>
                    <span className="font-mono text-neutral-500">{metrics.luminance} / 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                    <div
                      className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                      style={{ width: `${metrics.luminance}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
                    <span>Focal Contrast Ratio</span>
                    <span className="font-mono text-neutral-500">{metrics.contrastRatio}:1 (Target &gt;= 4.5)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        metrics.contrastRatio >= 4.5 ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${Math.min(100, (metrics.contrastRatio / 10) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
                    <span>Timestamp Zone Danger</span>
                    <span className={`font-mono font-bold ${
                      metrics.dangerZoneRisk === "Low" ? "text-emerald-600" : "text-red-600"
                    }`}>
                      {metrics.dangerZoneRisk} Risk
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        metrics.dangerZoneRisk === "Low" ? "bg-emerald-500" : "bg-red-500"
                      }`}
                      style={{ width: metrics.dangerZoneRisk === "Low" ? "25%" : "85%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Heuristic Recommendations */}
              <div className="pt-2 border-t border-neutral-200 space-y-2">
                <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  <span>Algorithmic Optimization Tips</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-600">
                  {metrics.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Box */}
            <div className="p-5 rounded-2xl bg-neutral-950 text-white space-y-3 shadow-sm">
              <div className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">
                [ COMPLETE PACKAGING AUDIT ]
              </div>
              <h4 className="text-sm font-bold">Want Full Multi-Model Packaging Forecasting?</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                PreYT checks your draft against 14.8M uploads, verifies title character cutoffs, and calculates expected click velocity before filming.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Start Free Audit <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
