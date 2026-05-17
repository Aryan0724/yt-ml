"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/dashboard/sidebar"
import { 
  Search, Bell, Lock, KeyRound, AlertCircle, 
  ChevronRight, Compass, ShieldAlert, CheckCircle2 
} from "lucide-react"
import Link from "next/link"

type AuthState = "loading" | "gate" | "pending" | "suspended" | "authorized"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [authState, setAuthState] = useState<AuthState>("loading")
  const [emailInput, setEmailInput] = useState("")
  const [tokenInput, setTokenInput] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Tracked creator information
  const [creatorEmail, setCreatorEmail] = useState("")
  const [creatorToken, setCreatorToken] = useState("")

  const verifyBetaPass = async (email: string, token: string, isInitial: boolean = false) => {
    try {
      const res = await fetch("/api/activity/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          eventType: isInitial ? "login" : "dashboard_usage",
          metadata: { path: window.location.pathname }
        })
      })

      const payload = await res.json()

      if (res.ok && payload.success) {
        // Save to localStorage
        localStorage.setItem("ap_beta_email", email.toLowerCase())
        localStorage.setItem("ap_beta_token", token)
        setCreatorEmail(email.toLowerCase())
        setCreatorToken(token)
        setAuthState("authorized")
      } else {
        // Handle custom status triages
        if (payload.status === "pending") {
          setAuthState("pending")
        } else if (payload.status === "suspended" || payload.status === "rejected") {
          setAuthState("suspended")
        } else {
          setAuthState("gate")
          if (!isInitial) {
            setErrorMessage(payload.error || "Invalid beta pass token.")
          }
        }
      }
    } catch (err) {
      console.error("Verification failed:", err)
      setAuthState("gate")
    }
  }

  useEffect(() => {
    // 1. Check URL parameters for direct beta access pass links
    const params = new URLSearchParams(window.location.search)
    const urlEmail = params.get("email")
    const urlToken = params.get("token")

    if (urlEmail && urlToken) {
      // Clean query params from address bar immediately
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
      
      verifyBetaPass(urlEmail, urlToken, true)
      return
    }

    // 2. Read from localStorage session persistence
    const localEmail = localStorage.getItem("ap_beta_email")
    const localToken = localStorage.getItem("ap_beta_token")

    if (localEmail && localToken) {
      verifyBetaPass(localEmail, localToken, true)
    } else {
      setAuthState("gate")
    }
  }, [])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    if (!emailInput || !tokenInput) return
    verifyBetaPass(emailInput, tokenInput, false)
  }

  const handleLogout = () => {
    localStorage.removeItem("ap_beta_email")
    localStorage.removeItem("ap_beta_token")
    setAuthState("gate")
    setEmailInput("")
    setTokenInput("")
    setErrorMessage(null)
  }

  return (
    <div className="flex min-h-screen bg-[#030303]">
      <AnimatePresence mode="wait">
        {/* State 1: Loader */}
        {authState === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#030303] z-50 flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Validating Beta Pass...</span>
          </motion.div>
        )}

        {/* State 2: Lock Gate Screen */}
        {authState === "gate" && (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full glass-card p-10 border-white/10 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                  <Lock className="w-5 h-5 text-zinc-400" />
                </div>
                <h2 className="text-2xl font-bold">Closed Beta Access</h2>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  AlgoPilot is currently in restricted beta. Please enter your email and beta pass token to unlock the Creator Hub.
                </p>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                  <input
                    required
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="creator@email.com"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white placeholder-zinc-700"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                    <span>Beta Access Token</span>
                    <span className="text-[8px] text-zinc-600 font-normal">Begins with ap_</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="ap_xxxxxxxxxxxx"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white font-mono placeholder-zinc-700"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" /> Validate credentials
                </button>
              </form>

              <div className="text-center pt-4 border-t border-white/5">
                <span className="text-xs text-zinc-500">Don't have a pass? </span>
                <Link href="/waitlist" className="text-xs text-blue-400 hover:underline">
                  Submit Waitlist Application
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* State 3: Pending Screen */}
        {authState === "pending" && (
          <motion.div
            key="pending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#030303] z-40 flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full glass-card p-12 text-center border-amber-500/20 bg-amber-500/5 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/30" />
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Compass className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white">Application Under Review</h3>
              <p className="text-zinc-400 leading-relaxed text-xs">
                Your beta application is currently in our verification queue. Our engineering team at Integral Groups Studio calibrates ensemble weights manually to align onboarding creators.
              </p>
              
              <div className="pt-4 border-t border-white/5 flex gap-4">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-white transition-all uppercase tracking-wider font-bold"
                >
                  Log out
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* State 4: Suspended Screen */}
        {authState === "suspended" && (
          <motion.div
            key="suspended"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#030303] z-40 flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full glass-card p-12 text-center border-red-500/20 bg-red-500/5 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500/30" />
              <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Beta Pass Suspended</h3>
              <p className="text-zinc-400 leading-relaxed text-xs">
                This beta onboarding credential code is suspended or has expired. Please contact support Hello@algopilot.ai to renew active cohorts.
              </p>
              
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-white transition-all uppercase tracking-wider font-bold"
              >
                Return to Login Gate
              </button>
            </div>
          </motion.div>
        )}

        {/* State 5: Authorized Dashboard Shell */}
        {authState === "authorized" && (
          <motion.div
            key="authorized"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex w-full min-h-screen bg-[#030303]"
          >
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
              <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
                  <span>Workspaces</span>
                  <span className="text-zinc-800">/</span>
                  <span className="text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Active Beta Pilot
                  </span>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-[10px] text-zinc-500 font-mono hidden md:block">
                    Logged in: {creatorEmail}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="px-3 py-1 rounded border border-white/10 text-[9px] font-bold uppercase text-zinc-500 hover:text-white transition-all"
                  >
                    Disconnect Pass
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-8 glow-mesh">
                {children}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
