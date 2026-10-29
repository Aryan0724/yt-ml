import type { Metadata } from "next"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { StatsBar } from "@/components/landing/stats-bar"
import { VideoSection } from "@/components/landing/video-section"
import { CompetitorProblems } from "@/components/landing/competitor-problems"
import { WhyPreYT } from "@/components/landing/why-preyt"
import { CoreCapabilities } from "@/components/landing/core-capabilities"
import { FaqSection } from "@/components/landing/faq-section"
import { ResourcesSection } from "@/components/landing/resources-section"
import { ContactSection } from "@/components/landing/contact-section"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "PreYT — Pre-Upload YouTube Analytics for Titles, Thumbnails & Video Ideas",
  description: "Audit your YouTube packaging before filming. Analyze thumbnails for mobile contrast, test 54-character title cutoffs, and discover high-demand competitor content gaps.",
  alternates: {
    canonical: "https://preyt.integralgroups.in",
  },
  openGraph: {
    title: "PreYT — Pre-Upload YouTube Analytics for Titles, Thumbnails & Ideas",
    description: "Audit thumbnails, test mobile cutoffs, and discover content gaps before you film.",
    url: "https://preyt.integralgroups.in",
    siteName: "PreYT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PreYT — Pre-Upload YouTube Analytics for Titles, Thumbnails & Ideas",
    description: "Audit thumbnails, test mobile cutoffs, and discover content gaps before you film.",
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
          "url": "https://preyt.integralgroups.in/preyt-logo-dark.png"
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
    <div className="landing-page-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Amplified Hero Section Container */}
      <div className="hero-background-gradient">
        <div className="hero-radial-glow" />
      </div>

      <div className="landing relative z-10">
        <Navbar variant="dark" />
        <main className="w-full">
          {/* Section 1: Hero */}
          <Hero />

          {/* Social Proof & Scale Metrics Bar */}
          <StatsBar />

          {/* Section 2: YouTube Introduction Video */}
          <VideoSection />

          {/* Section 3: The Broken Current Landscape */}
          <CompetitorProblems />

          {/* Section 4: The 4 High-Value Solution Pillars */}
          <WhyPreYT />

          {/* Section 5: Interactive Tabbed Capabilities Showcase */}
          <CoreCapabilities />

          {/* Section 6: FAQ with Schema */}
          <FaqSection />

          {/* Section 7: Curated Editorial Resources */}
          <ResourcesSection />

          {/* Section 8: Terminal Contact & Inquiry Module */}
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
