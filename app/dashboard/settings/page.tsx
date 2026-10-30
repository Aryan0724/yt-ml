"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ShieldCheck, Loader2, Youtube, CheckCircle2, RefreshCw, Unlink, ExternalLink, LogOut } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
  getAuthHeaders,
  getStoredSession,
  getConnectedYouTubeChannel,
  disconnectYouTubeChannel,
  logoutUser,
  YouTubeChannel
} from "@/lib/api/auth"
import { YouTubeConnectModal } from "@/components/auth/youtube-connect-modal"

function formatNumber(num: number | string | undefined): string {
  if (!num) return "0"
  const n = typeof num === "string" ? parseInt(num, 10) : num
  if (isNaN(n)) return "0"
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

export default function DashboardSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [channel, setChannel] = useState<YouTubeChannel | null>(null)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const session = getStoredSession()
    if (session) {
      setProfile(session.user)
      const ch = getConnectedYouTubeChannel() || session.user.youtube_channel || null
      setChannel(ch)
      setLoading(false)
    } else {
      setLoading(false)
      setError("No active session")
    }

    const handleChannelChange = (e: any) => {
      setChannel(e.detail)
    }
    window.addEventListener("preyt_channel_changed", handleChannelChange)
    return () => window.removeEventListener("preyt_channel_changed", handleChannelChange)
  }, [])

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your YouTube channel? Your PreYT account and history will be preserved.")) {
      return
    }

    setDisconnecting(true)
    try {
      await fetch("/api/youtube/disconnect", { method: "POST" })
      disconnectYouTubeChannel()
      setChannel(null)
    } catch (e) {
      console.warn("Disconnect notice:", e)
      disconnectYouTubeChannel()
      setChannel(null)
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-neutral-950 tracking-tight">Account & Channel Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage your PreYT creator profile and connected YouTube data streams.</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-neutral-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading settings...
        </div>
      ) : error ? (
        <div className="text-red-600 font-mono text-sm bg-red-50 p-4 rounded-xl border border-red-200">{error}</div>
      ) : (
        <div className="space-y-6">
          {/* Creator Profile Card */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 mb-6 border-b border-neutral-100 pb-4">
              <ShieldCheck className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-bold text-neutral-900">Creator Identity</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">Name</span>
                <span className="font-semibold text-neutral-900">{profile?.full_name || "Creator"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">Email</span>
                <span className="font-semibold text-neutral-900">{profile?.email}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">Account Tier</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-900 text-white">
                  PRO CREATOR
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">Authentication Method</span>
                <span className="text-xs text-neutral-600 font-medium">OTP / Google SSO Secured</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <p className="text-xs text-neutral-500">Need to switch accounts or end your session?</p>
              <button
                type="button"
                onClick={() => logoutUser(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Connected YouTube Channel Card */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Youtube className="w-5 h-5 text-red-600 fill-red-600" />
                <h2 className="text-base font-bold text-neutral-900">Connected YouTube Channel</h2>
              </div>
              {channel && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Active Data Stream
                </span>
              )}
            </div>

            {channel ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-50/70 border border-neutral-200/70">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 relative shrink-0">
                      {channel.avatarUrl ? (
                        <Image src={channel.avatarUrl} alt={channel.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-lg text-red-600 bg-red-50">
                          {channel.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                        {channel.title}
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-600 fill-red-50 shrink-0" />
                      </h3>
                      <p className="text-xs text-neutral-500 font-mono mt-0.5">{channel.handle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-neutral-200 text-center">
                      <span className="text-neutral-400 block text-[10px]">SUBSCRIBERS</span>
                      <span className="font-bold text-neutral-900">{formatNumber(channel.subscriberCount)}</span>
                    </div>
                    {channel.videoCount ? (
                      <div className="bg-white px-3 py-1.5 rounded-lg border border-neutral-200 text-center">
                        <span className="text-neutral-400 block text-[10px]">VIDEOS</span>
                        <span className="font-bold text-neutral-900">{formatNumber(channel.videoCount)}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConnectModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-neutral-800 bg-white border border-neutral-200 hover:bg-neutral-50 transition-all cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Switch Channel</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer"
                  >
                    <Unlink className="w-3.5 h-3.5 text-red-600" />
                    <span>{disconnecting ? "Disconnecting..." : "Disconnect Channel"}</span>
                  </button>

                  <a
                    href={`https://youtube.com/${channel.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors ml-auto"
                  >
                    <span>View on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                  <Youtube className="w-6 h-6 fill-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">No YouTube channel connected</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                    Connect your YouTube channel to enable automated packaging forensics, competitor radar, and live CTR calibration.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConnectModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all cursor-pointer"
                >
                  <Youtube className="w-4 h-4 fill-white" />
                  <span>Connect Channel Now</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* YouTube Connect Modal */}
      <YouTubeConnectModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnected={(ch) => setChannel(ch)}
        title={channel ? "Switch YouTube Channel" : "Connect Your YouTube Channel"}
        subtitle="Lookup your channel handle or URL to link real channel analytics, recent uploads, and packaging radar."
      />
    </div>
  )
}
