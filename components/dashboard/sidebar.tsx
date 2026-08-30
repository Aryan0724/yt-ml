"use client"

import { Zap, BarChart3, Sparkles, Database, History, LogOut, Radio } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  const items = [
    { id: "radar", icon: Radio, label: "Radar", fullLabel: "Creator Radar", href: "/dashboard/radar" },
    { id: "analyze", icon: BarChart3, label: "Analyzer", fullLabel: "Package Analyzer", href: "/dashboard" },
    { id: "topic", icon: Sparkles, label: "Topics", fullLabel: "Topic Intelligence", href: "/dashboard/topic" },
    { id: "channel", icon: Database, label: "Channel", fullLabel: "Channel DNA", href: "/dashboard/channel" },
    { id: "history", icon: History, label: "History", fullLabel: "History", href: "/dashboard/history" },
  ]

  return (
    <>
      {/* 1. Desktop & Tablet Sidebar (Hidden on small mobile screens) */}
      <aside className="hidden md:flex w-64 border-r border-zinc-200 dark:border-zinc-800 flex-col p-6 bg-[#FAF9F6] dark:bg-zinc-950 h-screen sticky top-0 shrink-0 text-left">
        <Link href="/dashboard" className="flex items-center mb-10 group">
          <img
            src="/logo-1.png"
            alt="preYT"
            className="h-[32px] w-auto object-contain transition-opacity group-hover:opacity-80 dark:invert"
          />
        </Link>

        <nav className="flex-1 space-y-1.5">
          {items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all",
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.fullLabel}</span>
              </Link>
            )
          })}
        </nav>

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit to Home</span>
          </Link>
        </div>
      </aside>

      {/* 2. Mobile Bottom Navigation Bar (Visible only on mobile screens < 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around px-2 py-2 shadow-lg">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl text-[10px] font-bold transition-all",
                isActive
                  ? "text-zinc-900 dark:text-white"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-lg mb-0.5 transition-all",
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                    : "bg-transparent"
                )}
              >
                <item.icon className="w-4 h-4" />
              </div>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
