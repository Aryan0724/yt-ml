"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Users, Clock, BarChart3, Search, 
  BookOpen, Activity, MessageSquare, ShieldCheck, HeartPulse,
  Settings, LogOut, KeyRound, AlertCircle, Menu, X, ArrowLeft
} from "lucide-react"

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Creator Waitlist", href: "/admin/waitlist", icon: Clock },
  { label: "User Accounts", href: "/admin/users", icon: Users },
  { label: "Portfolio", href: "/admin/portfolio", icon: ShieldCheck },
  { label: "Advanced Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "SEO command", href: "/admin/seo", icon: Search },
  { label: "Blogs & CMS", href: "/admin/blogs", icon: BookOpen },
  { label: "CMS Managers", href: "/admin/cms-users", icon: Users },
  { label: "Live Activity", href: "/admin/activity", icon: Activity },
  { label: "Creator Feedback", href: "/admin/feedback", icon: MessageSquare },
  { label: "System Health", href: "/admin/system-health", icon: HeartPulse },
  { label: "Beta Auth Debug", href: "/admin/debug-auth", icon: KeyRound },
  { label: "Settings Desk", href: "/admin/settings", icon: Settings },
  { label: "Team Management", href: "/admin/team", icon: Users }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Sync and persist administrative sessions
  useEffect(() => {
    const token = localStorage.getItem("ap_admin_token")
    const email = localStorage.getItem("ap_admin_email")
    if (token === "ap_admin_authorized" && email) {
      setIsAuthenticated(true)
      setAdminEmail(email)
    }
  }, [])

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    if (passcode === "adminhere@preyt") {
      setIsAuthenticated(true)
      localStorage.setItem("ap_admin_token", "ap_admin_authorized")
      localStorage.setItem("ap_admin_email", adminEmail || "aryantiwari@integralgroups.in")
    } else {
      setLoginError("Invalid cryptographic passcode. Administrative clearance denied.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("ap_admin_token")
    localStorage.removeItem("ap_admin_email")
    setIsAuthenticated(false)
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 antialiased font-sans flex">
      {/* 1. NOTION-LINEAR GLASS AUTH GATE */}
      <AnimatePresence>
        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#030303] z-50 flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full glass-card p-10 border-white/10 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 animate-pulse" />
              
              <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  preYT Core Command
                </span>
                <h2 className="text-3xl font-display font-bold tracking-tight text-white">Security Clearance</h2>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Authentication and administrative authorization are required to access the operational intelligence center.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Admin Identity</label>
                  <input
                    required
                    type="email"
                    placeholder="admin@integralgroups.in"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex justify-between">
                    <span>Credentials Passcode</span>
                  </label>
                  <input
                    required
                    type="password"
                    placeholder="Enter cryptographic key..."
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white font-mono"
                  />
                </div>

                {loginError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" /> Authenticate Session
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ADMIN SIDEBAR LAYOUT */}
      {isAuthenticated && (
        <>
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex w-64 border-r border-white/5 bg-[#050505] flex-col justify-between p-6 fixed inset-y-0 left-0 z-30">
            <div className="space-y-8">
              {/* Brand Branding */}
              <div className="flex items-center justify-between">
                <Link href="/" className="font-display font-extrabold tracking-tight text-white text-lg flex items-center gap-2">
                  ⚡ preYT <span className="text-[8px] font-bold uppercase text-zinc-500 px-1.5 py-0.5 rounded border border-white/10 bg-white/5">ADMIN</span>
                </Link>
              </div>

              {/* Verified Badge */}
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-white font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Super Admin</span>
                </div>
                <div className="text-[10px] text-zinc-500 truncate">{adminEmail}</div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all ${
                        isActive
                          ? "bg-white text-black font-extrabold shadow-lg"
                          : "text-zinc-500 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide uppercase text-red-500/70 hover:text-red-500 hover:bg-red-500/5 transition-all w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Terminate Session</span>
            </button>
          </aside>

          {/* Mobile Navigation Header */}
          <header className="lg:hidden fixed top-0 left-0 w-full h-16 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-40">
            <span className="font-display font-extrabold text-white text-sm flex items-center gap-2">
              ⚡ preYT <span className="text-[7px] font-bold uppercase text-zinc-500 px-1 py-0.5 rounded border border-white/10 bg-white/5">ADMIN</span>
            </span>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </header>

          {/* Mobile Navigation Sidebar */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="lg:hidden fixed inset-y-0 left-0 w-64 bg-[#050505] border-r border-white/5 p-6 flex flex-col justify-between z-45 pt-20"
              >
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-white font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Super Admin</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate">{adminEmail}</div>
                  </div>

                  <nav className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all ${
                            isActive
                              ? "bg-white text-black font-extrabold"
                              : "text-zinc-500 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </nav>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide uppercase text-red-500/70 hover:text-red-500 hover:bg-red-500/5 transition-all w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Terminate Session</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Pane */}
          <div className="flex-1 min-w-0 min-h-screen lg:pl-64 pt-16 lg:pt-0">
            <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
              {children}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
