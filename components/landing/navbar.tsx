"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="landing-col pt-8 pb-6 md:pt-10 md:pb-8 flex items-center justify-between relative z-20">
      {/* Brand Mark / Logo glowing white on YouTube dark gradient */}
      <Link href="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-90" aria-label="PreYT Home">
        <Image
          src="/preyt-logo-dark.png"
          alt="PreYT"
          width={116}
          height={36}
          className="h-8 sm:h-9 w-auto object-contain"
          priority
        />
      </Link>

      {/* Terms.so Floating Glassmorphic Pill Rail */}
      <nav aria-label="Main" className="hidden md:flex items-center">
        <div className="pill-navigation-rail-hero">
          <Link
            href="/#why-preyt"
            className="action-button action-button--hero-ghost text-sm font-medium"
          >
            Why PreYT
          </Link>
          <Link
            href="/#capabilities"
            className="action-button action-button--hero-ghost text-sm font-medium"
          >
            Features
          </Link>
          <Link
            href="/blog"
            className="action-button action-button--hero-ghost text-sm font-medium"
          >
            Resources
          </Link>
          <Link
            href="/#contact"
            className="action-button action-button--hero-ghost text-sm font-medium"
          >
            Contact
          </Link>
          <Link
            href="/login"
            className="action-button action-button--hero-ghost text-sm font-medium"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="action-button action-button--hero-solid text-sm font-semibold shadow-xs"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div className="absolute top-20 left-4 right-4 z-50 bg-[#180204]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-2xl space-y-3 md:hidden text-white">
          <Link
            href="/#why-preyt"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            Why PreYT
          </Link>
          <Link
            href="/#capabilities"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            Features
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            Resources & Blog
          </Link>
          <Link
            href="/#contact"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            Contact
          </Link>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 text-sm font-medium text-white hover:bg-white/10 rounded-xl"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-[#161512] bg-white hover:bg-neutral-100 rounded-xl shadow-xs"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
