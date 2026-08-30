"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Sparkles } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="py-24 px-6 bg-[#FAF9F6] flex justify-center border-b border-zinc-200" id="changelog">
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="max-w-[1200px] w-full bg-zinc-950 rounded p-10 lg:p-20 flex flex-col items-center text-center relative overflow-hidden shadow-xl"
      >
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-650/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-2xl relative z-10 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-red-500/15 bg-red-550/5 text-[10px] font-mono font-bold text-[#FF0000] mb-6 tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" /> GET STARTED TODAY
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight font-display">
            Ready to grow <br />
            smarter on <span className="text-[#FF0000]">YouTube</span>?
          </h2>
          
          <p className="text-sm md:text-base text-zinc-400 font-medium leading-relaxed mb-10 mx-auto font-sans">
            Join thousands of creators who are using preYT to predict performance and get more views on every upload.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link
              href="/waitlist"
              className="w-full sm:w-auto px-8 py-4 rounded-[4px] bg-[#FF0000] text-white font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
            >
              Join Waitlist
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-[4px] bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:text-white hover:bg-zinc-800 transition-all"
            >
              <Calendar className="w-4 h-4 mr-2 text-zinc-500" />
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
