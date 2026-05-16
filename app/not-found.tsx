"use client"

import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        {/* Interference Effect */}
        <div className="absolute inset-0 noise-bg opacity-[0.05]" />
        
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 relative z-10"
        >
            <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-12 group">
                <AlertTriangle className="w-10 h-10 text-red-500 group-hover:animate-pulse" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">Signal <span className="text-red-500">Lost.</span></h1>
            <p className="text-zinc-500 text-lg max-w-md mx-auto">
                The requested coordinates do not correspond to any known intelligence hub.
            </p>
            <div className="pt-8">
                <Link 
                    href="/"
                    className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 mx-auto w-fit"
                >
                    <Home className="w-4 h-4" />
                    Return to Intelligence Hub
                </Link>
            </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
