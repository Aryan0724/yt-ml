"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      {/* Editorial header */}
      <header className="border-b border-zinc-200 h-14 flex items-center justify-between px-8">
        <Link href="/" className="flex items-center">
          <img src="/logo-1.png" alt="preYT" className="h-[26px] w-auto" />
        </Link>
        <div className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest hidden md:block">
          [ SYS // ROUTE_ERROR ]
        </div>
        <Link href="/" className="text-[10px] font-mono font-bold text-zinc-500 hover:text-black uppercase tracking-widest transition-colors">
          Return Home →
        </Link>
      </header>

      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute left-[20%] top-0 bottom-0 w-[1px] bg-zinc-200/50" />
        <div className="absolute right-[20%] top-0 bottom-0 w-[1px] bg-zinc-200/50" />
        <div className="absolute top-[40%] left-0 right-0 h-[1px] bg-zinc-200/50" />
        <div className="absolute bottom-8 left-8 font-mono text-[8px] text-zinc-300 tracking-widest">[ ERR.404 // SIGNAL_LOST ]</div>
        <div className="absolute bottom-8 right-8 font-mono text-[8px] text-zinc-300 tracking-widest">[ preYT.v2.1 ]</div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-md"
        >
            <div className="w-16 h-16 rounded-[4px] bg-red-50 border border-red-200 flex items-center justify-center mx-auto shadow-[3px_3px_0px_rgba(255,0,0,0.08)]">
                <AlertTriangle className="w-7 h-7 text-[#FF0000]" />
            </div>
            <div>
              <div className="text-[9px] font-mono font-bold text-[#FF0000] uppercase tracking-[0.2em] mb-3">[ 404 // NOT_FOUND ]</div>
              <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-3">
                Signal <span className="text-[#FF0000]">Lost.</span>
              </h1>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                  The requested coordinates do not correspond to any known intelligence hub.
              </p>
            </div>
            <div className="pt-4">
                <Link 
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-[4px] bg-black text-white font-mono font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-none"
                >
                    <Home className="w-3.5 h-3.5" />
                    Return to Intelligence Hub
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </motion.div>
      </main>
    </div>
  )
}
