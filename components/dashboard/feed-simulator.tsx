"use client"

import React, { useState } from "react"
import { Eye, Smartphone, Monitor, Moon, Sun, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"

export interface FeedSimulatorProps {
  thumbnailUrl: string
  title: string
  channelName?: string
  clashRisk?: boolean
  warnings?: string[]
}

export function FeedSimulator({
  thumbnailUrl,
  title,
  channelName = "Your Channel",
  clashRisk = false,
  warnings = []
}: FeedSimulatorProps) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile")
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark")
  const [showDangerZone, setShowDangerZone] = useState<boolean>(true)

  const isDark = themeMode === "dark"
  const mobileCutoff = 54
  const isTitleTruncated = title.length > mobileCutoff

  return (
    <Card className="p-6 border bg-card text-card-foreground space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">
              Live YouTube Feed Simulator
            </h3>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-500/10 text-red-600 border border-red-500/20">
              Pre-Upload Preview
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test glanceability, safe areas, and mobile character cutoffs before publishing.
          </p>
        </div>

        {/* Viewport & Theme Toggles */}
        <div className="flex items-center gap-2">
          {/* Device Toggle */}
          <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setDeviceMode("mobile")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                deviceMode === "mobile" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                deviceMode === "desktop" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setThemeMode(isDark ? "light" : "dark")}
            className="p-1.5 rounded-lg border bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-neutral-800" />}
          </button>

          {/* Danger Zone Overlay Toggle */}
          <button
            type="button"
            onClick={() => setShowDangerZone(!showDangerZone)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showDangerZone
                ? "bg-red-500/15 border-red-500/30 text-red-600"
                : "bg-muted/40 text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>UI Danger Zones</span>
          </button>
        </div>
      </div>

      {/* Simulator Feed Arena */}
      <div
        className={`p-6 sm:p-10 rounded-2xl border transition-colors flex justify-center ${
          isDark ? "bg-[#0f0f0f] border-neutral-800 text-white" : "bg-[#f9f9f9] border-neutral-200 text-neutral-900"
        }`}
      >
        <div className={`w-full transition-all ${deviceMode === "mobile" ? "max-w-[390px]" : "max-w-[580px]"}`}>
          {/* Mock Video Card */}
          <div className="space-y-3">
            {/* Thumbnail Canvas */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-md border border-white/5">
              <img
                src={thumbnailUrl}
                alt="Thumbnail Test Preview"
                className="w-full h-full object-cover"
              />

              {/* YouTube Duration Timestamp Overlay (Bottom-Right) */}
              <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-white text-[11px] font-bold px-1.5 py-0.5 rounded tracking-wide z-20 pointer-events-none">
                12:45
              </div>

              {/* Danger Zone Overlay (Visual safe area demonstration) */}
              {showDangerZone && (
                <>
                  {/* Bottom-Right Danger Zone (Timestamp coverage) */}
                  <div className="absolute bottom-0 right-0 w-[25%] h-[25%] bg-red-500/30 border-2 border-dashed border-red-500/80 rounded-tl-lg flex items-center justify-center z-10 pointer-events-none">
                    <span className="text-[9px] font-black text-white bg-red-600/90 px-1 py-0.5 rounded shadow-xs uppercase tracking-tighter">
                      Timestamp
                    </span>
                  </div>

                  {/* Top-Right Danger Zone (Watch Later / Hover cards) */}
                  <div className="absolute top-0 right-0 w-[20%] h-[22%] bg-amber-500/25 border-2 border-dashed border-amber-500/70 rounded-bl-lg flex items-center justify-center z-10 pointer-events-none">
                    <span className="text-[9px] font-black text-white bg-amber-600/90 px-1 py-0.5 rounded shadow-xs uppercase tracking-tighter">
                      Overlay
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Title & Metadata Strip */}
            <div className="flex items-start gap-3 pt-1">
              {/* Channel Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
                {channelName.slice(0, 2).toUpperCase()}
              </div>

              {/* Title & Stats */}
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm sm:text-base font-bold leading-snug line-clamp-2 ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                  title={title}
                >
                  {deviceMode === "mobile" && isTitleTruncated ? (
                    <>
                      <span>{title.slice(0, mobileCutoff)}</span>
                      <span className="text-red-500 font-black">... [CUTOFF]</span>
                    </>
                  ) : (
                    title || "Untitled Video Packaging"
                  )}
                </h4>

                <div className={`flex items-center gap-1.5 text-xs mt-1 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  <span className="font-medium truncate">{channelName}</span>
                  <span>•</span>
                  <span>142K views</span>
                  <span>•</span>
                  <span>2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safe Area & Cutoff Diagnostics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
          clashRisk ? "bg-red-50 border-red-200 text-red-800" : "bg-emerald-50 border-emerald-200 text-emerald-800"
        }`}>
          {clashRisk ? (
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <span className="font-bold">
              {clashRisk ? "Timestamp Danger Zone Clash Detected" : "UI Safe Area Clear"}
            </span>
            <p className="mt-0.5 text-opacity-90">
              {clashRisk
                ? "Focal text or faces intersect with the bottom-right timestamp zone."
                : "Key focal points avoid YouTube's native UI overlay zones."}
            </p>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
          isTitleTruncated ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-emerald-50 border-emerald-200 text-emerald-800"
        }`}>
          {isTitleTruncated ? (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <span className="font-bold">
              {isTitleTruncated ? `Mobile Title Truncation (${title.length} chars)` : "Title Fits Mobile Safe Area"}
            </span>
            <p className="mt-0.5 text-opacity-90">
              {isTitleTruncated
                ? `Characters after index ${mobileCutoff} will be replaced by '...' on phone feeds.`
                : "Full title hook remains completely visible on 390px mobile viewports."}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
