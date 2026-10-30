"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import {
  Youtube,
  Plus,
  CheckCircle2,
  Sliders,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Settings,
  Eye,
  Film,
  Users,
  Video,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import { YouTubeChannel, getConnectedYouTubeChannel, setConnectedYouTubeChannel, getStoredSession } from "@/lib/api/auth"

function formatNumber(num: number | string | undefined): string {
  if (!num) return "0"
  const n = typeof num === "string" ? parseInt(num, 10) : num
  if (isNaN(n)) return "0"
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

const ARCHETYPES = [
  { id: "TECH_PRODUCT_REVIEW", label: "Tech & Hardware Reviews", baselineCtr: "7.2%", contrastTarget: "5.5:1" },
  { id: "FACELESS_DOCUMENTARY", label: "Faceless Video Essays", baselineCtr: "8.4%", contrastTarget: "6.0:1" },
  { id: "GAMING_ESPORTS", label: "Gaming & Esports", baselineCtr: "6.8%", contrastTarget: "7.0:1" },
  { id: "COOKING_CULINARY", label: "Cooking & Culinary Arts", baselineCtr: "6.5%", contrastTarget: "4.8:1" },
  { id: "FACE_DRIVEN_CREATOR", label: "Personal Brand / Vlog", baselineCtr: "7.9%", contrastTarget: "5.2:1" }
]

export default function ChannelManagementPage() {
  const [channel, setChannel] = useState<YouTubeChannel | null>(null)
  const [recentVideos, setRecentVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [googleUnavailable, setGoogleUnavailable] = useState(false)
  const [selectedArchetype, setSelectedArchetype] = useState("TECH_PRODUCT_REVIEW")

  const handleConnectYouTube = async () => {
    try {
      const res = await fetch("/api/auth/google/url?redirect=/dashboard/channel")
      const data = await res.json()
      if (data.configured && data.url) {
        window.location.href = data.url
        return
      }
      setGoogleUnavailable(true)
    } catch {
      setGoogleUnavailable(true)
    }
  }

  useEffect(() => {
    // 1. Initial channel load
    const active = getConnectedYouTubeChannel()
    if (active) {
      setChannel(active)
      fetchChannelDetails(active.handle)
    } else {
      const s = getStoredSession()
      if (s?.user?.youtube_channel) {
        setChannel(s.user.youtube_channel)
        fetchChannelDetails(s.user.youtube_channel.handle)
      }
    }

    // 2. Event listener
    const handleChannelChange = (e: any) => {
      if (e.detail) {
        setChannel(e.detail)
        fetchChannelDetails(e.detail.handle)
      }
    }
    window.addEventListener("preyt_channel_changed", handleChannelChange)
    return () => window.removeEventListener("preyt_channel_changed", handleChannelChange)
  }, [])

  const fetchChannelDetails = async (handle: string) => {
    setLoading(true)
    try {
      const res = await fetch("/api/youtube/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle })
      })
      const data = await res.json()
      if (data.channel) {
        setChannel(data.channel)
        setRecentVideos(data.recentVideos || [])
      }
    } catch (e) {
      console.warn("Could not refresh channel details:", e)
    } finally {
      setLoading(false)
    }
  }

  const activeArchetypeData = ARCHETYPES.find((a) => a.id === selectedArchetype) || ARCHETYPES[0]

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 flex items-center gap-2.5">
            <span>Channel DNA & YouTube Connection</span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase bg-red-100 text-red-700">
              Live API
            </span>
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Calibrate PreYT's computer vision heuristics to your specific channel audience.
          </p>
        </div>

        <button
          type="button"
          onClick={handleConnectYouTube}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Youtube className="w-4 h-4 fill-white" />
          <span>{channel ? "Authorize Channel via Google" : "Connect YouTube Channel"}</span>
        </button>
      </div>

      {/* Main Connected Channel Banner */}
      {channel ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 card-shadow space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
            <div className="flex items-center gap-4">
              {channel.avatarUrl ? (
                <Image
                  src={channel.avatarUrl}
                  alt={channel.title}
                  width={72}
                  height={72}
                  className="w-18 h-18 rounded-full border-2 border-white shadow-sm object-cover"
                />
              ) : (
                <div className="w-18 h-18 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-2xl">
                  {channel.title.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-neutral-950">{channel.title}</h2>
                  <CheckCircle2 className="w-5 h-5 text-red-600 fill-red-50" />
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono mt-0.5">
                  <span>{channel.handle}</span>
                  <span>•</span>
                  <span>ID: {channel.id}</span>
                </div>
                {channel.description && (
                  <p className="text-xs text-neutral-600 line-clamp-1 max-w-xl mt-1.5">
                    {channel.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchChannelDetails(channel.handle)}
                disabled={loading}
                className="p-2 rounded-xl border border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
                title="Sync from YouTube"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
              <a
                href={`https://youtube.com/${channel.handle}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <span>View on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-1">
                <Users className="w-4 h-4 text-red-600" />
                <span>Subscribers</span>
              </div>
              <p className="text-2xl font-black text-neutral-950">{formatNumber(channel.subscriberCount)}</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> Live Verified
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-1">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Total Channel Views</span>
              </div>
              <p className="text-2xl font-black text-neutral-950">{formatNumber(channel.totalViews)}</p>
              <p className="text-[10px] text-neutral-500 mt-1">Across all public uploads</p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-1">
                <Video className="w-4 h-4 text-amber-600" />
                <span>Total Videos</span>
              </div>
              <p className="text-2xl font-black text-neutral-950">{formatNumber(channel.videoCount)}</p>
              <p className="text-[10px] text-neutral-500 mt-1">Indexed in YouTube library</p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-1">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Avg Views / Video</span>
              </div>
              <p className="text-2xl font-black text-neutral-950">
                {channel.videoCount && channel.totalViews
                  ? formatNumber(Math.round(Number(channel.totalViews) / Number(channel.videoCount)))
                  : "N/A"}
              </p>
              <p className="text-[10px] text-neutral-500 mt-1">Channel baseline velocity</p>
            </div>
          </div>

          {/* Recent Uploads Grid */}
          {recentVideos.length > 0 && (
            <div className="pt-4 border-t border-neutral-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
                <Film className="w-4 h-4 text-red-600" />
                <span>Recent Uploads Tracked</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentVideos.map((vid) => (
                  <div key={vid.id} className="group rounded-xl border border-neutral-200 overflow-hidden bg-neutral-50">
                    <div className="aspect-video relative overflow-hidden bg-neutral-200">
                      {vid.thumbnailUrl && (
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-neutral-900 line-clamp-2">{vid.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Unconnected State Hero Card */
        <div className="rounded-2xl border-2 border-dashed border-red-200 bg-red-50/30 p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Youtube className="w-8 h-8 fill-red-600" />
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold text-neutral-950">No YouTube Channel Connected Yet</h2>
            <p className="text-xs text-neutral-600 mt-1">
              Authorize your YouTube channel via official Google OAuth to verify ownership and calibrate PreYT&apos;s algorithms to your audience.
            </p>
          </div>
          <button
            type="button"
            onClick={handleConnectYouTube}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all cursor-pointer"
          >
            <Youtube className="w-4 h-4 fill-white" />
            <span>Authorize YouTube Channel via Google</span>
          </button>

          {googleUnavailable && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs animate-in fade-in duration-200 max-w-sm mx-auto">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600" />
              <span>Google Sign-In is being configured. Channel connection will be available shortly.</span>
            </div>
          )}
        </div>
      )}

      {/* Archetype & Heuristic Calibration */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 card-shadow space-y-6">
        <div>
          <h2 className="text-base font-bold text-neutral-950 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-red-600" />
            <span>Niche Heuristic Calibration</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Choose the content archetype that matches your channel. PreYT customizes its computer vision and tension benchmarks accordingly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ARCHETYPES.map((arch) => {
            const isSelected = selectedArchetype === arch.id
            return (
              <button
                key={arch.id}
                type="button"
                onClick={() => setSelectedArchetype(arch.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-red-600 bg-red-50/50 shadow-xs ring-1 ring-red-600/20"
                    : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm font-bold ${isSelected ? "text-red-700" : "text-neutral-900"}`}>
                    {arch.label}
                  </p>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 fill-red-50" />}
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                  <span>Baseline CTR: <strong className="text-neutral-800">{arch.baselineCtr}</strong></span>
                  <span>•</span>
                  <span>Contrast: <strong className="text-neutral-800">{arch.contrastTarget}</strong></span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
