"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/global/navbar"
import { Footer } from "@/components/global/footer"
import { PageTransition } from "@/components/global/page-transition"
import { Send, CheckCircle2, Play, User, Mail, MessageSquare, ChevronRight } from "lucide-react"

export default function WaitlistPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    setTimeout(() => setStatus("success"), 2000)
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
                className="text-zinc-500 font-bold text-xs tracking-widest uppercase mb-4"
              >
                Closed Beta Enrollment
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold mb-8">Join the <br /><span className="text-gradient">Select Few.</span></h1>
              <p className="text-zinc-400 text-xl leading-relaxed max-w-lg">
                Access to Diamond Intelligence is limited to active creators during our engineering phase. Applications are reviewed manually for quality and niche alignment.
              </p>
            </div>

            <div className="space-y-6">
              {[
                "Priority for established channels",
                "Direct engineering support",
                "Early access to new intelligence models",
                "Exclusive feedback loop integration"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <ChevronRight className="w-3 h-3 text-zinc-500" />
                  </div>
                  {item}
                </div>
              ))}
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
                  <p className="text-zinc-400 leading-relaxed mb-10">
                    Our team is reviewing your channel. You'll receive a cinematic onboarding link once your Diamond Beta Pass is ready.
                  </p>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="px-8 py-3 rounded-full border border-white/10 text-sm font-bold hover:bg-white/5 transition-all"
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
                        <User className="w-3 h-3" /> Full Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Enter your name"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Email
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="name@email.com"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Play className="w-3 h-3" /> Play Channel Link
                    </label>
                    <input
                      required
                      type="url"
                      placeholder="Play.com/@yourchannel"
                      className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Primary Niche</label>
                      <select className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer">
                        <option>Gaming</option>
                        <option>Tech</option>
                        <option>Education</option>
                        <option>Vlogs</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Monthly Uploads</label>
                      <select className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer">
                        <option>1-4 videos</option>
                        <option>5-10 videos</option>
                        <option>10-20 videos</option>
                        <option>20+ videos</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" /> Why do you want access?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your content goals..."
                      className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all resize-none"
                    />
                  </div>

                  <button
                    disabled={status === "submitting"}
                    className="w-full py-5 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
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
