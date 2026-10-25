import Link from "next/link"
import { ArrowRight, Check, ShieldCheck } from "lucide-react"

export function BottomCTA() {
  return (
    <section id="contact" className="py-24 bg-white border-b border-neutral-200 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Monospace Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono tracking-wider uppercase mb-8 border border-neutral-200">
          <ShieldCheck className="w-4 h-4 text-[#EE1122]" />
          <span>NO-RISK CREATOR GUARANTEE</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#161512] leading-[1.08] mb-6">
          Make every video a hit. <br />
          <span className="text-[#EE1122]">Powered by data.</span>
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-neutral-600 max-w-xl mx-auto leading-relaxed mb-10 font-normal">
          Stop wondering why your videos die at 1,000 views. PreYT gives your team the exact title fixes, thumbnail contrast checks, and topic opportunities needed to break out.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
          <Link
            id="bottom-cta-primary"
            href="/signup"
            className="action-button action-button--primary px-8 py-3.5 text-base font-semibold shadow-md hover:scale-102 transition-transform"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>

          <a
            id="bottom-cta-secondary"
            href="#draft"
            className="action-button action-button--secondary px-7 py-3.5 text-base font-semibold border border-neutral-200 hover:scale-102 transition-transform"
          >
            <span>See Platform Tour</span>
          </a>
        </div>

        {/* Guarantees */}
        <div className="pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs sm:text-sm text-neutral-500 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" /> No credit card required
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" /> 14-day full feature trial
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" /> Cancel anytime in 1 click
          </span>
        </div>

      </div>
    </section>
  )
}
