"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { KeyRound, AlertCircle, ArrowRight, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If already logged in, redirect
  useEffect(() => {
    const localEmail = localStorage.getItem("ap_beta_email")
    const localToken = localStorage.getItem("ap_beta_token")
    if (localEmail && localToken) {
      router.push("/dashboard")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/activity/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          eventType: "login",
          metadata: { path: "/login" }
        }),
      })

      const payload = await res.json()

      if (res.ok && payload.success) {
        localStorage.setItem("ap_beta_email", email.toLowerCase())
        localStorage.setItem("ap_beta_token", token)
        router.push("/dashboard")
      } else {
        if (payload.reason === "pending" || payload.status === "pending") {
          setError("Your application is still under review. Check back soon.")
        } else if (payload.reason === "suspended" || payload.status === "suspended") {
          setError("This beta pass has been suspended. Contact support.")
        } else {
          setError(payload.error || payload.reason || "Invalid credentials. Check your email and token.")
        }
      }
    } catch {
      setError("Connection failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans">
      {/* Editorial top bar */}
      <header className="border-b border-zinc-200 h-14 flex items-center justify-between px-8">
        <Link href="/" className="flex items-center">
          <img src="/logo-1.png" alt="preYT" className="h-[26px] w-auto" />
        </Link>
        <div className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest hidden md:block">
          [ BETA ACCESS PORTAL ]
        </div>
        <Link
          href="/waitlist"
          className="text-[10px] font-mono font-bold text-zinc-500 hover:text-black uppercase tracking-widest transition-colors"
        >
          Apply for Beta →
        </Link>
      </header>

      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute left-[20%] top-0 bottom-0 w-[1px] bg-zinc-200/50" />
        <div className="absolute right-[20%] top-0 bottom-0 w-[1px] bg-zinc-200/50" />
        <div className="absolute top-[35%] left-0 right-0 h-[1px] bg-zinc-200/40" />
        <div className="absolute bottom-[25%] left-0 right-0 h-[1px] bg-zinc-200/40" />
        {/* Corner coordinates */}
        <div className="absolute bottom-8 left-8 font-mono text-[8px] text-zinc-300 tracking-widest">[ SYS.AUTH // 0x001 ]</div>
        <div className="absolute bottom-8 right-8 font-mono text-[8px] text-zinc-300 tracking-widest">[ preYT.v2.1 ]</div>
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-20 relative z-10">
        <div className="w-full max-w-md">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="text-[9px] font-mono font-bold text-[#FF0000] uppercase tracking-[0.2em] mb-3">
              [ 01 / BETA_ACCESS ]
            </div>
            <h1 className="font-display text-4xl font-bold text-zinc-900 tracking-tight mb-2">
              Sign In
            </h1>
            <p className="text-xs font-mono text-zinc-500 leading-relaxed">
              Enter your email and beta pass token to access the Creator Hub.
            </p>
          </motion.div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-zinc-200 rounded-[4px] shadow-[4px_4px_0px_rgba(0,0,0,0.04)] p-8 space-y-6"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@email.com"
                  className="w-full bg-[#FAF9F6] border border-zinc-200 rounded-[4px] px-4 py-3 text-xs font-mono focus:outline-none focus:border-zinc-400 transition-all text-zinc-900 placeholder-zinc-400"
                />
              </div>

              {/* Token */}
              <div className="space-y-2">
                <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-[0.15em] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3 h-3" /> Beta Pass Token
                  </span>
                  <span className="text-[8px] text-zinc-400 font-normal">Begins with bw_</span>
                </label>
                <input
                  required
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="bw_xxxxxxxxxxxx"
                  className="w-full bg-[#FAF9F6] border border-zinc-200 rounded-[4px] px-4 py-3 text-xs font-mono focus:outline-none focus:border-zinc-400 transition-all text-zinc-900 placeholder-zinc-400"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-[4px] bg-red-50 border border-red-200 text-red-600 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-[4px] bg-black text-white font-mono font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-none"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    Validate Credentials
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
              <span>No beta pass?</span>
              <Link href="/waitlist" className="text-[#FF0000] hover:text-black transition-colors font-bold">
                Apply for Access →
              </Link>
            </div>
          </motion.div>

          {/* Footnote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
              preYT is currently in restricted beta.{" "}
              <Link href="/" className="text-zinc-500 hover:text-black transition-colors underline underline-offset-2">
                Learn more
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
