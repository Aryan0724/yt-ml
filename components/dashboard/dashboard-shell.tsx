"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Search, Bell, Plus, Youtube, CheckCircle2, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getStoredSession, storeSession, AuthSession, YouTubeChannel, getConnectedYouTubeChannel } from "@/lib/api/auth"
import { YouTubeConnectModal } from "@/components/auth/youtube-connect-modal"

function formatNumber(num: number | string | undefined): string {
  if (!num) return "0"
  const n = typeof num === "string" ? parseInt(num, 10) : num
  if (isNaN(n)) return "0"
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

export function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [channel, setChannel] = useState<YouTubeChannel | null>(null)
  const [showConnectModal, setShowConnectModal] = useState(false)

  useEffect(() => {
    // 1. Check if Google OAuth callback set a session cookie that needs client-side storage
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/preyt_session_data=([^;]+)/)
      if (match && match[1]) {
        try {
          const raw = decodeURIComponent(match[1])
          const parsed = JSON.parse(atob(raw))
          storeSession(parsed)
          // clear cookie after storing
          document.cookie = "preyt_session_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        } catch (e) {
          console.warn("[DashboardShell] Session sync error:", e)
        }
      }
    }

    // 2. Load stored session
    const currentSession = getStoredSession()
    if (currentSession?.access_token) {
      setSession(currentSession)
      if (currentSession.user.youtube_channel) {
        setChannel(currentSession.user.youtube_channel)
      }
    } else {
      // Fallback channel if stored separately
      const ch = getConnectedYouTubeChannel()
      if (ch) setChannel(ch)
    }

    // 3. Listen for dynamic channel changes across the dashboard
    const handleChannelChange = (e: any) => {
      setChannel(e.detail)
      const s = getStoredSession()
      if (s) setSession(s)
    }

    window.addEventListener("preyt_channel_changed", handleChannelChange)
    return () => window.removeEventListener("preyt_channel_changed", handleChannelChange)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-white text-neutral-900">
      <Sidebar session={session} connectedChannel={channel} onOpenConnect={() => setShowConnectModal(true)} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-50/50">
        {/* Top Header */}
        <header className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
          <div className="flex-1 flex items-center gap-3">
            <div className="relative max-w-xs hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="search"
                placeholder="Search topics, ideas, videos..."
                className="w-full pl-9 pr-10 py-1.5 rounded-lg text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-neutral-200 bg-white text-[10px] font-medium text-neutral-400">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Connected YouTube Channel Badge / Connect Button */}
            {channel ? (
              <button
                type="button"
                onClick={() => setShowConnectModal(true)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors text-left cursor-pointer group"
              >
                {channel.avatarUrl ? (
                  <Image
                    src={channel.avatarUrl}
                    alt={channel.title}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full object-cover border border-neutral-200"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                    {channel.title.charAt(0)}
                  </div>
                )}
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-neutral-900 truncate max-w-[120px]">{channel.title}</p>
                    <CheckCircle2 className="w-3 h-3 text-red-600 fill-red-50" />
                  </div>
                  <p className="text-[10px] text-neutral-500 font-medium">
                    {formatNumber(channel.subscriberCount)} subs
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowConnectModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50/80 hover:bg-red-50 text-red-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <Youtube className="w-4 h-4 text-red-600 fill-red-600" />
                <span>Connect Channel</span>
              </button>
            )}

            <button
              className="relative p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full" />
            </button>

            <Link
              href="/dashboard/analyze"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Audit</span>
            </Link>
          </div>
        </header>

        {/* Main Content Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Connect YouTube Channel Modal */}
      <YouTubeConnectModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnected={(ch) => setChannel(ch)}
        title={channel ? "Switch or Connect YouTube Channel" : "Connect Your YouTube Channel"}
        subtitle="Lookup any YouTube handle to automatically load real channel analytics, recent uploads, and competitor radar."
      />
    </div>
  )
}
