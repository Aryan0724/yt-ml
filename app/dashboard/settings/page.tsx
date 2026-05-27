"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Loader2 } from "lucide-react"

export default function DashboardSettingsPage() {
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // Fetch initial profile
    const email = localStorage.getItem("beta_email")
    const token = localStorage.getItem("beta_token")
    if (email && token) {
      fetch("/api/creator/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile) {
          // Default to false if not set
          setAgreed(!!data.profile.consent_public_showcase)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const handleToggle = async (newVal: boolean) => {
    setAgreed(newVal)
    setSaving(true)
    setError(null)
    const email = localStorage.getItem("beta_email")
    const token = localStorage.getItem("beta_token")

    try {
      const res = await fetch("/api/creator/portfolio-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, agreed: newVal })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save settings")
    } catch (err: any) {
      setError(err.message)
      setAgreed(!newVal) // revert
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <h1 className="text-3xl font-display font-bold text-zinc-900 mb-2">Account Settings</h1>
      <p className="text-zinc-500 mb-10">Manage your preYT creator account preferences.</p>

      {loading ? (
        <div className="flex items-center gap-2 text-zinc-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading settings...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-zinc-900" />
                <h3 className="text-lg font-bold text-zinc-900 font-display">Portfolio Showcase</h3>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
                Allow Integral Groups Studio to feature your YouTube channel on the preYT public landing page as a trusted creator. This helps showcase our growing community.
              </p>
              {error && (
                <p className="text-red-500 text-xs mt-2 font-mono">{error}</p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {saving && <Loader2 className="w-3 h-3 text-zinc-400 animate-spin" />}
              <button
                onClick={() => handleToggle(!agreed)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${agreed ? 'bg-black' : 'bg-zinc-200'}`}
              >
                <span className="sr-only">Enable portfolio feature</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${agreed ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
