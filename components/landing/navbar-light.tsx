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
      className={`fixed top-0 inset-x-0 z-50 w-full border-b transition-all duration-500 bg-white/90 backdrop-blur-md ${
        scrolled 
          ? "border-zinc-300/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] h-14" 
          : "border-zinc-200 h-16"
      }`}
    >
      <div className="max-w-[1200px] h-full mx-auto flex items-center justify-between px-6 md:px-8">
        
        {/* Logo & Status Badge */}
        <div className="flex items-center gap-4 h-full border-r border-zinc-200 pr-6">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img src="/preyt-logo-light.png" alt="preYT" className="h-[28px] sm:h-[32px] w-auto" />
          </Link>
        </div>

        {/* Links */}
        <nav 
          className="hidden md:flex items-center h-full"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {[
            { label: "Features", index: "01", href: "/features" },
            { label: "Intelligence", index: "02", href: "/intelligence" },
            { label: "Thumbnail Lab", index: "03", href: "/tools/youtube-feed-preview" },
            { label: "Pricing", index: "04", href: "/pricing" },
            { label: "Resources", index: "05", href: "/blog" },
            { label: "Changelog", index: "06", href: "/changelog" }
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onMouseEnter={() => setHoveredLink(item.label)}
              className="relative text-[10px] font-mono font-bold text-zinc-600 hover:text-black transition-colors px-4 h-full flex items-center border-r border-zinc-200 last:border-r-0 uppercase tracking-wider"
            >
              <span className="relative z-10">
                <span className="text-[#FF0000] font-semibold mr-1">{item.index}.</span>
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
          <Link href="/login" className="text-[10px] font-mono font-bold text-zinc-600 hover:text-black transition-colors uppercase tracking-widest hidden sm:block">
            Login
          </Link>
          <Link
            href="/signup"
            className="text-[10px] font-mono font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all uppercase tracking-wider shadow-xs"
          >
            Start Free
          </Link>
        </div>
        
      </div>
    </header>
  )
}
