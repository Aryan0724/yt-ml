"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Settings, ShieldCheck, Mail, Sparkles, AlertCircle, 
  ToggleLeft, Save, Sliders, ToggleRight, CheckCircle,
  Link2, Check, ExternalLink
} from "lucide-react"

export default function AdminSettingsDesk() {
  const [success, setSuccess] = useState(false)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false)
  
  // Settings States
  const [autoApproval, setAutoApproval] = useState(false)
  const [minSubs, setMinSubs] = useState(50000)
  const [comparisonEngine, setComparisonEngine] = useState(true)
  const [posthogTracking, setPosthogTracking] = useState(true)
  const [emailSender, setEmailSender] = useState("contact@integralgroups.in")

  // Check URL parameters for successful OAuth redirection flags
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      if (params.get("google_connected") === "true") {
        setGoogleConnected(true)
      }
    }
  }, [])

  const handleConnectGoogle = async () => {
    try {
      setGoogleAuthLoading(true)
      const res = await fetch("/api/admin/google/auth")
      const data = await res.json()
      
      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || "Failed to generate Google auth URL. Check client credentials in .env.")
      }
    } catch (err) {
      console.error("OAuth Init Error:", err)
      alert("Error initiating Google authentication.")
    } finally {
      setGoogleAuthLoading(false)
    }
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    
    // Simulate API persistence write
    setTimeout(() => {
      setSuccess(true)
    }, 500)
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          Administrative Settings <Settings className="w-5 h-5 text-zinc-400" />
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Configure invitation metrics, feature flag toggles, Resend email triggers, and telemetry hooks.</p>
      </div>

      {googleConnected && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Google OAuth2 Pipeline Active</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Your admin control panel has successfully authenticated with your Google account. GSC and GA4 indexes are now linked live!</p>
            </div>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSaveSettings} className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Columns: Configs sheets */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-[2rem] glass-card border-white/5 space-y-8">
            {/* Waitlist controls */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-500" /> Waitlist Vetting Protocols
              </h3>
              
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">Auto-Approve Elite Creators</div>
                  <div className="text-[10px] text-zinc-500">Automatically bypass waitlist triage and email tokens to large channels.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoApproval(!autoApproval)}
                  className="text-zinc-400 hover:text-white transition-all"
                >
                  {autoApproval ? (
                    <ToggleRight className="w-10 h-10 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-zinc-600" />
                  )}
                </button>
              </div>

              {autoApproval && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Minimum Channel Subscriber Threshold</label>
                  <input
                    type="number"
                    value={minSubs}
                    onChange={(e) => setMinSubs(Number(e.target.value))}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white font-mono"
                  />
                </div>
              )}
            </div>

            {/* Platform Feature Flags */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-500" /> Platform Feature Flags
              </h3>

              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">Metadata Comparison Analytics Engine</div>
                  <div className="text-[10px] text-zinc-500">Enable creators to run parallel comparisons of title/thumbnail models.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setComparisonEngine(!comparisonEngine)}
                  className="text-zinc-400 hover:text-white transition-all"
                >
                  {comparisonEngine ? (
                    <ToggleRight className="w-10 h-10 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-zinc-600" />
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">PostHog Event Ingestion Pipeline</div>
                  <div className="text-[10px] text-zinc-500">Stream user click telemetry and search parameters to PostHog servers.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setPosthogTracking(!posthogTracking)}
                  className="text-zinc-400 hover:text-white transition-all"
                >
                  {posthogTracking ? (
                    <ToggleRight className="w-10 h-10 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-zinc-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Save state */}
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Administrative modifications saved successfully. Feature flags updated live.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Configuration Parameters
            </button>
          </div>
        </div>

        {/* Right Column: Google OAuth integration & Resend setup */}
        <div className="lg:col-span-1 space-y-6">
          {/* Google OAuth Panel */}
          <div className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Link2 className="w-4 h-4 text-blue-400" /> Google Connections
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Integrate Google Analytics 4 and GSC using secure OAuth2 login</p>
            </div>

            <div className="pt-2">
              {googleConnected ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Google Account Linked Live</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleConnectGoogle}
                  disabled={googleAuthLoading}
                  className="w-full py-4 rounded-xl bg-blue-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ExternalLink className={`w-4 h-4 ${googleAuthLoading ? "animate-spin" : ""}`} /> 
                  {googleAuthLoading ? "Loading Redirect..." : "🔌 Connect Google Account"}
                </button>
              )}
              <p className="text-[10px] text-zinc-600 mt-3 text-center leading-relaxed">
                Connects your GA4 property and Search Console search performance maps securely. No Service Accounts required.
              </p>
            </div>
          </div>

          {/* Onboarding Template */}
          <div className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" /> Onboarding Template
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Edit email layout sent to approved creators</p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Resend Outbound Email Sender</label>
                <input
                  type="email"
                  value={emailSender}
                  onChange={(e) => setEmailSender(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Greeting Template Preview</span>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-zinc-400 leading-relaxed space-y-3 max-h-48 overflow-y-auto italic">
                  <div className="font-bold text-white not-italic">Subject: Welcome to AlgoPilot Closed Beta</div>
                  <div>Hello {"{full_name}"},</div>
                  <div>Your waitlist application for the Algopilot creator decision beta has been approved by our editorial team!</div>
                  <div>You can access your analytics dashboard immediately here:</div>
                  <div className="text-blue-400 font-mono not-italic">https://algopilot.integralgroups.in/dashboard?token={"{access_token}"}</div>
                  <div>Sincerely,</div>
                  <div className="not-italic">The AlgoPilot Infrastructure Team</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
