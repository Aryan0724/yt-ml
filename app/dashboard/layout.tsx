"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/dashboard/sidebar"
import { 
  Building2, LogOut, CheckCircle2, ChevronDown, User, Sparkles
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getStoredSession, logoutUser, AuthSession } from "@/lib/api/auth"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentSession = getStoredSession()
    if (currentSession?.access_token) {
      setSession(currentSession)
    }
    setIsLoading(false)
  }, [])

  const handleSignOut = async () => {
    await logoutUser()
    setSession(null)
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Navigation & Workspace Header */}
        <header className="h-16 border-b border-slate-800/80 flex items-center justify-between px-4 sm:px-8 bg-slate-950/80 backdrop-blur-xl shrink-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-100 truncate max-w-[140px] sm:max-w-xs">
                  {session?.workspace?.name || "Personal Workspace"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400">
                  {session?.workspace?.plan_tier || "Free"}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden sm:block">
                Pre-publish creator intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {session?.user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-medium text-slate-200 truncate max-w-[160px]">
                    {session.user.full_name || session.user.email}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {session.user.email}
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  title="Sign out of PreYT"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-xs font-semibold text-white shadow-md shadow-red-500/20 transition-all"
                >
                  Create workspace
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  )
}
