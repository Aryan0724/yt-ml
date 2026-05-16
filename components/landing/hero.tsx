"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Play } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative pt-44 pb-32 px-6 overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[60%] bg-purple-500/10 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] mask-fade-bottom" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-zinc-400 mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>V1.1-ENSEMBLE now in closed beta</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-8 leading-[0.95]"
            >
              Pre-upload <br />
              <span className="text-gradient">intelligence.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed"
            >
              Analyze thumbnails, titles, confidence, and performance signals before you publish. Professional decision intelligence for serious creators.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link
                href="#waitlist"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center group"
              >
                Join Closed Beta
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#preview"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 bg-white/5 font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                View Demo Analysis
              </Link>
            </motion.div>
          </div>

          {/* Right Side Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="glass-card p-1 border-white/10 shadow-2xl rotate-2">
              <div className="bg-zinc-950 rounded-[14px] overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                  </div>
                  <div className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">Intelligence Audit v4.1</div>
                </div>
                <div className="p-8 space-y-8">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Predictive Score</div>
                      <div className="text-6xl font-display font-bold">88</div>
                    </div>
                    <div className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">S-TIER</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Confidence</div>
                      <div className="text-sm font-semibold">High (±6 pts)</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Reliability</div>
                      <div className="text-sm font-semibold text-emerald-400">Stable</div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-xs text-zinc-400 italic">"Strong curiosity loop detected in hook..."</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-xs text-zinc-400 italic">"Visual contrast meets A-Tier benchmarks."</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -left-12 p-6 glass-card border-white/10 shadow-2xl rotate-[-6deg] z-10"
            >
              <div className="text-[10px] font-bold text-zinc-500 mb-2 uppercase">Viral Probability</div>
              <div className="text-2xl font-bold text-blue-400">92.4%</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
