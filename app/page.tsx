import { NavbarLight } from "@/components/landing/navbar-light"
import { HeroLight } from "@/components/landing/hero-light"
import { TrustedBrands } from "@/components/landing/trusted-brands"
import { FeatureBento } from "@/components/landing/feature-bento"
import { BenefitsSection } from "@/components/landing/benefits-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { AnalyticsShowcase } from "@/components/landing/analytics-showcase"
import { Testimonials } from "@/components/landing/testimonials"
import { CtaSection } from "@/components/landing/cta-section"
import { TeamSection } from "@/components/landing/team-section"
import { FooterLight } from "@/components/landing/footer-light"
import { PageTransition } from "@/components/global/page-transition"

export default function LandingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FAF9F6] text-zinc-900 font-sans">
        <NavbarLight />
        
        <main className="flex-1">
          <HeroLight />
          
          <div className="relative w-full border-t border-zinc-200">
            <div className="absolute top-0 left-[8%] lg:left-[15%] xl:left-[20%] -translate-y-1/2 bg-[#FAF9F6] px-3 text-[8px] font-mono text-zinc-400 font-bold tracking-wider">[ 01 / CREATOR_TRUST ]</div>
            <TrustedBrands />
          </div>

          <div className="relative w-full border-t border-zinc-200">
            <div className="absolute top-0 left-[8%] lg:left-[15%] xl:left-[20%] -translate-y-1/2 bg-[#FAF9F6] px-3 text-[8px] font-mono text-zinc-450 font-bold tracking-wider">[ 02 / SYSTEM_DIAGNOSTICS ]</div>
            <FeatureBento />
          </div>

          <div className="relative w-full border-t border-zinc-200">
            <div className="absolute top-0 left-[8%] lg:left-[15%] xl:left-[20%] -translate-y-1/2 bg-[#FAF9F6] px-3 text-[8px] font-mono text-zinc-450 font-bold tracking-wider">[ 03 / SYSTEM_ADVANTAGES ]</div>
            <BenefitsSection />
          </div>

          <div className="relative w-full border-t border-zinc-200">
            <div className="absolute top-0 left-[8%] lg:left-[15%] xl:left-[20%] -translate-y-1/2 bg-[#FAF9F6] px-3 text-[8px] font-mono text-zinc-450 font-bold tracking-wider">[ 04 / CHANNEL_WORKFLOW ]</div>
            <HowItWorks />
          </div>

          <div className="relative w-full border-t border-zinc-200">
            <div className="absolute top-0 left-[8%] lg:left-[15%] xl:left-[20%] -translate-y-1/2 bg-[#FAF9F6] px-3 text-[8px] font-mono text-zinc-450 font-bold tracking-wider">[ 05 / INTELLIGENCE_BOARD ]</div>
            <AnalyticsShowcase />
          </div>

          <div className="relative w-full border-t border-zinc-200">
            <div className="absolute top-0 left-[8%] lg:left-[15%] xl:left-[20%] -translate-y-1/2 bg-[#FAF9F6] px-3 text-[8px] font-mono text-zinc-450 font-bold tracking-wider">[ 06 / COMMUNITY_VERDICT ]</div>
            <Testimonials />
          </div>

          <div className="relative w-full border-t border-zinc-200">
            <div className="absolute top-0 left-[8%] lg:left-[15%] xl:left-[20%] -translate-y-1/2 bg-[#FAF9F6] px-3 text-[8px] font-mono text-zinc-450 font-bold tracking-wider">[ 07 / FOUNDERS_VISION ]</div>
            <TeamSection />
          </div>

          <div className="relative w-full border-t border-zinc-200">
            <div className="absolute top-0 left-[8%] lg:left-[15%] xl:left-[20%] -translate-y-1/2 bg-[#FAF9F6] px-3 text-[8px] font-mono text-zinc-450 font-bold tracking-wider">[ 08 / DEPLOYMENT_SLOT ]</div>
            <CtaSection />
          </div>
        </main>

        <FooterLight />
      </div>
    </PageTransition>
  )
}
