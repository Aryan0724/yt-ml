import type { Metadata } from "next"
import { Navbar } from "@/components/landing/navbar"
import { PricingSection } from "@/components/landing/pricing-section"
import { BottomCTA } from "@/components/landing/bottom-cta"
import { Footer } from "@/components/landing/footer"
import { BreadcrumbSchema, FaqSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "Pricing Plans — PreYT YouTube Packaging Intelligence",
  description: "Transparent pricing for creators and production studios. Start free with 3 audits/month or unlock unlimited audits, topic radar, and A/B split testing.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing Plans — PreYT Creator Decision Platform",
    description: "Start free or scale with Pro Creator. Forecast YouTube packaging CTR before filming.",
    url: "https://preyt.integralgroups.in/pricing",
    siteName: "PreYT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Plans — PreYT Creator Decision Platform",
    description: "Start free or scale with Pro Creator. Forecast YouTube packaging CTR before filming.",
  }
}

const PRICING_FAQS = [
  {
    question: "How does PreYT predict performance before I film?",
    answer: "PreYT evaluates your draft thumbnail and title against millions of uploads in your specific niche using format-native computer vision models, search topic momentum, and linguistic hook forensics."
  },
  {
    question: "Can I use PreYT for free?",
    answer: "Yes, our Starter tier includes 3 free video packaging audits every month with mobile truncation checks and contrast diagnostics."
  },
  {
    question: "Does PreYT connect to my YouTube channel?",
    answer: "Yes, connecting via YouTube OAuth allows PreYT to establish your channel's unique historical baseline views and audience retention elasticity."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel or upgrade your plan directly in your settings with zero long-term commitments."
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-red-100 selection:text-red-900 pt-16">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Pricing", url: "/pricing" }
        ]}
      />
      <FaqSchema items={PRICING_FAQS} />
      <Navbar />
      <main>
        <PricingSection isMainHeading={true} />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  )
}
