"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/global/navbar"
import { Footer } from "@/components/global/footer"
import { PageTransition } from "@/components/global/page-transition"
import {
  Send, CheckCircle2, Play, User, Mail, MessageSquare,
  ChevronRight, AlertCircle, Users, Globe, Sparkles, Zap
} from "lucide-react"

const COUNTRIES = [
  "United States", "India", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Brazil", "Japan", "South Korea", "Indonesia",
  "Pakistan", "Bangladesh", "Nigeria", "Philippines", "Mexico",
  "Russia", "Turkey", "Vietnam", "Thailand", "Egypt", "Saudi Arabia",
  "UAE", "Argentina", "Colombia", "Poland", "Netherlands", "Spain",
  "Italy", "Sweden", "Norway", "Denmark", "Finland", "Singapore",
  "Malaysia", "South Africa", "Kenya", "Ghana", "Ethiopia", "Other"
]

const NICHES = [
  "Gaming", "Tech", "Education", "Vlogs", "Finance", "Fitness",
  "Comedy", "Music", "Cooking", "Travel", "Beauty", "Fashion",
  "Sports", "News", "Podcasts", "Animation", "Science", "Other"
]

export default function WaitlistPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")
  const [error, setError] = useState<string | null>(null)
  const [creditsGranted, setCreditsGranted] = useState(3)
  const [showcaseBonus, setShowcaseBonus] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [channelLink, setChannelLink] = useState("")
  const [subscriberCount, setSubscriberCount] = useState("")
  const [niche, setNiche] = useState("Gaming")
  const [country, setCountry] = useState("India")
  const [whyJoin, setWhyJoin] = useState("")
  const [consent, setConsent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    setError(null)

    try {
      const res = await fetch("/api/waitlist/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          youtubeChannel: channelLink,
          niche,
          country,
          subscriberCount: parseInt(subscriberCount) || 0,
          whyJoin,
          consentPublicShowcase: consent,
        }),
      })

      const payload = await res.json()

      if (res.ok && payload.success) {
        setCreditsGranted(payload.creditsAssigned || 3)
        setShowcaseBonus(payload.showcaseBonus || false)
        setStatus("success")
      } else {
        throw new Error(payload.error || "Submission failed. Please try again.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
      setStatus("idle")
    }
  }

  const resetForm = () => {
    setStatus("idle")
    setName(""); setEmail(""); setChannelLink(""); setWhyJoin("")
    setSubscriberCount(""); setConsent(false)
  }

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-44 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Copy */}
          <div className="space-y-10">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-blue-500 font-bold text-xs tracking-widest uppercase mb-4"
              >
                Closed Beta Research Program
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold mb-8">
                Join the <br />
                <span className="text-gradient">Select Few.</span>
              </h1>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
                Access to AlgoPilot is reserved for active creators during our early infrastructure phase.
                Applications are reviewed manually by the Integral Groups Studio engineering team.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Zap, label: "3–4 AI thumbnail scans per day" },
                { icon: Sparkles, label: "Priority onboarding for established channels" },
                { icon: ChevronRight, label: "Direct engineering & workflow intelligence integration" },
                { icon: ChevronRight, label: "Early access to upgraded pre-upload prediction engines" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <item.icon className="w-3 h-3 text-zinc-500" />
                  </div>
                  {item.label}
                </div>
              ))}
            </div>

            {/* Credit preview */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Daily AI Credits</div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">3</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Standard</div>
                </div>
                <div className="text-zinc-700">→</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">4</div>
                  <div className="text-[10px] text-emerald-600 uppercase tracking-wider">With Showcase</div>
                </div>
                <div className="text-xs text-zinc-500 leading-relaxed">
                  Allow AlgoPilot to publicly feature your channel and unlock +1 daily scan.
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-16 text-center border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/30" />
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Application Received.</h3>
                  <p className="text-zinc-400 text-sm mb-6">Your beta profile is under review by our engineering team.</p>

                  {/* Credits granted indicator */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-8 space-y-2">
                    <div className="flex items-center justify-center gap-2 text-white font-bold">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>{creditsGranted} daily AI scans assigned</span>
                    </div>
                    {showcaseBonus && (
                      <div className="text-xs text-emerald-400 font-semibold">
                        ✅ +1 showcase credit unlocked — thanks for supporting AlgoPilot!
                      </div>
                    )}
                  </div>

                  <button
                    onClick={resetForm}
                    className="px-8 py-3 rounded-full border border-white/10 text-sm font-bold hover:bg-white/5 transition-all text-white"
                  >
                    Submit Another Application
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="glass-card p-10 border-white/10 space-y-6 premium-shadow"
                >
                  {/* Name + Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <User className="w-3 h-3 text-blue-500" /> Full Name
                      </label>
                      <input
                        required type="text" value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all text-white placeholder-zinc-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-3 h-3 text-blue-500" /> Email
                      </label>
                      <input
                        required type="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all text-white placeholder-zinc-600"
                      />
                    </div>
                  </div>

                  {/* Channel + Subs */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Play className="w-3 h-3 text-blue-500" /> YouTube Channel
                      </label>
                      <input
                        required type="url" value={channelLink}
                        onChange={(e) => setChannelLink(e.target.value)}
                        placeholder="https://youtube.com/@channel"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all text-white placeholder-zinc-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-3 h-3 text-blue-500" /> Subscribers
                      </label>
                      <input
                        required type="number" min="0" value={subscriberCount}
                        onChange={(e) => setSubscriberCount(e.target.value)}
                        placeholder="e.g. 42000"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all text-white placeholder-zinc-600"
                      />
                    </div>
                  </div>

                  {/* Niche + Country */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Niche</label>
                      <select
                        value={niche} onChange={(e) => setNiche(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer text-white"
                      >
                        {NICHES.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Globe className="w-3 h-3 text-blue-500" /> Country
                      </label>
                      <select
                        value={country} onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer text-white"
                      >
                        {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Why join */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare className="w-3 h-3 text-blue-500" /> Why do you want access?
                    </label>
                    <textarea
                      rows={3} required value={whyJoin}
                      onChange={(e) => setWhyJoin(e.target.value)}
                      placeholder="Tell us about your content goals..."
                      className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all resize-none text-white placeholder-zinc-600"
                    />
                  </div>

                  {/* Showcase consent toggle */}
                  <button
                    type="button"
                    onClick={() => setConsent(!consent)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                      consent
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-white/[0.02] border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        consent ? "bg-emerald-500 border-emerald-500" : "border-zinc-600"
                      }`}
                    >
                      {consent && <CheckCircle2 className="w-3 h-3 text-black" />}
                    </div>
                    <div>
                      <div className={`text-sm font-bold mb-1 ${consent ? "text-emerald-400" : "text-white"}`}>
                        Allow AlgoPilot to publicly showcase my channel
                      </div>
                      <div className="text-xs text-zinc-500 leading-relaxed">
                        Let us feature your channel as a success example in our marketing and case studies.
                      </div>
                      {consent && (
                        <div className="mt-2 text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                          <Zap className="w-3 h-3" /> +1 daily AI scan credit unlocked!
                        </div>
                      )}
                    </div>
                  </button>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-5 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {status === "submitting" ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>Submit Application <Send className="w-4 h-4" /></>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  )
}
