"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Settings, ShieldCheck, Mail, Sparkles, AlertCircle, 
  ToggleLeft, Save, Sliders, ToggleRight, CheckCircle
} from "lucide-react"

export default function AdminSettingsDesk() {
  const [success, setSuccess] = useState(false)
  
  // Settings States
  const [autoApproval, setAutoApproval] = useState(false)
  const [minSubs, setMinSubs] = useState(50000)
  const [comparisonEngine, setComparisonEngine] = useState(true)
  const [posthogTracking, setPosthogTracking] = useState(true)
  const [emailSender, setEmailSender] = useState("contact@integralgroups.in")

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

        {/* Right Column: Resend setup */}
        <div className="lg:col-span-1 p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
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
      </form>
    </div>
  )
}
