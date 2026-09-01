import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { TrustedBrands } from "@/components/landing/trusted-brands"
import { PlatformFeatures } from "@/components/landing/platform-features"
import { EvidenceSection } from "@/components/landing/evidence-section"
import { BottomCTA } from "@/components/landing/bottom-cta"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center">
        <Hero />
        <TrustedBrands />
        <PlatformFeatures />
        <EvidenceSection />
        <BottomCTA />
      </main>

      <Footer />
    </div>
  )
}
