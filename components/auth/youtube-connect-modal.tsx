"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Youtube, Search, CheckCircle2, ArrowRight, X, Sparkles, Loader2, AlertCircle } from "lucide-react"
import { YouTubeChannel, setConnectedYouTubeChannel, loginWithYouTubeChannel, getStoredSession } from "@/lib/api/auth"

interface YouTubeConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConnected?: (channel: YouTubeChannel) => void
  title?: string
  subtitle?: string
}

function formatNumber(num: number | string | undefined): string {
  if (!num) return "0"
  const n = typeof num === "string" ? parseInt(num, 10) : num
  if (isNaN(n)) return "0"
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

export function YouTubeConnectModal({
  isOpen,
  onClose,
  onConnected,
  title = "Connect Your YouTube Channel",
  subtitle = "Link your channel to unlock automated packaging audits, competitor tracking, and live CTR forecasting."
}: YouTubeConnectModalProps) {
  const router = useRouter()
  const [handleInput, setHandleInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewChannel, setPreviewChannel] = useState<YouTubeChannel | null>(null)
  const [recentVideos, setRecentVideos] = useState<any[]>([])

  if (!isOpen) return null

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!handleInput.trim()) return

    setLoading(true)
    setError(null)
    setPreviewChannel(null)
    setRecentVideos([])

    try {
      const res = await fetch("/api/youtube/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handleInput.trim() })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Channel lookup failed")
      }

      setPreviewChannel(data.channel)
      setRecentVideos(data.recentVideos || [])
    } catch (err: any) {
      setError(err.message || "Failed to find channel. Try entering your handle (e.g. @mrbeast)")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmConnect = async () => {
    if (!previewChannel) return
    setLoading(true)

    try {
      const session = getStoredSession()
      if (session) {
        // User is already logged in, just attach the channel
        setConnectedYouTubeChannel(previewChannel)
      } else {
        // User is logging in / signing up via YouTube Connect
        await loginWithYouTubeChannel(previewChannel)
      }

      if (onConnected) {
        onConnected(previewChannel)
      }

      onClose()
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to connect channel.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Header Red Gradient Accent */}
        <div className="h-2 bg-gradient-to-r from-red-600 via-rose-500 to-red-700" />

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100">
                <Youtube className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-950">{title}</h2>
                <p className="text-xs text-neutral-600 mt-0.5">{subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleLookup} className="space-y-3 mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
              YouTube Channel Handle or URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  placeholder="@yourchannel or youtube.com/@handle"
                  className="w-full pl-10 pr-3.5 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-600 focus:bg-white text-sm transition-all"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading || !handleInput.trim()}
                className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Search</span>}
              </button>
            </div>
            <p className="text-[11px] text-neutral-500">
              Tip: You can enter any handle (e.g. <span className="text-neutral-800 font-mono font-semibold">@mkbhd</span>, <span className="text-neutral-800 font-mono font-semibold">@veritasium</span>) or full channel link.
            </p>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Channel Preview Card */}
          {previewChannel && (
            <div className="mb-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4 animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center gap-3.5">
                {previewChannel.avatarUrl ? (
                  <Image
                    src={previewChannel.avatarUrl}
                    alt={previewChannel.title}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-lg">
                    {previewChannel.title.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-neutral-950 truncate">{previewChannel.title}</h3>
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 fill-red-50" />
                  </div>
                  <p className="text-xs font-mono text-neutral-500 truncate">{previewChannel.handle}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-neutral-700 font-medium">
                    <span>
                      <strong className="text-neutral-950 font-bold">{formatNumber(previewChannel.subscriberCount)}</strong> subscribers
                    </span>
                    {previewChannel.videoCount && (
                      <span>
                        • <strong className="text-neutral-950 font-bold">{formatNumber(previewChannel.videoCount)}</strong> uploads
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Uploads Thumbnails */}
              {recentVideos.length > 0 && (
                <div className="pt-3 border-t border-neutral-200">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Recent Videos</p>
                  <div className="grid grid-cols-4 gap-2">
                    {recentVideos.map((video) => (
                      <div key={video.id} className="group relative rounded-lg overflow-hidden border border-neutral-200 aspect-video bg-neutral-200">
                        {video.thumbnailUrl && (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Button */}
              <button
                type="button"
                onClick={handleConfirmConnect}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Connect Channel & Enter Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Quick Demo Channels */}
          {!previewChannel && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                Popular Creator Channels to Test
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { handle: "veritasium", name: "Veritasium" },
                  { handle: "mkbhd", name: "Marques Brownlee" },
                  { handle: "aliabdaal", name: "Ali Abdaal" },
                  { handle: "cleoabram", name: "Cleo Abram" }
                ].map((c) => (
                  <button
                    key={c.handle}
                    type="button"
                    onClick={() => {
                      setHandleInput(`@${c.handle}`)
                      fetch("/api/youtube/connect", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ handle: c.handle })
                      })
                        .then((r) => r.json())
                        .then((d) => {
                          if (d.channel) {
                            setPreviewChannel(d.channel)
                            setRecentVideos(d.recentVideos || [])
                          }
                        })
                        .catch(console.error)
                    }}
                    className="p-2.5 text-left rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300 transition-all text-xs font-medium text-neutral-800 flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="text-[10px] text-neutral-400 group-hover:text-red-600 font-mono">@{c.handle}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
