"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Play, Youtube, TrendingUp, Target } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative pt-44 pb-32 px-6 overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[0%] left-[20%] w-[40%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[60%] bg-red-600/10 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] mask-fade-bottom" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        
        {/* Revolving YouTube-like Logo Animation */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden md:block z-0"
        >
          {/* Orbiting Play Button */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-12 bg-primary/20 backdrop-blur-md border border-primary/50 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.5)]"
          >
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
          </motion.div>

          {/* Orbiting Tech Vector */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-0 translate-x-1/2 translate-y-1/2 w-12 h-12 bg-white/5 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center"
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </motion.div>
        </motion.div>

        {/* Center Text Block */}
        <div className="flex flex-col items-center text-center relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-medium text-white mb-8 shadow-[0_0_20px_rgba(255,0,0,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>V1.1-ENSEMBLE now in closed beta</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, type: "spring" }}
            className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-8 leading-[0.95] drop-shadow-2xl"
          >
            Pre-upload <br />
            <span className="text-primary glow-text relative">
              intelligence
            </span> <br />
            <span className="text-sm font-semibold tracking-widest text-zinc-500 uppercase block mt-6">for serious creators.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed"
          >
            Analyze thumbnails, titles, confidence, volatility, and performance signals before you publish. Built under the parent studio Integral Groups.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/waitlist"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-bold hover:bg-red-600 hover:scale-105 transition-all flex items-center justify-center group shadow-[0_0_40px_rgba(255,0,0,0.4)]"
            >
              Join Closed Beta
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#preview"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 bg-white/5 font-bold hover:bg-white/10 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              View Demo Analysis
            </Link>
          </motion.div>
        </div>

        {/* Dynamic Floating Side Vectors (Content on the side) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none hidden lg:block z-0">
          <motion.div
            animate={{ y: [-20, 20, -20], rotate: [-5, 5, -5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[5%] p-4 rounded-2xl glass-card border-white/10"
          >
            <Target className="w-8 h-8 text-primary" />
          </motion.div>

          <motion.div
            animate={{ y: [20, -20, 20], rotate: [5, -5, 5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] right-[5%] p-4 rounded-2xl glass-card border-white/10"
          >
            <Youtube className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] left-[15%] text-5xl font-bold text-primary/20 font-display"
          >
            98.5%
          </motion.div>
        </div>
      </div>
    </section>
  )
}
