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
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 transition-transform group-hover:scale-105">
            <path d="M50 12 L15 85 L35 85 L50 50 L65 85 L85 85 Z" fill="currentColor" />
            <path d="M25 85 L50 65 L60 65 L35 85 Z" fill="hsl(var(--primary))" />
          </svg>
          <span className="font-display font-bold text-2xl tracking-tight">
            <span className="text-foreground">Algo</span>
            <span className="text-primary">Pilot</span>
          </span>
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
