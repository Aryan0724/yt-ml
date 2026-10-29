"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  Info
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const DEFAULT_SAMPLE_THUMBNAIL = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1280&q=80"
const DEFAULT_TITLE = "I Built a $10M Company With 0 Employees (The Full Breakdown)"
const DEFAULT_CHANNEL = "Creator Case Studies"

export function PublicFeedPreviewer() {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(DEFAULT_SAMPLE_THUMBNAIL)
  const [title, setTitle] = useState<string>(DEFAULT_TITLE)
  const [channelName, setChannelName] = useState<string>(DEFAULT_CHANNEL)
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile")
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark")
  const [showDangerZone, setShowDangerZone] = useState<boolean>(true)

  const isDark = themeMode === "dark"
  const charLimit = 54
  const isTruncated = title.length > charLimit
  const visibleTitle = isTruncated ? title.slice(0, charLimit) + "..." : title

  // Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setThumbnailUrl(url)
    }
  }

  // Ctrl+V paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile()
          if (file) {
            const url = URL.createObjectURL(file)
            setThumbnailUrl(url)
            break
          }
        }
      }
    }
    window.addEventListener("paste", handlePaste)
    return () => window.removeEventListener("paste", handlePaste)
  }, [])

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Title Input */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
              <label htmlFor="title-input">Draft Video Title</label>
              <span className={`font-mono text-[11px] ${isTruncated ? "text-amber-600 font-bold" : "text-neutral-500"}`}>
                {title.length} / 100 characters {isTruncated && "(Truncates on mobile)"}
              </span>
            </div>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter working video title..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
            />
          </div>

          {/* Channel Name */}
          <div className="space-y-2">
            <label htmlFor="channel-input" className="text-xs font-semibold text-neutral-700 block">
              Channel Name
            </label>
            <input
              id="channel-input"
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Your Channel"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        {/* Upload & Toggles Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-200">
          {/* Upload Button */}
          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors shadow-xs">
              <Upload className="w-4 h-4 text-neutral-500" />
              <span>Upload Custom Thumbnail</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
            <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
              (or press Ctrl+V to paste screenshot)
            </span>
          </div>

          {/* Device & Theme Toggles */}
          <div className="flex items-center gap-2">
            {/* Safe Area Toggle */}
            <button
              onClick={() => setShowDangerZone(!showDangerZone)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                showDangerZone ? "bg-red-50 border-red-200 text-red-700" : "bg-white border-neutral-200 text-neutral-600"
              }`}
            >
              Timestamp Safe Zone: {showDangerZone ? "ON" : "OFF"}
            </button>

            {/* Viewport Toggle */}
            <div className="flex items-center rounded-xl border border-neutral-200 bg-white p-0.5 text-xs font-medium">
              <button
                onClick={() => setDeviceMode("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                  deviceMode === "mobile" ? "bg-neutral-950 text-white" : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile
              </button>
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                  deviceMode === "desktop" ? "bg-neutral-950 text-white" : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Desktop
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center rounded-xl border border-neutral-200 bg-white p-0.5 text-xs font-medium">
              <button
                onClick={() => setThemeMode("dark")}
                className={`p-1.5 rounded-lg transition-colors ${
                  themeMode === "dark" ? "bg-neutral-950 text-white" : "text-neutral-600 hover:text-neutral-900"
                }`}
                title="YouTube Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setThemeMode("light")}
                className={`p-1.5 rounded-lg transition-colors ${
                  themeMode === "light" ? "bg-neutral-950 text-white" : "text-neutral-600 hover:text-neutral-900"
                }`}
                title="YouTube Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Display Canvas */}
      <div className="flex justify-center">
        <div
          className={`transition-all duration-300 rounded-3xl p-6 shadow-2xl border ${
            isDark ? "bg-[#0f0f0f] border-neutral-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
          } ${deviceMode === "mobile" ? "w-full max-w-[400px]" : "w-full max-w-[720px]"}`}
        >
          {/* Feed Mockup Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-700/30 text-xs font-mono text-neutral-400">
            <span>YOUTUBE HOME FEED SIMULATION</span>
            <span>{deviceMode === "mobile" ? "375 × 812 (iPhone/Android)" : "1280 × 720 (Desktop)"}</span>
          </div>

          {/* Video Item in Feed */}
          <div className="space-y-3">
            {/* Thumbnail Box */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-md border border-neutral-800/40">
              <img
                src={thumbnailUrl}
                alt="Uploaded draft thumbnail preview"
                className="w-full h-full object-cover"
              />

              {/* YouTube Duration Badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wide z-20 pointer-events-none">
                14:20
              </div>

              {/* Safe Area Danger Zone Overlay */}
              {showDangerZone && (
                <div
                  className="absolute bottom-0 right-0 w-[24%] h-[28%] bg-red-600/35 border-2 border-dashed border-red-500 rounded-tl-xl flex items-center justify-center p-1 z-30 pointer-events-none animate-pulse"
                >
                  <span className="text-[9px] font-bold text-white text-center leading-tight drop-shadow">
                    TIMESTAMP DANGER ZONE
                  </span>
                </div>
              )}
            </div>

            {/* Video Metadata in Feed */}
            <div className="flex gap-3 pt-1">
              {/* Channel Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                {channelName.charAt(0).toUpperCase()}
              </div>

              {/* Title & Stats */}
              <div className="space-y-1 flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-snug ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>
                  {deviceMode === "mobile" ? visibleTitle : title}
                </p>
                <div className={`text-xs ${isDark ? "text-neutral-400" : "text-neutral-500"} flex items-center gap-1.5`}>
                  <span>{channelName}</span>
                  <span>•</span>
                  <span>248K views</span>
                  <span>•</span>
                  <span>3 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Diagnostic Flags */}
          <div className="mt-6 pt-4 border-t border-neutral-700/30 space-y-2 text-xs">
            {isTruncated && deviceMode === "mobile" ? (
              <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Title Truncated:</strong> Last {title.length - charLimit} characters are hidden on mobile phones.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Title fully visible on mobile screens ({title.length} chars).</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conversion Banner: Upgrade to PreYT Machine Learning Analysis */}
      <Card className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white p-8 rounded-3xl border border-neutral-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500">
            <Sparkles className="w-4 h-4" />
            <span>Full Pre-Upload Decision Suite</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Want statistical CTR forecasting before filming?
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-normal">
            PreYT runs format-native OpenCV computer-vision models, niche outlier overperformance tracking, and pHash originality analysis across 14.8M uploads.
          </p>
        </div>

        <Link
          href="/signup"
          className="shrink-0 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-red-600/30 flex items-center gap-2"
        >
          <span>Audit Draft Free</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Card>
    </div>
  )
}
