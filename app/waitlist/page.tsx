"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { NavbarLight } from "@/components/landing/navbar-light"
import { Footer } from "@/components/landing/footer"
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
      <NavbarLight />
      <main className="pt-28 pb-32 px-6 bg-[#FAF9F6] min-h-screen">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Copy */}
          <div className="space-y-10">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[9px] font-mono font-bold text-[#FF0000] uppercase tracking-[0.2em] mb-4"
              >
                [ 01 / CLOSED_BETA_INTAKE ]
              </motion.div>
              <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-zinc-900 tracking-tight">
                Join the <br />
                <span className="text-[#FF0000]">Select Few.</span>
              </h1>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed max-w-lg">
                Access to preYT is reserved for active creators during our early infrastructure phase.
                Waitlist requests are reviewed manually by the Integral Groups Studio engineering team.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: Zap, label: "3–4 AI thumbnail scans per day" },
                { icon: Sparkles, label: "Priority onboarding for established channels" },
                { icon: ChevronRight, label: "Direct engineering & workflow intelligence integration" },
                { icon: ChevronRight, label: "Early access to upgraded pre-upload prediction engines" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-mono text-zinc-600">
                  <div className="w-6 h-6 rounded-[3px] bg-white border border-zinc-200 flex items-center justify-center shadow-sm flex-shrink-0">
                    <item.icon className="w-3 h-3 text-zinc-400" />
                  </div>
                  {item.label}
                </div>
              ))}
            </div>

            {/* Credit preview */}
            <div className="p-5 rounded-[4px] border border-zinc-200 bg-white shadow-[3px_3px_0px_rgba(0,0,0,0.04)] space-y-3">
              <div className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">[ Daily AI Credits ]</div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold font-display text-zinc-900">3</div>
                  <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mt-1">Standard</div>
                </div>
                <div className="text-zinc-300 font-mono">→</div>
                <div className="text-center">
                  <div className="text-3xl font-bold font-display text-emerald-600">4</div>
                  <div className="text-[9px] font-mono text-emerald-600 uppercase tracking-wider mt-1">With Showcase</div>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 leading-relaxed flex-1">
                  Allow preYT to publicly feature your channel and unlock +1 daily scan.
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
                  className="bg-white border border-emerald-200 rounded-[4px] shadow-[4px_4px_0px_rgba(0,0,0,0.04)] p-16 text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-[4px] flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-3xl font-bold mb-2 text-zinc-900">Application Received.</h3>
                  <p className="text-zinc-500 text-xs font-mono mb-6">Your beta profile is under review by our engineering team.</p>

                  {/* Credits granted indicator */}
                  <div className="p-4 rounded-[4px] bg-[#FAF9F6] border border-zinc-200 mb-8 space-y-2">
                    <div className="flex items-center justify-center gap-2 text-zinc-900 font-bold text-sm">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>{creditsGranted} daily AI scans assigned</span>
                    </div>
                    {showcaseBonus && (
                      <div className="text-xs text-emerald-400 font-semibold">
                        ✅ +1 showcase credit unlocked — thanks for supporting preYT!
                      </div>
                    )}
                  </div>

                  <button
                    onClick={resetForm}
                    className="px-8 py-3 rounded-[4px] border border-zinc-200 text-xs font-mono font-bold hover:bg-zinc-50 transition-all text-zinc-700 uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,0.06)] hover:shadow-none"
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
                  className="bg-white border border-zinc-200 rounded-[4px] shadow-[4px_4px_0px_rgba(0,0,0,0.04)] p-8 space-y-6"
                >
                  {/* Name + Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                        <User className="w-3 h-3" /> Full Name
                      </label>
                      <input
                        required type="text" value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-[#FAF9F6] border border-zinc-200 rounded-[4px] px-4 py-3 text-xs font-mono focus:outline-none focus:border-zinc-400 transition-all text-zinc-900 placeholder-zinc-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                        <Mail className="w-3 h-3" /> Email
                      </label>
                      <input
                        required type="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full bg-[#FAF9F6] border border-zinc-200 rounded-[4px] px-4 py-3 text-xs font-mono focus:outline-none focus:border-zinc-400 transition-all text-zinc-900 placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Channel + Subs */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                        <Play className="w-3 h-3" /> YouTube Channel
                      </label>
                      <input
                        required type="url" value={channelLink}
                        onChange={(e) => setChannelLink(e.target.value)}
                        placeholder="https://youtube.com/@channel"
                        className="w-full bg-[#FAF9F6] border border-zinc-200 rounded-[4px] px-4 py-3 text-xs font-mono focus:outline-none focus:border-zinc-400 transition-all text-zinc-900 placeholder-zinc-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                        <Users className="w-3 h-3" /> Subscribers
                      </label>
                      <input
                        required type="number" min="0" value={subscriberCount}
                        onChange={(e) => setSubscriberCount(e.target.value)}
                        placeholder="e.g. 42000"
                        className="w-full bg-[#FAF9F6] border border-zinc-200 rounded-[4px] px-4 py-3 text-xs font-mono focus:outline-none focus:border-zinc-400 transition-all text-zinc-900 placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Niche + Country */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-[0.15em]">Niche</label>
                      <select
                        value={niche} onChange={(e) => setNiche(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-zinc-200 rounded-[4px] px-4 py-3 text-xs font-mono focus:outline-none focus:border-zinc-400 transition-all appearance-none cursor-pointer text-zinc-900"
                      >
                        {NICHES.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                        <Globe className="w-3 h-3" /> Country
                      </label>
                      <select
                        value={country} onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-zinc-200 rounded-[4px] px-4 py-3 text-xs font-mono focus:outline-none focus:border-zinc-400 transition-all appearance-none cursor-pointer text-zinc-900"
                      >
                        {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Why join */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" /> Why do you want access?
                    </label>
                    <textarea
                      rows={3} required value={whyJoin}
                      onChange={(e) => setWhyJoin(e.target.value)}
                      placeholder="Tell us about your content goals..."
                      className="w-full bg-[#FAF9F6] border border-zinc-200 rounded-[4px] px-4 py-3 text-xs font-mono focus:outline-none focus:border-zinc-400 transition-all resize-none text-zinc-900 placeholder-zinc-400"
                    />
                  </div>

                  {/* Showcase consent toggle */}
                  <button
                    type="button"
                    onClick={() => setConsent(!consent)}
                    className={`w-full p-4 rounded-[4px] border text-left transition-all flex items-start gap-3 ${
                      consent
                        ? "bg-emerald-50 border-emerald-300"
                        : "bg-[#FAF9F6] border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-[3px] border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        consent ? "bg-emerald-500 border-emerald-500" : "border-zinc-300"
                      }`}
                    >
                      {consent && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <div>
                      <div className={`text-xs font-mono font-bold mb-1 ${consent ? "text-emerald-700" : "text-zinc-700"}`}>
                        Allow preYT to publicly showcase my channel
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400 leading-relaxed">
                        Let us feature your channel as a success example in our marketing and case studies.
                      </div>
                      {consent && (
                        <div className="mt-1.5 text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5" /> +1 daily AI scan credit unlocked!
                        </div>
                      )}
                    </div>
                  </button>

                  {error && (
                    <div className="p-3 rounded-[4px] bg-red-50 border border-red-200 text-red-600 text-xs font-mono flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-3.5 rounded-[4px] bg-black text-white font-mono font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-none"
                  >
                    {status === "submitting" ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Submit Application <Send className="w-3.5 h-3.5" /></>
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
