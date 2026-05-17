"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/global/navbar"
import { Footer } from "@/components/global/footer"
import { PageTransition } from "@/components/global/page-transition"
import { Send, CheckCircle2, Play, User, Mail, MessageSquare, ChevronRight, AlertCircle, Users } from "lucide-react"
import { saveWaitlistEntry } from "@/lib/supabase"

export default function WaitlistPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [channelLink, setChannelLink] = useState("")
  const [subscriberCount, setSubscriberCount] = useState("")
  const [niche, setNiche] = useState("Gaming")
  const [uploads, setUploads] = useState("1-4 videos")
  const [reason, setReason] = useState("")

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
          subscriberCount: parseInt(subscriberCount) || 0,
          uploadFrequency: uploads,
          reasonForJoining: reason,
        })
      })

      const payload = await res.json()

      if (res.ok && payload.success) {
        setStatus("success")
      } else {
        throw new Error(payload.error || "Could not persist database registration entry.")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An unexpected error occurred. Please try again.")
      setStatus("idle")
    }
  }

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-44 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-blue-500 font-bold text-xs tracking-widest uppercase mb-4"
              >
                Closed Beta Research Program
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold mb-8">Join the <br /><span className="text-gradient">Select Few.</span></h1>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
                Access to AlgoPilot is reserved for active creators during our early infrastructure phase. Applications are reviewed manually by the Integral Groups Studio engineering team for quality and niche alignment.
              </p>
            </div>

            <div className="space-y-6">
              {[
                "Priority onboarding for established channels",
                "Direct engineering & workflow intelligence integration",
                "Early access to upgraded pre-upload prediction engines",
                "Exclusive explainability and feedback loop systems"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <ChevronRight className="w-3 h-3 text-zinc-500" />
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-zinc-500">
                AlgoPilot is built under the parent studio <span className="text-white font-semibold">Integral Groups Studio</span> as a premier workflow intelligence layer for YouTube creators.
              </p>
            </div>
          </div>

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
                  <h3 className="text-3xl font-bold mb-4">Application Received.</h3>
                  <p className="text-zinc-400 leading-relaxed mb-10 text-sm">
                    Our engineering team manually reviews every application. You will receive a cinematic onboarding link once your AlgoPilot Closed Beta Pass is approved.
                  </p>
                  <button 
                    onClick={() => {
                      setStatus("idle")
                      setName("")
                      setEmail("")
                      setChannelLink("")
                      setReason("")
                    }}
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
                  className="glass-card p-12 border-white/10 space-y-8 premium-shadow"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <User className="w-3 h-3 text-blue-500" /> Full Name
                      </label>
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all text-white placeholder-zinc-600"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-3 h-3 text-blue-500" /> Email
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all text-white placeholder-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Play className="w-3 h-3 text-blue-500" /> YouTube Channel Link
                      </label>
                      <input
                        required
                        type="url"
                        value={channelLink}
                        onChange={(e) => setChannelLink(e.target.value)}
                        placeholder="https://youtube.com/@yourchannel"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all text-white placeholder-zinc-600"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-3 h-3 text-blue-500" /> Subscriber Count
                      </label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={subscriberCount}
                        onChange={(e) => setSubscriberCount(e.target.value)}
                        placeholder="e.g. 42000"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all text-white placeholder-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Primary Niche</label>
                      <select 
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer text-white"
                      >
                        <option value="Gaming">Gaming</option>
                        <option value="Tech">Tech</option>
                        <option value="Education">Education</option>
                        <option value="Vlogs">Vlogs</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Monthly Uploads</label>
                      <select 
                        value={uploads}
                        onChange={(e) => setUploads(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer text-white"
                      >
                        <option value="1-4 videos">1-4 videos</option>
                        <option value="5-10 videos">5-10 videos</option>
                        <option value="10-20 videos">10-20 videos</option>
                        <option value="20+ videos">20+ videos</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare className="w-3 h-3 text-blue-500" /> Why do you want access?
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Tell us about your content optimization goals..."
                      className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all resize-none text-white placeholder-zinc-600"
                    />
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-5 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 relative overflow-hidden disabled:opacity-50"
                  >
                    {status === "submitting" ? (
                      <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        Submit Application
                        <Send className="w-4 h-4" />
                      </>
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
