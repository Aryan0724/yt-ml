import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="landing-col pt-16 pb-20 border-t border-neutral-200">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">

        {/* Brand Information (Col 1-5) */}
        <div className="md:col-span-5 space-y-4 max-w-sm">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90" aria-label="PreYT Home">
            <Image
              src="/preyt-logo-light.png"
              alt="PreYT"
              width={116}
              height={36}
              className="h-7 w-auto object-contain"
            />
          </Link>
          <p className="text-xs text-neutral-500 leading-relaxed font-normal">
            PreYT is the pre-upload performance copilot for YouTube creators. Audit your packaging against 14.8M uploads, understand competitor gaps, and publish videos that earn the click.
          </p>
          <div className="text-[11px] font-mono text-neutral-400">
            Official YouTube Data API Integration · Privacy First
          </div>
        </div>

        {/* Product Navigation (Col 6-7) */}
        <nav aria-label="Product" className="md:col-span-2 space-y-3.5">
          <h2 className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
            Product
          </h2>
          <ul className="space-y-2.5 text-sm font-medium text-[#161512]">
            <li>
              <Link href="/features" className="hover:text-[#EE1122] transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-[#EE1122] transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/intelligence" className="hover:text-[#EE1122] transition-colors">
                Intelligence Engine
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#EE1122] transition-colors">
                About PreYT
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-[#EE1122] transition-colors">
                Free Trial
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-[#EE1122] transition-colors">
                Sign In
              </Link>
            </li>
          </ul>
        </nav>

        {/* Tools & Platform (Col 8-10) */}
        <nav aria-label="Tools" className="md:col-span-3 space-y-3.5">
          <h2 className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
            Platform Tools
          </h2>
          <ul className="space-y-2.5 text-sm font-medium text-[#161512]">
            <li>
              <Link href="/dashboard/analyze" className="hover:text-[#EE1122] transition-colors">
                Video Packaging Audit
              </Link>
            </li>
            <li>
              <Link href="/dashboard/niche" className="hover:text-[#EE1122] transition-colors">
                Niche Outlier Scanner
              </Link>
            </li>
            <li>
              <Link href="/dashboard/radar" className="hover:text-[#EE1122] transition-colors">
                Topic Radar (Demand Gap)
              </Link>
            </li>
            <li>
              <Link href="/dashboard/lab" className="hover:text-[#EE1122] transition-colors">
                Mobile Feed Simulator
              </Link>
            </li>
            <li>
              <Link href="/dashboard/channel" className="hover:text-[#EE1122] transition-colors">
                Competitor Channel DNA
              </Link>
            </li>
          </ul>
        </nav>

        {/* Company & Trust (Col 11-12) */}
        <nav aria-label="Company" className="md:col-span-2 space-y-3.5">
          <h2 className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
            Company &amp; Legal
          </h2>
          <ul className="space-y-2.5 text-sm font-medium text-[#161512]">
            <li>
              <Link href="/blog" className="hover:text-[#EE1122] transition-colors">
                Resources &amp; Blog
              </Link>
            </li>
            <li>
              <Link href="/changelog" className="hover:text-[#EE1122] transition-colors">
                Changelog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#EE1122] transition-colors">
                Contact &amp; Support
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="hover:text-[#EE1122] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="hover:text-[#EE1122] transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/legal/cookies" className="hover:text-[#EE1122] transition-colors">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </nav>

      </div>

      {/* Bottom Sub-footer */}
      <div className="mt-14 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
        <div>
          &copy; {new Date().getFullYear()} PreYT Intelligence Inc. Built under Integral Groups Studio. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <span>YouTube is a registered trademark of Google LLC.</span>
        </div>
      </div>
    </footer>
  )
}
