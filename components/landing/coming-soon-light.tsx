"use client"

import { NavbarLight } from "@/components/landing/navbar-light"
import { FooterLight } from "@/components/landing/footer-light"
import { PageTransition } from "@/components/global/page-transition"
import { motion } from "framer-motion"
import { Hammer } from "lucide-react"

interface ComingSoonLightProps {
  title: string
  description?: string
}

export function ComingSoonLight({ title, description = "We are currently building this experience. Check back soon for updates." }: ComingSoonLightProps) {
  return (
    <PageTransition>
      <NavbarLight />
      <main className="min-h-[70vh] bg-[#FAF9F6] flex items-center justify-center pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 mx-auto mb-8 bg-black rounded-2xl flex items-center justify-center shadow-2xl"
          >
            <Hammer className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-zinc-900 mb-6 tracking-tight"
          >
            {title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-zinc-500 leading-relaxed font-medium"
          >
            {description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 inline-block px-4 py-1.5 text-[10px] font-mono font-bold tracking-widest text-[#FF0000] uppercase border border-red-500/20 bg-red-500/5 rounded"
          >
            [ INTEGRAL GROUPS STUDIO ]
          </motion.div>
        </div>
      </main>
      <FooterLight />
    </PageTransition>
  )
}
