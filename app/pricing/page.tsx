import { Navbar } from "@/components/landing/navbar"
import { PricingSection } from "@/components/landing/pricing-section"
import { BottomCTA } from "@/components/landing/bottom-cta"
import { Footer } from "@/components/landing/footer"

export const metadata = {
  title: "Pricing — PreYT YouTube Packaging Intelligence",
  description: "Transparent pricing for independent creators and media production studios.",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-red-100 selection:text-red-900 pt-16">
      <Navbar />
      <main>
        <PricingSection />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  )
}
