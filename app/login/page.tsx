"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Mail,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Youtube,
  Sparkles,
  Loader2,
  RefreshCw,
  CheckCircle2,
  ChevronLeft,
  Lock
} from "lucide-react"
import { loginUser, getStoredSession, sendOtp, verifyOtpCode } from "@/lib/api/auth"
import { trackFunnelEvent } from "@/lib/analytics/events"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
import { YouTubeConnectModal } from "@/components/auth/youtube-connect-modal"
import { OtpInput } from "@/components/auth/otp-input"

type AuthStep = "initial" | "otp" | "password"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectDestination = searchParams.get("redirect") || "/onboarding"

  const [step, setStep] = useState<AuthStep>("initial")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""])
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [debugOtp, setDebugOtp] = useState<string | null>(null)
  const [showYTModal, setShowYTModal] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    trackFunnelEvent("login_page_viewed")
    const session = getStoredSession()
    if (session?.access_token) {
      if (session.user.youtube_channel) {
        router.push("/dashboard")
      } else {
        router.push(redirectDestination)
      }
    }
  }, [router, redirectDestination])

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // STEP 2: Send OTP
  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }

    setError(null)
    setLoading(true)
    setDebugOtp(null)
    trackFunnelEvent("email_login_clicked", { email: email.trim() })

    try {
      const res = await sendOtp(email.trim())
      trackFunnelEvent("otp_sent", { email: email.trim() })
      setStep("otp")
      setResendCooldown(60)
      setOtpDigits(["", "", "", "", "", ""])
      setSuccessMsg(res.message)
      if (res.debugCode) {
        setDebugOtp(res.debugCode)
      }
    } catch (err: any) {
      setError(err.message || "Failed to send verification code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // STEP 5: Auto-verify OTP
  const handleVerifyOtp = async (code: string) => {
    if (code.length !== 6) return
    setError(null)
    setLoading(true)

    try {
      const session = await verifyOtpCode(email.trim(), code)
      trackFunnelEvent("otp_verified", { email: email.trim() })
      trackFunnelEvent("authentication_completed", { method: "email_otp", userId: session.user.id })
      // Check if channel is already linked
      if (session.user.youtube_channel) {
        router.push("/dashboard")
      } else {
        router.push("/onboarding")
      }
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code.")
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return
    setError(null)
    setLoading(true)
    setDebugOtp(null)

    try {
      const res = await sendOtp(email.trim())
      setResendCooldown(60)
      setSuccessMsg(res.message)
      if (res.debugCode) {
        setDebugOtp(res.debugCode)
      }
    } catch (err: any) {
      setError(err.message || "Could not resend code.")
    } finally {
      setLoading(false)
    }
  }

  // Legacy Password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const session = await loginUser(email, password)
      if (session.user.youtube_channel) {
        router.push("/dashboard")
      } else {
        router.push(redirectDestination)
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials.")
    } finally {
      setLoading(false)
    }
  }

  // Mask email helper for UI display
  const maskedEmail = (() => {
    if (!email || !email.includes("@")) return email
    const [name, domain] = email.split("@")
    if (name.length <= 2) return `${name[0]}*@${domain}`
    return `${name.slice(0, 2)}${"*".repeat(Math.max(3, name.length - 3))}${name.slice(-1)}@${domain}`
  })()

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Dot Texture */}
      <div className="absolute inset-0 dot-pattern pointer-events-none opacity-40" />

      {/* Top Subtle Red Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-100/35 blur-3xl pointer-events-none rounded-full" />

      {/* Brand & Headline */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <Link href="/" className="flex items-center justify-center mb-6 group transition-opacity hover:opacity-90" aria-label="PreYT Home">
          <Image
            src="/preyt-logo-light.png"
            alt="PreYT"
            width={140}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 font-sans">
            Understand what makes videos perform.
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-sm mx-auto">
            Your YouTube growth intelligence platform. Analyze your channel, understand competitors and discover what makes content successful.
          </p>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-9 border border-neutral-200/90 shadow-sm rounded-2xl space-y-6">
          
          {/* Section Header */}
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-lg font-bold text-neutral-950 tracking-tight">
              {step === "otp" ? "Enter verification code" : "Welcome to PreYT"}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {step === "otp"
                ? `We sent a single-use 6-digit code to ${maskedEmail}`
                : "Your next breakthrough starts here."}
            </p>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div
              className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && !error && (
            <div
              className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Developer quick-paste chip if email delivered to console */}
          {debugOtp && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
              <span className="font-mono">Demo OTP: <strong>{debugOtp}</strong></span>
              <button
                type="button"
                onClick={() => {
                  const digits = debugOtp.split("")
                  setOtpDigits(digits)
                  handleVerifyOtp(debugOtp)
                }}
                className="text-[11px] font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* STEP 1: INITIAL (GOOGLE + EMAIL) */}
          {step === "initial" && (
            <div className="space-y-4">
              {/* Primary: Continue with Google */}
              <GoogleSignInButton label="CONTINUE WITH GOOGLE" />

              {/* Quick Connect YouTube Channel */}
              <button
                type="button"
                onClick={() => setShowYTModal(true)}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold text-neutral-800 bg-red-50/70 hover:bg-red-50 border border-red-200/80 hover:border-red-300 shadow-xs transition-all cursor-pointer group"
              >
                <Youtube className="w-5 h-5 text-red-600 fill-red-600 group-hover:scale-105 transition-transform" />
                <span>Connect YouTube Channel Directly</span>
              </button>

              {/* Clean Divider */}
              <div className="relative text-center my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <span className="relative bg-white px-3 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Or continue with email
                </span>
              </div>

              {/* Secondary: Email OTP Input */}
              <form onSubmit={handleEmailContinue} className="space-y-3">
                <div>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="creator@channel.com"
                      className="block w-full pl-10 pr-3.5 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-600 focus:bg-white text-sm transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 active:bg-black shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <span>CONTINUE WITH EMAIL</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Password option toggle */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setStep("password")}
                  className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                >
                  Use password instead
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: OTP 6-DIGIT VERIFICATION SCREEN */}
          {step === "otp" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Sent to <strong className="text-neutral-800">{maskedEmail}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setStep("initial")
                    setError(null)
                    setSuccessMsg(null)
                  }}
                  className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  Change email
                </button>
              </div>

              {/* 6-Digit interactive OTP input */}
              <div className="py-2">
                <OtpInput
                  value={otpDigits}
                  onChange={setOtpDigits}
                  onComplete={handleVerifyOtp}
                  disabled={loading}
                  hasError={Boolean(error)}
                />
              </div>

              {/* Auto-verify button fallback */}
              <button
                type="button"
                onClick={() => handleVerifyOtp(otpDigits.join(""))}
                disabled={loading || otpDigits.join("").length !== 6}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Resend OTP with cooldown */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 pt-1">
                <span>Didn&apos;t receive the code?</span>
                {resendCooldown > 0 ? (
                  <span className="font-mono text-neutral-400">Resend in {resendCooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: LEGACY PASSWORD FALLBACK */}
          {step === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep("initial")
                    setError(null)
                  }}
                  className="text-xs text-neutral-500 hover:text-neutral-800 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to OTP login</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@channel.com"
                  className="block w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in with Password"}
              </button>
            </form>
          )}
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>PASSWORDS NOT REQUIRED · SHA-256 OTP ENCRYPTION · YOUTUBE DATA API V3</span>
        </div>
      </div>

      {/* YouTube Channel Connect Modal */}
      <YouTubeConnectModal
        isOpen={showYTModal}
        onClose={() => setShowYTModal(false)}
        title="Sign In with Your YouTube Channel"
        subtitle="Enter your channel handle or URL to instantly authenticate and import your channel stats."
      />
    </div>
  )
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      }
    >
      <LoginContent />
    </React.Suspense>
  )
}
