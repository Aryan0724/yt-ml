"use client"

import { Home, Radar, Lightbulb, ActivitySquare, FlaskConical, Tv, History, Settings, HelpCircle, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AuthSession } from "@/lib/api/auth"

export function Sidebar({ session }: { session: AuthSession | null }) {
  const pathname = usePathname()

  const mainNav = [
    { id: "home", icon: Home, label: "Overview", href: "/dashboard" },
    { id: "radar", icon: Radar, label: "Creator Radar", href: "/dashboard/radar" },
    { id: "ideas", icon: Lightbulb, label: "Idea Sandbox", href: "/dashboard/ideas" },
    { id: "analyze", icon: ActivitySquare, label: "Analyze Video", href: "/dashboard/analyze" },
    { id: "lab", icon: FlaskConical, label: "A/B Lab", href: "/dashboard/lab" },
    { id: "channel", icon: Tv, label: "Channel DNA", href: "/dashboard/channel" },
    { id: "history", icon: History, label: "Audit Archive", href: "/dashboard/history" },
  ]

  const bottomNav = [
    { id: "settings", icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { id: "help", icon: HelpCircle, label: "Help & Docs", href: "/help" },
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

        {/* Workspace selector */}
        <div className="px-4 py-3.5 border-b border-neutral-100">
          <button className="w-full flex items-center justify-between p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer text-left">
            <div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">Workspace</p>
              <p className="text-sm font-semibold text-neutral-900 truncate max-w-[140px]">
                {session?.workspace?.name || "Personal Creator"}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-neutral-400" />
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
                  "flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-neutral-100 text-neutral-900 font-semibold"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-neutral-400" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 flex items-center justify-around h-16 px-2 shadow-lg">
        {mainNav.slice(0, 5).map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full text-[10px] font-medium transition-colors",
                isActive ? "text-red-600 font-semibold" : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate max-w-[56px]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
