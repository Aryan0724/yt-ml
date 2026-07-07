"use client"

import { useRef, useCallback } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
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
      className="relative pt-36 pb-32 px-6 overflow-hidden bg-[#FAF9F6] border-b border-zinc-200 flex flex-col items-center justify-center min-h-[600px]"
    >
      {/* ─── 1. SIMPLE GRID BACKGROUND ─── */}
      <div className="absolute inset-0 pointer-events-none z-0">
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
      </div>

      {/* ─── 2. CONTENT AREA ─── */}
      <div className="max-w-[1200px] w-full mx-auto relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-12 mt-12">
        
        {/* status pill in Fragment Mono */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded border border-red-500/10 bg-red-500/5 text-[9px] font-mono font-bold text-[#FF0000] mb-8 tracking-widest uppercase"
        >
          <Sparkles className="w-3 h-3 text-[#FF0000] animate-pulse" />
          [ THE EASIEST WAY TO GROW ]
        </motion.div>

        {/* Center Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.6rem] md:text-[4.2rem] lg:text-[4.6rem] font-bold tracking-tight mb-6 leading-[1.05] text-zinc-900 font-display max-w-4xl"
        >
          Predict your YouTube <br />
          video performance before you <span className="text-[#FF0000]">publish</span>
        </motion.h1>

        {/* Center Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm md:text-base text-zinc-600 max-w-[32rem] mb-10 leading-relaxed font-sans font-medium"
        >
          We give you simple, easy-to-understand advice to get more views and grow your channel faster. No complicated graphs, just results.
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
            className="px-6 py-3 rounded-[4px] bg-black text-white hover:bg-zinc-800 border border-black text-[10px] font-mono font-bold uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
          >
            Apply for Beta
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-[4px] bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-300 text-[10px] font-mono font-bold uppercase tracking-widest transition-all shadow-sm"
          >
            Sign In
          </Link>

        </motion.div>
        
      </div>
    </section>
  )
}
