"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, AlertTriangle, Sparkles, Smartphone, Monitor, Moon, Sun } from "lucide-react"

export function InteractivePreview() {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("mobile")
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark")
  const [selectedPin, setSelectedPin] = useState<"hook" | "mobile" | "contrast">("hook")

  return (
    <section className="py-20 bg-neutral-50/70 border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 space-y-2">
          <div className="text-xs font-mono font-bold text-red-600 uppercase tracking-wider">
            [ PRE-UPLOAD PACKAGING DIAGNOSTICS ]
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
            See the exact fixes before you upload.
          </h2>
          <p className="text-base text-neutral-600 font-normal">
            90% of videos underperform not because the content is bad, but because the packaging fails in the mobile feed.
          </p>
        </div>

        {/* Master Studio Frame */}
        <div className="bg-white rounded-3xl border border-neutral-300 card-shadow overflow-hidden">
          
          {/* Top Console Controls */}
          <div className="bg-neutral-100/80 border-b border-neutral-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="font-bold text-neutral-900">STUDIO SIMULATOR</span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-600">Ali Abdaal Style Studio (5.8M Subs)</span>
            </div>

            {/* Viewport & Theme Toggles (Terms.so interactive polish) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white border border-neutral-200 p-0.5 rounded-lg text-[11px] font-sans font-semibold">
                <button
                  onClick={() => setViewport("mobile")}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    viewport === "mobile" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile Feed</span>
                </button>
                <button
                  onClick={() => setViewport("desktop")}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    viewport === "desktop" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop</span>
                </button>
              </div>

              <div className="flex items-center bg-white border border-neutral-200 p-0.5 rounded-lg text-[11px] font-sans font-semibold">
                <button
                  onClick={() => setThemeMode("dark")}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    themeMode === "dark" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  <span>Dark Mode</span>
                </button>
                <button
                  onClick={() => setThemeMode("light")}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    themeMode === "light" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  <span>Light Mode</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Visual Comparison: Side-by-Side YouTube Cards */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Card 1: The Original Flawed Packaging */}
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-neutral-500">[ ORIGINAL DRAFT — 3.8% CTR ]</span>
                  <span className="px-2 py-0.5 bg-neutral-200 text-neutral-700 rounded font-semibold">Below Baseline</span>
                </div>

                {/* Simulated YouTube Card (Flawed) */}
                <div className={`p-3 rounded-xl border ${themeMode === "dark" ? "bg-[#0f0f0f] border-neutral-800 text-white" : "bg-white border-neutral-200 text-neutral-950"}`}>
                  <div className="aspect-video bg-neutral-800 rounded-lg relative overflow-hidden flex items-center justify-center text-center p-4">
                    <span className="text-neutral-400 text-xs font-sans">
                      Low-Contrast Generic AI Thumbnail Image
                    </span>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-[10px] font-mono text-white rounded">
                      11:42
                    </span>
                  </div>

                  <div className="mt-3 flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-600 shrink-0" />
                    <div>
                      <div className={`text-xs sm:text-sm font-semibold line-clamp-2 ${viewport === "mobile" ? "max-w-[210px]" : ""}`}>
                        {viewport === "mobile" ? (
                          <>
                            My complete comprehensive review of AI video editing tools in...
                          </>
                        ) : (
                          "My complete comprehensive review of AI video editing tools in 2026 for beginners"
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">
                        Ali Abdaal • 14K views • 3 days ago
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diagnostic Flaws */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex items-center gap-2 text-red-600 font-medium">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>68 characters: Truncates key value prop on iPhone feed</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 ml-1.5" />
                    <span>Thumbnail contrast: 34% (blends into YouTube dark background)</span>
                  </div>
                </div>
              </div>

              {/* Card 2: PreYT Optimized Packaging (The Winner) */}
              <div className="rounded-2xl border-2 border-red-600 bg-red-50/15 p-5 space-y-4 shadow-sm relative">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-red-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    [ PREYT OPTIMIZED — 9.4% CTR ]
                  </span>
                  <span className="px-2.5 py-0.5 bg-red-600 text-white rounded font-bold">
                    +147% Predicted Lift
                  </span>
                </div>

                {/* Simulated YouTube Card (Winner) */}
                <div className={`p-3 rounded-xl border ${themeMode === "dark" ? "bg-[#0f0f0f] border-neutral-800 text-white" : "bg-white border-neutral-200 text-neutral-950"}`}>
                  <div className="aspect-video bg-neutral-950 rounded-lg relative overflow-hidden flex flex-col justify-end p-4 border border-neutral-800">
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded">
                      ONLY 3 WORKED.
                    </span>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/90 text-[10px] font-mono text-white rounded">
                      11:42
                    </span>
                  </div>

                  <div className="mt-3 flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-600 shrink-0 flex items-center justify-center text-white text-xs font-bold">
                      A
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                        I Tested 50 AI Video Tools (Only 3 Are Actually Good)
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-1">
                        Ali Abdaal • 340K views • 3 days ago
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Diagnostic Pins */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedPin("hook")}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        selectedPin === "hook" ? "bg-red-600 text-white" : "bg-white border border-neutral-200 text-neutral-800"
                      }`}
                    >
                      ✓ Curiosity Loop (Only 3 Good)
                    </button>
                    <button
                      onClick={() => setSelectedPin("mobile")}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        selectedPin === "mobile" ? "bg-red-600 text-white" : "bg-white border border-neutral-200 text-neutral-800"
                      }`}
                    >
                      ✓ Mobile Safe (47 chars)
                    </button>
                    <button
                      onClick={() => setSelectedPin("contrast")}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        selectedPin === "contrast" ? "bg-red-600 text-white" : "bg-white border border-neutral-200 text-neutral-800"
                      }`}
                    >
                      ✓ 89% Contrast Ratio
                    </button>
                  </div>

                  {/* Dynamic Explanation Box */}
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-700 leading-relaxed">
                    {selectedPin === "hook" && (
                      <span><strong>Curiosity Tension:</strong> Stating <em>"Only 3 Are Actually Good"</em> introduces critical doubt without being deceitful. Viewers immediately want to verify if their tool survived.</span>
                    )}
                    {selectedPin === "mobile" && (
                      <span><strong>Mobile Cutoff Safe:</strong> At 47 characters, this entire title remains 100% visible on both iOS and Android before the 54-character ellipsis cutoff.</span>
                    )}
                    {selectedPin === "contrast" && (
                      <span><strong>Feed Pop:</strong> High subject isolation against YouTube Dark Mode (#0f0f0f) increases glanceability by +84% compared to competitor thumbnails.</span>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Workbench Footer Action */}
          <div className="bg-neutral-50 border-t border-neutral-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-neutral-500 font-mono">
              DIRECT YOUTUBE DATA API INTEGRATION • NO EXTENSIONS REQUIRED
            </span>
            <Link
              href="/dashboard/analyze"
              className="inline-flex items-center gap-1.5 font-bold text-red-600 hover:text-red-700"
            >
              <span>Audit your own video title & thumbnail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  )
}
