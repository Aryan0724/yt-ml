"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export function NavbarLight() {
  const [scrolled, setScrolled] = React.useState(false)
  const [hoveredLink, setHoveredLink] = React.useState<string | null>(null)

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 w-full border-b transition-all duration-500 bg-white/80 backdrop-blur-md ${
        scrolled 
          ? "border-zinc-300/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] h-14" 
          : "border-zinc-200 h-16"
      }`}
    >
      <div className="max-w-[1200px] h-full mx-auto flex items-center justify-between px-6 md:px-8">
        
        {/* Logo & Status Badge */}
        <div className="flex items-center gap-4 h-full border-r border-zinc-200 pr-6">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img src="/logo-1.png" alt="preYT" className="h-[36px] w-auto" />
          </Link>
        </div>

        {/* Links */}
        <nav 
          className="hidden md:flex items-center h-full"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {[
            { label: "Features", index: "01", href: "/features" },

            { label: "Changelog", index: "03", href: "/changelog" },
            { label: "Waitlist", index: "04", href: "/waitlist" }
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onMouseEnter={() => setHoveredLink(item.label)}
              className="relative text-[10px] font-mono font-bold text-zinc-500 hover:text-black transition-colors px-5 h-full flex items-center border-r border-zinc-200 last:border-r-0 uppercase tracking-widest"
            >
              <span className="relative z-10">
                <span className="text-[#FF0000] font-semibold mr-1.5">{item.index}.</span>
                {item.label}
              </span>
              {hoveredLink === item.label && (
                <motion.div
                  layoutId="nav-hover-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF0000]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 h-full pl-6 border-l border-zinc-200">
          <Link href="/login" className="text-[10px] font-mono font-bold text-zinc-500 hover:text-black transition-colors uppercase tracking-widest hidden sm:block">
            Login
          </Link>
          <Link
            href="/waitlist"
            className="text-[10px] font-mono font-black text-white bg-black hover:bg-white hover:text-black border border-black px-4 py-2.5 rounded-[4px] transition-all uppercase tracking-widest shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-none"
          >
            Get Started
          </Link>
        </div>
        
      </div>
    </header>
  )
}
