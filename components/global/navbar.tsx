"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/intelligence", label: "Intelligence" },
  { href: "/blog", label: "Blog" },
  { href: "/changelog", label: "Changelog" },
  { href: "/about", label: "About" },
]

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 border-b",
      scrolled ? "bg-background/80 backdrop-blur-xl border-white/10 py-3" : "bg-transparent border-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo-1.png" alt="preYT" className="h-8 logo-dark-mode transition-transform group-hover:scale-105" />
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={cn(
                "text-sm font-medium transition-colors hover:text-white",
                pathname === link.href ? "text-white" : "text-zinc-400"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link 
            href="/waitlist"
            className="px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Join Waitlist
          </Link>
        </div>

        <button 
          className="lg:hidden p-2 text-zinc-400 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-white/5 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-lg font-medium text-zinc-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-4">
                <Link href="/dashboard" className="text-zinc-400">Sign In</Link>
                <Link href="/waitlist" className="w-full py-3 text-center rounded-xl bg-white text-black font-bold">Join Waitlist</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
