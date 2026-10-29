import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { StatsBar } from "@/components/landing/stats-bar"
import { VideoSection } from "@/components/landing/video-section"
import { CompetitorProblems } from "@/components/landing/competitor-problems"
import { WhyPreYT } from "@/components/landing/why-preyt"
import { CoreCapabilities } from "@/components/landing/core-capabilities"
import { ResourcesSection } from "@/components/landing/resources-section"
import { ContactSection } from "@/components/landing/contact-section"
import { Footer } from "@/components/landing/footer"

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
        "description": "YouTube Growth Analytics & Pre-Upload Packaging Intelligence",
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
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "248"
        }
      }
    ]
  }

  return (
    <div className="landing-page-container">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Exact Terms.so Non-Linear 32-Stop Gradient infused with pure YouTube Red */}
      <div className="hero-background-gradient">
        {/* Electric YouTube Red Radial Aura directly behind the headline */}
        <div className="hero-radial-glow" />
      </div>

      <div className="landing relative z-10">
        <Navbar />
        <main className="w-full">
          {/* Section 1: Hero — preserved exactly as-is */}
          <Hero />

          {/* Social Proof & Scale Metrics Bar */}
          <StatsBar />

          {/* Section 2: YouTube Introduction Video */}
          <VideoSection />

          {/* Section 3: Competitor Problems & PreYT's Response */}
          <CompetitorProblems />

          {/* Section 4: Why PreYT / USP */}
          <WhyPreYT />

          {/* Section 5: PreYT Features */}
          <CoreCapabilities />

          {/* Section 6: Resources & SEO Blog */}
          <ResourcesSection />

          {/* Section 7: Contact Form */}
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
