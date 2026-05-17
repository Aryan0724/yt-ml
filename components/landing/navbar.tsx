"use client"

import * as React from "react"
import Link from "next/link"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 border-b",
      scrolled ? "bg-background/80 backdrop-blur-xl border-white/10 py-3" : "bg-transparent border-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Zap className="w-6 h-6 text-white transition-transform group-hover:rotate-12" />
          <span className="font-display font-bold text-xl tracking-tight">AlgoPilot</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</Link>
          <Link href="#preview" className="text-sm text-zinc-400 hover:text-white transition-colors">Intelligence</Link>
          <Link href="#waitlist" className="text-sm text-zinc-400 hover:text-white transition-colors">Waitlist</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Beta Login
          </Link>
          <Link 
            href="#waitlist"
            className="px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors"
          >
            Join Closed Beta
          </Link>
        </div>
      </div>
    </nav>
  )
}
