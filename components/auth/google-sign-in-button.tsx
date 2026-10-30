"use client"

import React, { useState } from "react"
import { Loader2, AlertCircle, ExternalLink, X } from "lucide-react"

interface GoogleSignInButtonProps {
  label?: string
  className?: string
  redirect?: string
  onSuccess?: () => void
}

export function GoogleSignInButton({
  label = "Continue with Google",
  className = "",
  redirect = "/onboarding",
  onSuccess
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleGoogleClick = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const res = await fetch(`/api/auth/google/url?redirect=${encodeURIComponent(redirect)}`)
      const data = await res.json()

      if (data.configured && data.url) {
        // Official Google OAuth 2.0 flow
        window.location.href = data.url
        return
      }

      // Credentials not yet added to environment
      setShowConfigModal(true)
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate Google authorization")
      setShowConfigModal(true)
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

      {/* Google Cloud OAuth Configuration Required Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="h-1.5 bg-red-600" />
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-950">Google Cloud OAuth Setup Required</h3>
                    <p className="text-xs text-neutral-500">Official Google & YouTube verification is enabled</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-neutral-600 leading-relaxed">
                <p>
                  To request official read-only YouTube channel permissions directly from Google, PreYT requires your Google Cloud OAuth Client ID and Secret in your environment.
                </p>

                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 font-mono text-[11px]">
                  <div className="text-neutral-500 uppercase tracking-wider font-bold">Required Environment Variables:</div>
                  <div className="text-neutral-800">NEXT_PUBLIC_GOOGLE_CLIENT_ID=&lt;your_client_id&gt;.apps.googleusercontent.com</div>
                  <div className="text-neutral-800">GOOGLE_CLIENT_SECRET=GOCSPX-&lt;your_secret&gt;</div>
                  <div className="text-neutral-500 pt-1">Authorized redirect URI:</div>
                  <div className="text-red-700 font-bold break-all">https://preyt.integralgroups.in/api/auth/google/callback</div>
                </div>

                <p className="text-[11px] text-neutral-500">
                  In the meantime, you can sign in instantly using <strong>Email OTP verification</strong> below.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Use Email OTP
                </button>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs"
                >
                  <span>Google Cloud Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
