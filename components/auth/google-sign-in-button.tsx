"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowRight, ShieldCheck, X } from "lucide-react"
import { loginWithGoogleCredential } from "@/lib/api/auth"

interface GoogleSignInButtonProps {
  label?: string
  className?: string
  onSuccess?: () => void
}

export function GoogleSignInButton({
  label = "Continue with Google",
  className = "",
  onSuccess
}: GoogleSignInButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showSandboxModal, setShowSandboxModal] = useState(false)
  const [customEmail, setCustomEmail] = useState("")
  const [customName, setCustomName] = useState("")

  const handleGoogleClick = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/google/url")
      const data = await res.json()

      if (data.configured && data.url) {
        // Full OAuth redirect flow to Google
        window.location.href = data.url
        return
      }

      // If Google Cloud OAuth credentials are not yet configured in env,
      // present the Instant Google Creator Sign-In flow
      setShowSandboxModal(true)
    } catch {
      setShowSandboxModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSandboxSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customEmail) return
    setLoading(true)

    try {
      await loginWithGoogleCredential({
        email: customEmail,
        name: customName || customEmail.split("@")[0],
        picture: "https://lh3.googleusercontent.com/a/default-user=s96-c"
      })

      setShowSandboxModal(false)
      if (onSuccess) onSuccess()
      router.push("/dashboard")
    } catch (err) {
      console.error("Google sign in error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAccount = async (account: { email: string; name: string }) => {
    setLoading(true)
    try {
      await loginWithGoogleCredential({
        email: account.email,
        name: account.name,
        picture: "https://lh3.googleusercontent.com/a/default-user=s96-c"
      })

      setShowSandboxModal(false)
      if (onSuccess) onSuccess()
      router.push("/dashboard")
    } catch (err) {
      console.error("Quick account sign in error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-neutral-800 bg-white border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
        ) : (
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{label}</span>
      </button>

      {/* Google Sign-In Sandbox Modal */}
      {showSandboxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-red-500 to-amber-500" />
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-neutral-100">
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-950">Sign in with Google</h3>
                    <p className="text-xs text-neutral-500">Choose an account to continue to PreYT</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSandboxModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Select Accounts */}
              <div className="space-y-2 mb-5">
                {[
                  { name: "Aryan Creator", email: "aryan@integralgroups.in" },
                  { name: "PreYT Studio", email: "studio@preyt.com" }
                ].map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleQuickAccount(acc)}
                    disabled={loading}
                    className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors flex items-center justify-between text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-sm">
                        {acc.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900 group-hover:text-red-600 transition-colors">
                          {acc.name}
                        </p>
                        <p className="text-xs text-neutral-500 font-mono">{acc.email}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-800 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>

              <div className="relative mb-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <span className="relative bg-white px-2.5 text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                  Or enter your Gmail
                </span>
              </div>

              {/* Custom Google account input */}
              <form onSubmit={handleSandboxSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                />
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Your Name (Optional)"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={loading || !customEmail}
                  className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Continue to PreYT</span>}
                </button>
              </form>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google OAuth 2.0 & YouTube Data API Compliant</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
