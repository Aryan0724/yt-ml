"use client"

import { useState, useEffect, useRef } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import {
  Search,
  Bell,
  Plus,
  Youtube,
  CheckCircle2,
  ChevronDown,
  LogOut,
  User,
  Sparkles,
  Settings as SettingsIcon,
  Menu,
  X,
  Tv,
  Radar,
  Home,
  Flame,
  Lightbulb,
  ActivitySquare,
  FlaskConical,
  History,
  ShieldCheck,
  HelpCircle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  getStoredSession,
  storeSession,
  AuthSession,
  YouTubeChannel,
  getConnectedYouTubeChannel,
  logoutUser
} from "@/lib/api/auth"
import { AlertCircle, ExternalLink } from "lucide-react"

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
  const pathname = usePathname()
  const [session, setSession] = useState<AuthSession | null>(null)
  const [channel, setChannel] = useState<YouTubeChannel | null>(null)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const handleConnectYouTube = async () => {
    try {
      const res = await fetch("/api/auth/google/url?redirect=/dashboard")
      const data = await res.json()
      if (data.configured && data.url) {
        window.location.href = data.url
        return
      }
      setShowConfigModal(true)
    } catch {
      setShowConfigModal(true)
    }
  }

  useEffect(() => {
    // 1. Check if Google OAuth callback set a session cookie that needs client-side storage
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/preyt_session_data=([^;]+)/)
      if (match && match[1]) {
        try {
          const raw = decodeURIComponent(match[1])
          const parsed = JSON.parse(atob(raw))
          storeSession(parsed)
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
      const ch = getConnectedYouTubeChannel()
      if (ch) setChannel(ch)
    }

    // 3. Listen for dynamic channel changes
    const handleChannelChange = (e: any) => {
      setChannel(e.detail)
      const s = getStoredSession()
      if (s) setSession(s)
    }

    // 4. Click outside to close user menu
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    window.addEventListener("preyt_channel_changed", handleChannelChange)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("preyt_channel_changed", handleChannelChange)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
    await logoutUser(true)
  }

  const mobileNav = [
    { label: "Overview", icon: Home, href: "/dashboard" },
    { label: "Creator Radar", icon: Radar, href: "/dashboard/radar" },
    { label: "Niche Outliers", icon: Flame, href: "/dashboard/niche" },
    { label: "Idea Sandbox", icon: Lightbulb, href: "/dashboard/ideas" },
    { label: "Analyze Video", icon: ActivitySquare, href: "/dashboard/analyze" },
    { label: "A/B Lab", icon: FlaskConical, href: "/dashboard/lab" },
    { label: "Channel DNA", icon: Tv, href: "/dashboard/channel" },
    { label: "Audit Archive", icon: History, href: "/dashboard/history" },
    { label: "Creator Onboarding", icon: Sparkles, href: "/onboarding" },
    { label: "Settings", icon: SettingsIcon, href: "/dashboard/settings" },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-white text-neutral-900">
      {/* Desktop Sidebar */}
      <Sidebar session={session} connectedChannel={channel} onOpenConnect={handleConnectYouTube} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-50/50">
        
        {/* Top Header */}
        <header className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
          
          {/* Left: Mobile hamburger & search */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 rounded-xl text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 md:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

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

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Connected YouTube Channel Badge */}
            {channel ? (
              <button
                type="button"
                onClick={handleConnectYouTube}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors text-left cursor-pointer group"
                title="Click to switch or authorize channel via Google"
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
                onClick={handleConnectYouTube}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50/80 hover:bg-red-50 text-red-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <Youtube className="w-4 h-4 text-red-600 fill-red-600" />
                <span className="hidden sm:inline">Connect Channel</span>
                <span className="sm:hidden">Connect</span>
              </button>
            )}

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors hidden sm:block"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full" />
            </button>

            {/* New Audit CTA */}
            <Link
              href="/dashboard/analyze"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Audit</span>
            </Link>

            {/* User Profile & Logout Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full border border-neutral-200 hover:border-neutral-300 bg-neutral-50 transition-all cursor-pointer"
                aria-label="User Account Menu"
              >
                {session?.user?.avatar_url ? (
                  <Image
                    src={session.user.avatar_url}
                    alt={session.user.full_name}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                    {(session?.user?.full_name || "C").charAt(0).toUpperCase()}
                  </div>
                )}
                <ChevronDown className="w-3 h-3 text-neutral-400 mr-1" />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-neutral-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Meta */}
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-xs font-bold text-neutral-900 truncate">
                      {session?.user?.full_name || "Creator"}
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {session?.user?.email || "creator@channel.com"}
                    </p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-50 text-red-600 border border-red-100">
                      PRO CREATOR WORKSPACE
                    </span>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-1">
                    <Link
                      href="/onboarding"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Creator Onboarding Setup</span>
                    </Link>

                    <Link
                      href="/dashboard/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
                    >
                      <SettingsIcon className="w-4 h-4 text-neutral-400" />
                      <span>Account & Channel Settings</span>
                    </Link>

                    <Link
                      href="/pricing"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Subscription & Quotas</span>
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-1 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>Sign Out of PreYT</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-neutral-200 bg-white p-4 space-y-3 z-40 animate-in slide-in-from-top duration-200 shadow-md">
            <div className="grid grid-cols-2 gap-2">
              {mobileNav.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive ? "bg-red-50 text-red-700" : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Google Cloud OAuth Configuration Required Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="h-1.5 bg-red-600" />
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-950">Google Cloud OAuth Setup Required</h3>
                    <p className="text-xs text-neutral-500">Official YouTube verification is enabled</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-neutral-600 leading-relaxed">
                <p>
                  To verify your YouTube channel ownership directly with Google, PreYT requires your Google Cloud OAuth Client ID and Secret in your environment.
                </p>

                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 font-mono text-[11px]">
                  <div className="text-neutral-500 uppercase tracking-wider font-bold">Required Environment Variables:</div>
                  <div className="text-neutral-800">NEXT_PUBLIC_GOOGLE_CLIENT_ID=&lt;your_client_id&gt;.apps.googleusercontent.com</div>
                  <div className="text-neutral-800">GOOGLE_CLIENT_SECRET=GOCSPX-&lt;your_secret&gt;</div>
                  <div className="text-neutral-500 pt-1">Authorized redirect URI:</div>
                  <div className="text-red-700 font-bold break-all">https://preyt.integralgroups.in/api/auth/google/callback</div>
                </div>

                <p className="text-[11px] text-neutral-500">
                  PreYT strictly enforces official Google OAuth verification so that no unauthorized user can ever claim or access another creator&apos;s channel.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs"
                >
                  <span>Google Cloud Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
