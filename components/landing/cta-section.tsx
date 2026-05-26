"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Play, Sparkles, Terminal } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="py-24 px-6 bg-white flex justify-center border-b border-zinc-200" id="changelog">
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="max-w-[1200px] w-full bg-zinc-950 rounded p-10 lg:p-20 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden border border-zinc-900 shadow-[4px_4px_0px_rgba(0,0,0,0.15)]"
      >
        
        {/* Futuristic Grid Overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-650/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Left Column: Interactive Console Cockpit Panel */}
        <div className="w-full lg:w-[48%] relative h-[320px] lg:h-[380px] flex items-center justify-center z-10 mb-12 lg:mb-0">
          
          {/* Main Glass Console Terminal */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-[280px] h-[200px] bg-zinc-900 border border-zinc-800 rounded p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl"
          >
            {/* Top row */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2.5">
              <div className="flex gap-1.5 items-center">
                <Terminal className="w-3.5 h-3.5 text-[#FF0000]" />
                <span className="text-[8px] font-mono font-bold text-zinc-400 tracking-widest uppercase">PREYT // ENG_V2</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Middle body */}
            <div className="flex flex-col gap-1.5 font-mono text-[7.5px] text-zinc-400 leading-relaxed text-left py-2">
              <div>[log] Scanning creator niche parameters...</div>
              <div>[log] Computing click entropy: 94.2% match</div>
              <div className="text-emerald-400 font-bold">[success] Escrow locked: $4.5k SECURED</div>
            </div>

            {/* Bottom stats row */}
            <div className="flex justify-between items-center border-t border-zinc-800 pt-2.5">
              <div>
                <span className="text-[6px] font-mono font-bold text-zinc-500 uppercase block mb-0.5">STATUS</span>
                <span className="text-[9px] font-mono font-bold text-white uppercase">DEPLOYED</span>
              </div>
              <div className="w-6 h-6 rounded bg-red-650 flex items-center justify-center shadow-md">
                <Play className="w-3.5 h-3.5 text-white fill-white translate-x-[0.5px]" />
              </div>
            </div>
          </motion.div>

          {/* Orbiting Icons */}
          <motion.div 
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[18%] left-[12%] w-10 h-10 bg-zinc-900 border border-zinc-850 rounded shadow-xl flex items-center justify-center rotate-12"
          >
            <Play className="w-4 h-4 text-[#FF0000] fill-[#FF0000]" />
          </motion.div>

          <motion.div 
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[16%] right-[10%] w-12 h-12 bg-zinc-900 border border-zinc-850 rounded shadow-xl flex flex-col items-center justify-center p-2.5 -rotate-12"
          >
            <div className="flex items-end gap-1 w-full h-full justify-center">
              <div className="w-1.5 h-4 bg-red-950 rounded-sm" />
              <div className="w-1.5 h-6 bg-red-800 rounded-sm" />
              <div className="w-1.5 h-8 bg-[#FF0000] rounded-sm" />
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3 }}
            className="absolute top-[25%] right-[22%] text-[#FF0000]"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Right Column: CTA Info and Buttons */}
        <div className="w-full lg:w-[48%] max-w-lg relative z-10 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-red-500/15 bg-red-550/5 text-[8.5px] font-mono font-bold text-[#FF0000] mb-5 tracking-widest uppercase">
            [ DEPLOY_MODULE // INSTANT ]
          </div>

          <h2 className="text-3xl md:text-5.5xl font-bold tracking-tight text-white mb-6 leading-tight font-display">
            Ready to grow <br />
            smarter on <span className="text-[#FF0000]">YouTube</span>?
          </h2>
          
          <p className="text-xs md:text-sm text-zinc-400 font-medium leading-relaxed mb-10 max-w-md mx-auto lg:mx-0 font-sans">
            Automate diagnostics, secure software sponsorships, and isolate viewer pacing triggers inside a unified workspace.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/waitlist"
              className="w-full sm:w-auto px-6 py-3 rounded-[4px] bg-white text-black border border-white font-mono font-bold text-[10px] uppercase tracking-widest flex items-center justify-center hover:bg-transparent hover:text-white transition-all shadow-[3px_3px_0px_rgba(255,255,255,0.15)] hover:shadow-none"
            >
              Apply for Beta
              <ArrowRight className="ml-2 w-3.5 h-3.5 text-[#FF0000]" />
            </Link>
            
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-[4px] bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono font-bold text-[10px] uppercase tracking-widest flex items-center justify-center hover:text-white hover:bg-zinc-850 transition-all"
            >
              <Calendar className="w-3.5 h-3.5 mr-2 text-zinc-500" />
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
