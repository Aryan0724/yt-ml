"use client"

import { Home, Radar, Flame, Lightbulb, ActivitySquare, FlaskConical, Tv, History, Settings, HelpCircle, ChevronDown, ShieldCheck, Youtube, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AuthSession, YouTubeChannel } from "@/lib/api/auth"

interface SidebarProps {
  session: AuthSession | null
  connectedChannel?: YouTubeChannel | null
  onOpenConnect?: () => void
}

function formatSubs(num: number | string | undefined): string {
  if (!num) return ""
  const n = typeof num === "string" ? parseInt(num, 10) : num
  if (isNaN(n)) return ""
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M subs`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K subs`
  return `${n} subs`
}

export function Sidebar({ session, connectedChannel, onOpenConnect }: SidebarProps) {
  const pathname = usePathname()

  const mainNav = [
    { id: "home", icon: Home, label: "Overview", href: "/dashboard" },
    { id: "radar", icon: Radar, label: "Creator Radar", href: "/dashboard/radar" },
    { id: "niche", icon: Flame, label: "Niche Outliers", href: "/dashboard/niche" },
    { id: "ideas", icon: Lightbulb, label: "Idea Sandbox", href: "/dashboard/ideas" },
    { id: "analyze", icon: ActivitySquare, label: "Analyze Video", href: "/dashboard/analyze" },
    { id: "lab", icon: FlaskConical, label: "A/B Lab", href: "/dashboard/lab" },
    { id: "channel", icon: Tv, label: "Channel DNA", href: "/dashboard/channel" },
    { id: "history", icon: History, label: "Audit Archive", href: "/dashboard/history" },
    { id: "admin", icon: ShieldCheck, label: "Admin & Telemetry", href: "/dashboard/admin" },
  ]

  const bottomNav = [
    { id: "settings", icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { id: "help", icon: HelpCircle, label: "Help & Docs", href: "/help-center" },
  ]

  return (
    <>
      <aside className="hidden md:flex w-64 flex-col h-screen sticky top-0 shrink-0 bg-white border-r border-neutral-200">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-100 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/preyt-logo-light.png"
              alt="PreYT"
              width={116}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Workspace / Channel selector */}
        <div className="px-4 py-3 border-b border-neutral-100">
          <button
            type="button"
            onClick={onOpenConnect}
            className="w-full flex items-center justify-between p-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {connectedChannel?.avatarUrl ? (
                <Image
                  src={connectedChannel.avatarUrl}
                  alt={connectedChannel.title}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover border border-neutral-200 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <Youtube className="w-4 h-4 fill-red-600" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold text-neutral-900 truncate">
                    {connectedChannel?.title || session?.workspace?.name || "Personal Creator"}
                  </p>
                  {connectedChannel && <CheckCircle2 className="w-3 h-3 text-red-600 shrink-0 fill-red-50" />}
                </div>
                <p className="text-[10px] text-neutral-500 font-mono truncate">
                  {connectedChannel ? connectedChannel.handle : "Click to connect channel"}
                </p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700 shrink-0 ml-1" />
          </button>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Dashboard Navigation">
          {mainNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-red-50 text-red-700 font-semibold"
                    : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-red-600" : "text-neutral-400")} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Usage status card */}
        <div className="p-4 mx-3 mb-2 rounded-xl bg-neutral-50 border border-neutral-200">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-neutral-700">Audit Quota</span>
            <span className="text-red-600 font-bold">14 / 20 used</span>
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-red-600 h-full w-[70%]" />
          </div>
          <Link href="/pricing" className="mt-3 block text-center text-xs font-semibold text-red-600 hover:underline">
            Upgrade for Unlimited Audits →
          </Link>
        </div>

        {/* Bottom links & user info */}
        <div className="p-3 border-t border-neutral-100 space-y-1">
          {bottomNav.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-neutral-100 text-neutral-900 font-semibold"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </aside>
    </>
  )
}
