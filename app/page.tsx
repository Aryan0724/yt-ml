import type { Metadata } from "next"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { StatsBar } from "@/components/landing/stats-bar"
import { CaseStudyProof } from "@/components/landing/case-study-proof"
import { ThreeBenefits } from "@/components/landing/three-benefits"
import { HowItWorks } from "@/components/landing/how-it-works"
import { SampleReport } from "@/components/landing/sample-report"
import { UseCases } from "@/components/landing/use-cases"
import { PricingSection } from "@/components/landing/pricing-section"
import { FaqSection } from "@/components/landing/faq-section"
import { FinalCta } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "PreYT — Pre-Upload YouTube Analytics for Titles, Thumbnails & Video Ideas",
  description: "Know whether your YouTube video package works before you spend 40 hours making it. Analyze thumbnails for mobile contrast, test 54-character cutoffs, and discover content gaps.",
  alternates: {
    canonical: "https://preyt.integralgroups.in",
  },
  openGraph: {
    title: "PreYT — Pre-Upload YouTube Analytics for Titles, Thumbnails & Ideas",
    description: "Know whether your video package works before filming. Test mobile cutoffs, contrast, and content gaps.",
    url: "https://preyt.integralgroups.in",
    siteName: "PreYT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PreYT — Pre-Upload YouTube Analytics for Titles, Thumbnails & Ideas",
    description: "Know whether your video package works before filming. Test mobile cutoffs, contrast, and content gaps.",
  }
}

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://preyt.integralgroups.in/#organization",
        "name": "PreYT",
        "url": "https://preyt.integralgroups.in",
        "logo": {
          "@type": "ImageObject",
          "url": "https://preyt.integralgroups.in/preyt-logo-light.png"
        },
        "description": "YouTube intelligence and pre-upload packaging audit platform for creators.",
        "sameAs": ["https://twitter.com/preYTAI"]
      },
      {
        "@type": "WebSite",
        "@id": "https://preyt.integralgroups.in/#website",
        "url": "https://preyt.integralgroups.in",
        "name": "PreYT",
        "description": "Pre-Upload YouTube Analytics for Titles, Thumbnails & Video Ideas",
        "publisher": {
          "@id": "https://preyt.integralgroups.in/#organization"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://preyt.integralgroups.in/#software",
        "name": "PreYT Creator Intelligence Engine",
        "url": "https://preyt.integralgroups.in",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "description": "Pre-upload YouTube packaging decision engine. Audit thumbnails, forecast CTR, test title hooks, and benchmark against competitor niches.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    ]
  }

  return (
    <div className="landing-page-container bg-white text-neutral-900 selection:bg-red-100 selection:text-red-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header with Dark Glassmorphic Rail and Controlled Ambient Glow */}
      <div className="relative bg-neutral-950 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[420px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
        
        <Navbar variant="dark" />
        
        {/* Section 1: Hero with Live Interactive Mini-Audit Widget Above The Fold */}
        <Hero />
      </div>

      <main className="w-full">
        {/* Section 2: Credible Metrics & Scale Strip */}
        <StatsBar />

        {/* Section 3: Real Creator Before/After Case Studies & Proof */}
        <CaseStudyProof />

        {/* Section 4: Three Core Connected Benefits */}
        <ThreeBenefits />

        {/* Section 5: The 3-Step Creator Workflow */}
        <HowItWorks />

        {/* Section 6: Interactive Sample Report Inspector */}
        <SampleReport />

        {/* Section 7: Audience Use Cases (Solo Creators, Studios, Agencies) */}
        <UseCases />

        {/* Section 8: Transparent Pricing Plans on Main Homepage */}
        <PricingSection />

        {/* Section 9: FAQ with Schema.org JSON-LD */}
        <FaqSection />

        {/* Section 10: Final High-Converting Zero-Friction CTA */}
        <FinalCta />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}
