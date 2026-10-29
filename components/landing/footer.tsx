import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="landing-col pt-16 pb-20 border-t border-neutral-200 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">

        {/* Brand Information (Col 1-4) */}
        <div className="md:col-span-4 space-y-4 max-w-sm">
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

        {/* Free Public Creator Tools (Col 5-6) */}
        <nav aria-label="Free Tools" className="md:col-span-2 space-y-3.5">
          <h2 className="text-xs font-semibold text-neutral-400 tracking-wider uppercase font-mono">
            Free Creator Tools
          </h2>
          <ul className="space-y-2.5 text-xs font-medium text-[#161512]">
            <li>
              <Link href="/youtube-thumbnail-analyzer" className="hover:text-[#EE1122] transition-colors font-semibold text-red-600">
                Thumbnail Analyzer
              </Link>
            </li>
            <li>
              <Link href="/youtube-title-analyzer" className="hover:text-[#EE1122] transition-colors">
                Title Analyzer
              </Link>
            </li>
            <li>
              <Link href="/youtube-video-idea-generator" className="hover:text-[#EE1122] transition-colors">
                Video Idea Generator
              </Link>
            </li>
            <li>
              <Link href="/youtube-content-gap-finder" className="hover:text-[#EE1122] transition-colors">
                Content Gap Finder
              </Link>
            </li>
            <li>
              <Link href="/youtube-thumbnail-tester" className="hover:text-[#EE1122] transition-colors">
                Thumbnail Tester
              </Link>
            </li>
            <li>
              <Link href="/tools/youtube-feed-preview" className="hover:text-[#EE1122] transition-colors">
                Mobile Feed Previewer
              </Link>
            </li>
          </ul>
        </nav>

        {/* Product & Platform (Col 7-8) */}
        <nav aria-label="Product" className="md:col-span-2 space-y-3.5">
          <h2 className="text-xs font-semibold text-neutral-400 tracking-wider uppercase font-mono">
            Product
          </h2>
          <ul className="space-y-2.5 text-xs font-medium text-[#161512]">
            <li>
              <Link href="/features" className="hover:text-[#EE1122] transition-colors">
                Features &amp; Audit
              </Link>
            </li>
            <li>
              <Link href="/intelligence" className="hover:text-[#EE1122] transition-colors">
                Intelligence Engine
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-[#EE1122] transition-colors">
                Pricing Plans
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-[#EE1122] transition-colors">
                Start Free Audit
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-[#EE1122] transition-colors">
                Sign In
              </Link>
            </li>
          </ul>
        </nav>

        {/* Comparisons & Blueprints (Col 9-10) */}
        <nav aria-label="Comparisons & Blueprints" className="md:col-span-2 space-y-3.5">
          <h2 className="text-xs font-semibold text-neutral-400 tracking-wider uppercase font-mono">
            Comparisons &amp; Niche
          </h2>
          <ul className="space-y-2.5 text-xs font-medium text-[#161512]">
            <li>
              <Link href="/vs/vidiq" className="hover:text-[#EE1122] transition-colors">
                PreYT vs vidIQ
              </Link>
            </li>
            <li>
              <Link href="/vs/1of10" className="hover:text-[#EE1122] transition-colors">
                PreYT vs 1of10
              </Link>
            </li>
            <li>
              <Link href="/youtube-packaging/faceless-documentary" className="hover:text-[#EE1122] transition-colors">
                Faceless Blueprint
              </Link>
            </li>
            <li>
              <Link href="/youtube-packaging/cooking-culinary" className="hover:text-[#EE1122] transition-colors">
                Cooking Blueprint
              </Link>
            </li>
            <li>
              <Link href="/youtube-packaging/gaming-esports" className="hover:text-[#EE1122] transition-colors">
                Gaming Blueprint
              </Link>
            </li>
            <li>
              <Link href="/youtube-packaging/tech-reviews" className="hover:text-[#EE1122] transition-colors">
                Tech Reviews
              </Link>
            </li>
          </ul>
        </nav>

        {/* Company & Legal (Col 11-12) */}
        <nav aria-label="Company" className="md:col-span-2 space-y-3.5">
          <h2 className="text-xs font-semibold text-neutral-400 tracking-wider uppercase font-mono">
            Company &amp; Legal
          </h2>
          <ul className="space-y-2.5 text-xs font-medium text-[#161512]">
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
                Privacy Policy (DPDP)
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
