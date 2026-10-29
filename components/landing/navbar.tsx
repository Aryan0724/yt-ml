"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, ArrowRight, Sparkles } from "lucide-react"

interface NavbarProps {
  variant?: "dark" | "light"
}

export function Navbar({ variant = "light" }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isLight = variant === "light"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`w-full transition-all duration-300 relative z-30 ${
        isLight
          ? "border-b border-neutral-200 bg-white/95 backdrop-blur-md"
          : "landing-col pt-8 pb-6 md:pt-10 md:pb-8"
      }`}
    >
      <div className={`flex items-center justify-between ${isLight ? "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5" : ""}`}>
        {/* Brand Mark / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-90" aria-label="PreYT Home">
          <Image
            src={isLight ? "/preyt-logo-light.png" : "/preyt-logo-dark.png"}
            alt="PreYT"
            width={116}
            height={36}
            className="h-7 sm:h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main" className="hidden md:flex items-center gap-1">
          {isLight ? (
            /* Light Minimalist Navigation */
            <div className="flex items-center gap-1 text-xs font-semibold text-neutral-600">
              <Link
                href="/features"
                className="px-3.5 py-2 rounded-lg hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
              >
                Features
              </Link>
              <Link
                href="/intelligence"
                className="px-3.5 py-2 rounded-lg hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
              >
                Intelligence Engine
              </Link>
              <Link
                href="/tools/youtube-feed-preview"
                className="px-3.5 py-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1 font-bold"
              >
                <Sparkles className="w-3 h-3 text-red-500" />
                <span>Thumbnail Lab</span>
              </Link>
              <Link
                href="/pricing"
                className="px-3.5 py-2 rounded-lg hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                className="px-3.5 py-2 rounded-lg hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
              >
                Resources
              </Link>
            </div>
          ) : (
            /* Dark Glassmorphic Pill Rail for Landing Page Hero */
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
                href="/intelligence"
                className="action-button action-button--hero-ghost text-sm font-medium"
              >
                Intelligence
              </Link>
              <Link
                href="/tools/youtube-feed-preview"
                className="action-button action-button--hero-ghost text-sm font-medium text-red-300"
              >
                Thumbnail Lab
              </Link>
              <Link
                href="/pricing"
                className="action-button action-button--hero-ghost text-sm font-medium"
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                className="action-button action-button--hero-ghost text-sm font-medium"
              >
                Resources
              </Link>
            </div>
          )}
        </nav>

        {/* Action Buttons (Login & Sign Up) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
              isLight
                ? "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
                : "text-white/80 hover:text-white"
            }`}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-xs ${
              isLight
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-white text-neutral-950 hover:bg-neutral-100"
            }`}
          >
            <span>Start Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2 rounded-xl transition-colors ${
              isLight
                ? "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 border border-neutral-200"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div
          className={`absolute top-full left-4 right-4 z-50 rounded-2xl p-5 shadow-2xl space-y-3 md:hidden border transition-all ${
            isLight
              ? "bg-white border-neutral-200 text-neutral-900"
              : "bg-[#180204]/95 backdrop-blur-xl border-white/15 text-white"
          }`}
        >
          <Link
            href="/features"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 text-sm font-medium rounded-lg ${
              isLight ? "text-neutral-700 hover:bg-neutral-100" : "text-white/80 hover:bg-white/10"
            }`}
          >
            Features
          </Link>
          <Link
            href="/intelligence"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 text-sm font-medium rounded-lg ${
              isLight ? "text-neutral-700 hover:bg-neutral-100" : "text-white/80 hover:bg-white/10"
            }`}
          >
            Intelligence Engine
          </Link>
          <Link
            href="/tools/youtube-feed-preview"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 text-sm font-bold rounded-lg text-red-600 ${
              isLight ? "hover:bg-red-50" : "hover:bg-white/10"
            }`}
          >
            Thumbnail Feed Simulator (Free)
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 text-sm font-medium rounded-lg ${
              isLight ? "text-neutral-700 hover:bg-neutral-100" : "text-white/80 hover:bg-white/10"
            }`}
          >
            Pricing Plans
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 text-sm font-medium rounded-lg ${
              isLight ? "text-neutral-700 hover:bg-neutral-100" : "text-white/80 hover:bg-white/10"
            }`}
          >
            Resources &amp; Blog
          </Link>
          <div className={`pt-3 border-t flex flex-col gap-2 ${isLight ? "border-neutral-100" : "border-white/10"}`}>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className={`w-full text-center py-2.5 text-sm font-medium rounded-xl ${
                isLight ? "text-neutral-700 hover:bg-neutral-100" : "text-white hover:bg-white/10"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className={`w-full text-center py-2.5 text-sm font-bold rounded-xl shadow-xs ${
                isLight
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-white text-neutral-950 hover:bg-neutral-100"
              }`}
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
