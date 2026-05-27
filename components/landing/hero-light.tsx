"use client"

import { useRef, useCallback } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowRight, Play, Sparkles, ThumbsUp, Bell, Award, CheckCircle } from "lucide-react"
import Link from "next/link"

export function HeroLight() {
  const sectionRef = useRef<HTMLElement>(null)
  
  // Parallax motion tracking for background elements
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 })

  // Transform coordinates for background elements (slower translation for depth)
  const bgTranslateX = useTransform(springX, [-400, 400], [-25, 25])
  const bgTranslateY = useTransform(springY, [-300, 300], [-25, 25])
  
  // Slightly faster translation for outer layer elements
  const midTranslateX = useTransform(springX, [-400, 400], [-15, 15])
  const midTranslateY = useTransform(springY, [-300, 300], [-15, 15])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-36 pb-32 px-6 overflow-hidden bg-[#FAF9F6] border-b border-zinc-200 tech-grid-overlay flex flex-col items-center justify-center min-h-[820px]"
    >
      {/* ─── 1. ARCHITECTURAL EDITORIAL GRID LINES ─── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Horizontal Lines */}
        <div className="absolute top-[18%] left-0 right-0 h-[1px] bg-zinc-200/70" />
        <div className="absolute bottom-[15%] left-0 right-0 h-[1px] bg-zinc-200/70" />
        
        {/* Vertical Lines flanking content column */}
        <div className="absolute left-[8%] lg:left-[15%] xl:left-[20%] top-0 bottom-0 w-[1px] bg-zinc-200/50" />
        <div className="absolute right-[8%] lg:right-[15%] xl:right-[20%] top-0 bottom-0 w-[1px] bg-zinc-200/50" />

        {/* Ambient mesh glows */}
        <motion.div 
          animate={{ x: [-10, 10, -10], y: [-15, 15, -15] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] left-[20%] w-[500px] h-[500px] bg-[#FF0000]/[0.02] rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [15, -15, 15], y: [10, -10, 10] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[5%] right-[18%] w-[550px] h-[550px] bg-amber-500/[0.015] rounded-full blur-[110px]" 
        />
        
        {/* Technical coordinates labels in Fragment Mono */}
        <div className="absolute top-24 left-10 text-zinc-400 font-mono text-[8px] select-none tracking-widest font-medium">[ LAT. 42.083 N ]</div>
        <div className="absolute top-24 right-10 text-zinc-400 font-mono text-[8px] select-none tracking-widest font-medium">[ GRID_REF.YT_01 ]</div>
      </div>

      {/* ─── 2. PREDICTIVE CURVE (BACKGROUND ACCENT) ─── */}
      <svg className="absolute inset-x-0 top-[32%] w-full h-[320px] pointer-events-none z-0 overflow-visible opacity-70" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <defs>
          <linearGradient id="curve-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E4E4E7" stopOpacity="0.1" />
            <stop offset="40%" stopColor="#FECACA" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#FF0000" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#FDE68A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E4E4E7" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="glow-pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF0000" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF0000" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF0000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path 
          d="M -60,200 C 350,90 480,260 720,150 C 960,40 1090,240 1500,100" 
          fill="none" 
          stroke="url(#curve-grad)" 
          strokeWidth="1.25" 
          strokeDasharray="5 5"
        />
        <motion.path 
          d="M -60,200 C 350,90 480,260 720,150 C 960,40 1090,240 1500,100" 
          fill="none" 
          stroke="url(#glow-pulse-grad)" 
          strokeWidth="2" 
          strokeDasharray="50 250"
          strokeLinecap="round"
          animate={{ strokeDashoffset: [0, -300] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* ─── 3. CONTENT AREA ─── */}
      <div className="max-w-[1200px] w-full mx-auto relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-12">
        
        {/* ─── FLOATING PREMIUM EDITORIAL CARDS ─── */}
        
        {/* Play Capsule (Top Left) */}
        <motion.div
          style={{ x: bgTranslateX, y: bgTranslateY }}
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.03 }}
          className="absolute left-[1%] xl:left-[-6%] top-[8%] hidden md:flex flex-col gap-1 items-start bg-white border border-zinc-200 rounded p-3 shadow-[3px_3px_0px_rgba(0,0,0,0.06)] min-w-[100px] text-left"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-[7px] font-mono font-bold text-zinc-400 uppercase tracking-widest">SCAN_MODE</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-zinc-800 flex items-center gap-1 mt-1">
            <Play className="w-3 h-3 text-[#FF0000] fill-[#FF0000] translate-x-[0.5px]" /> 
            ACTIVE
          </span>
        </motion.div>

        {/* Verified Milestone (Top Right) */}
        <motion.div
          style={{ x: midTranslateX, y: midTranslateY }}
          animate={{ y: [6, -6, 6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.03 }}
          className="absolute right-[1%] xl:right-[-6%] top-[5%] hidden md:flex items-center gap-3 bg-white border border-zinc-200 rounded p-3 shadow-[3px_3px_0px_rgba(0,0,0,0.06)] cursor-default text-left"
        >
          <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-white text-[10px] font-mono border border-zinc-800">
            ★
          </div>
          <div>
            <span className="text-[6.5px] font-mono font-bold text-zinc-400 uppercase block tracking-wider leading-none">Milestone</span>
            <span className="text-[9px] font-mono font-bold text-zinc-800 flex items-center gap-1 leading-none mt-1">
              10M AUDIENCE <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-50" />
            </span>
          </div>
        </motion.div>

        {/* Small Play Dot (Mid Left) */}
        <motion.div
          style={{ x: bgTranslateX, y: bgTranslateY }}
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[6%] xl:left-[-11%] top-[38%] hidden lg:flex w-8 h-8 rounded border border-zinc-200 bg-white shadow-[2px_2px_0px_rgba(0,0,0,0.04)] items-center justify-center"
        >
          <Play className="w-2.5 h-2.5 text-[#FF0000] fill-[#FF0000] translate-x-[0.5px]" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        </motion.div>

        {/* Views Velocity Chart (Bottom Left) */}
        <motion.div
          style={{ x: midTranslateX, y: midTranslateY }}
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.03 }}
          className="absolute left-[0%] xl:left-[-7%] bottom-[15%] hidden md:flex flex-col gap-1 px-3 py-3 rounded bg-white border border-zinc-200 shadow-[3px_3px_0px_rgba(0,0,0,0.06)] min-w-[145px] cursor-default text-left relative overflow-hidden"
        >
          <span className="text-[7px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Velocity logs</span>
          <span className="text-xs font-mono font-bold text-zinc-800 mt-0.5">+185.2K<span className="text-[8px] text-emerald-600 font-bold ml-0.5">/h</span></span>
          <div className="h-5 w-full mt-1.5 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,20 L0,14 L20,11 L40,3 L60,15 L80,1 L100,4 L100,20 Z" fill="rgba(255,0,0,0.03)" />
              <path d="M0,14 L20,11 L40,3 L60,15 L80,1 L100,4" fill="none" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>

        {/* Bell Notification (Bottom Right) */}
        <motion.div
          style={{ x: bgTranslateX, y: bgTranslateY }}
          animate={{ y: [5, -5, 5] }}
          whileHover={{ rotate: [-6, 6, -6, 0], scale: 1.05 }}
          transition={{ y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 0.3 } }}
          className="absolute right-[0%] xl:right-[-7%] bottom-[17%] hidden md:flex w-9 h-9 rounded bg-white border border-zinc-200 shadow-[3px_3px_0px_rgba(0,0,0,0.06)] items-center justify-center cursor-default"
        >
          <Bell className="w-4 h-4 text-amber-500" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#FF0000] rounded-full border border-white flex items-center justify-center">
            <span className="text-[5px] font-mono font-bold text-white leading-none">!</span>
          </div>
        </motion.div>

        {/* Thumbs Up (Mid Right) */}
        <motion.div
          style={{ x: midTranslateX, y: midTranslateY }}
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.03 }}
          className="absolute right-[5%] xl:right-[-10%] top-[38%] hidden lg:flex items-center gap-1.5 bg-white border border-zinc-200 rounded px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.04)] cursor-default text-left"
        >
          <ThumbsUp className="w-3 h-3 text-blue-500 fill-blue-50" />
          <span className="text-[8px] font-mono font-bold text-zinc-650 tracking-wider">1.2M INCOMING</span>
        </motion.div>

        {/* ─── TYPOGRAPHY CONTENT ─── */}

        {/* status pill in Fragment Mono */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded border border-red-500/10 bg-red-500/5 text-[9px] font-mono font-bold text-[#FF0000] mb-8 tracking-widest uppercase"
        >
          <Sparkles className="w-3 h-3 text-[#FF0000] animate-pulse" />
          [ AN INTEGRAL GROUPS STUDIO PRODUCT ]
        </motion.div>

        {/* Center Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.6rem] md:text-[4.2rem] lg:text-[4.6rem] font-bold tracking-tight mb-6 leading-[1.05] text-zinc-900 font-display max-w-4xl"
        >
          Predict performance <br />
          before you <span className="font-mono italic font-normal text-[#FF0000] lowercase relative">publish<span className="absolute bottom-1 left-0 right-0 h-[2px] bg-red-500/20" /></span>
        </motion.h1>

        {/* Center Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs md:text-sm text-zinc-500 max-w-[28rem] mb-10 leading-relaxed font-sans font-medium"
        >
          Evaluate click-velocity concepts, test visual thumbnail prominence, and isolate verbal retention leaks before publishing.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-row gap-4 justify-center items-center relative z-20"
        >
          <Link
            href="/waitlist"
            className="px-6 py-3 rounded-[4px] bg-black text-white hover:bg-white hover:text-black border border-black text-[10px] font-mono font-bold uppercase tracking-widest transition-all shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-none flex items-center gap-2"
          >
            Apply for Beta
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-[4px] bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200 text-[10px] font-mono font-bold uppercase tracking-widest transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.04)]"
          >
            Sign In
          </Link>

        </motion.div>
        
      </div>
    </section>
  )
}
