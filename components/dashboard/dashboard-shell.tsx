"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Search, Bell, Plus } from "lucide-react"
import Link from "next/link"
import { getStoredSession, AuthSession } from "@/lib/api/auth"

export function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, setSession] = useState<AuthSession | null>(null)

  useEffect(() => {
    const currentSession = getStoredSession()
    if (currentSession?.access_token) {
      setSession(currentSession)
    }
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-white text-neutral-900">
      <Sidebar session={session} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-50/50">
        {/* Top Header */}
        <header className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex-1">
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

          <div className="flex items-center gap-3">
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
    </div>
  )
}
