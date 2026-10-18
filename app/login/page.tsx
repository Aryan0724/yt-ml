"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react"
import { loginUser, getStoredSession } from "@/lib/api/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    const session = getStoredSession()
    if (session?.access_token) {
      router.push("/dashboard")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await loginUser(email, password)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-center py-16 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Dot Texture */}
      <div className="absolute inset-0 dot-pattern pointer-events-none opacity-30" />

      {/* Top Subtle Red Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-red-100/30 blur-3xl pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center mb-6 group transition-opacity hover:opacity-90" aria-label="PreYT Home">
          <Image
            src="/preyt-logo-light.png"
            alt="PreYT"
            width={130}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            Sign in to PreYT
          </h1>
          <p className="text-sm text-neutral-600">
            Access your pre-upload creator intelligence workspace.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 border border-neutral-200 card-shadow rounded-2xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div
                className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Email address
              </label>
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Password
                </label>
                <span className="text-xs text-neutral-500 hover:text-neutral-800 cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-600 focus:bg-white text-sm transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="inline-block animate-pulse">Authenticating...</span>
                ) : (
                  <>
                    <span>Sign in to PreYT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-bold text-red-600 hover:text-red-700 transition-colors">
                Create free workspace
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>OFFICIAL YOUTUBE DATA API V3 COMPLIANT · SHA-256 ENCRYPTION</span>
        </div>
      </div>
    </div>
  )
}
