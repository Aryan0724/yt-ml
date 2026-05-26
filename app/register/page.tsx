"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Zap, Sparkles, Play, ChevronRight } from "lucide-react"

const PERKS = [
  { icon: Zap, label: "3–4 AI thumbnail scans per day" },
  { icon: Sparkles, label: "Priority onboarding for established channels" },
  { icon: Play, label: "Early access to upgraded pre-upload prediction engines" },
  { icon: ChevronRight, label: "Direct engineering & workflow intelligence integration" },
]

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans">
      {/* Editorial top bar */}
      <header className="border-b border-zinc-200 h-14 flex items-center justify-between px-8">
        <Link href="/" className="flex items-center">
          <img src="/logo-1.png" alt="preYT" className="h-[26px] w-auto" />
        </Link>
        <div className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest hidden md:block">
          [ BETA INTAKE SYSTEM ]
        </div>
        <Link
          href="/login"
          className="text-[10px] font-mono font-bold text-zinc-500 hover:text-black uppercase tracking-widest transition-colors"
        >
          Already have access? →
        </Link>
      </header>

      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute left-[20%] top-0 bottom-0 w-[1px] bg-zinc-200/50" />
        <div className="absolute right-[20%] top-0 bottom-0 w-[1px] bg-zinc-200/50" />
        <div className="absolute top-[30%] left-0 right-0 h-[1px] bg-zinc-200/40" />
        <div className="absolute bottom-[20%] left-0 right-0 h-[1px] bg-zinc-200/40" />
        <div className="absolute bottom-8 left-8 font-mono text-[8px] text-zinc-300 tracking-widest">[ SYS.REG // 0x002 ]</div>
        <div className="absolute bottom-8 right-8 font-mono text-[8px] text-zinc-300 tracking-widest">[ CLOSED_BETA.v2.1 ]</div>
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-20 relative z-10">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Value proposition */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <div className="text-[9px] font-mono font-bold text-[#FF0000] uppercase tracking-[0.2em] mb-3">
                [ 02 / APPLY_ACCESS ]
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight mb-4">
                Join the<br />
                <span className="text-[#FF0000]">Select Few.</span>
              </h1>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                preYT is reserved for active creators during our early infrastructure phase.
                Applications are reviewed manually by the Integral Groups Studio team.
              </p>
            </div>

            {/* Perks */}
            <div className="space-y-3">
              {PERKS.map((perk, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-3 text-xs font-mono text-zinc-600"
                >
                  <div className="w-6 h-6 rounded-[4px] border border-zinc-200 bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <perk.icon className="w-3 h-3 text-zinc-400" />
                  </div>
                  {perk.label}
                </motion.div>
              ))}
            </div>

            {/* Credits preview */}
            <div className="p-5 rounded-[4px] border border-zinc-200 bg-white shadow-[3px_3px_0px_rgba(0,0,0,0.04)]">
              <div className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3">
                [ DAILY AI CREDITS ]
              </div>
              <div className="flex items-center gap-6">
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
                  Allow preYT to feature your channel and unlock +1 daily scan.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="bg-white border border-zinc-200 rounded-[4px] shadow-[4px_4px_0px_rgba(0,0,0,0.04)] p-8 space-y-6">
              <div>
                <h2 className="font-display font-bold text-xl text-zinc-900 mb-1">Submit Your Application</h2>
                <p className="text-[10px] font-mono text-zinc-400 leading-relaxed uppercase tracking-wider">
                  Fill out the waitlist form to be considered for beta access.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  "Your creator profile & channel details",
                  "Subscriber count & niche category",
                  "Why you want early access",
                  "Optional: showcase consent for +1 credit",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs font-mono text-zinc-600">
                    <div className="w-5 h-5 rounded-[3px] bg-[#FAF9F6] border border-zinc-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[8px] font-bold text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    {step}
                  </div>
                ))}
              </div>

              <Link
                href="/waitlist"
                className="w-full py-3.5 rounded-[4px] bg-black text-white font-mono font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-none"
              >
                Complete Application
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                <span>Already have a pass?</span>
                <Link href="/login" className="text-[#FF0000] hover:text-black transition-colors font-bold">
                  Sign In →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
