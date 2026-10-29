import type { Metadata } from "next"
import { ComingSoonLight } from "@/components/landing/coming-soon-light"
import { BreadcrumbSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "High-CTR Packaging Templates — PreYT Creator Resource Hub",
  description: "Browse high-converting thumbnail templates and proven title formulas categorized by niche archetype: faceless, cooking, gaming, tech, and commentary.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://preyt.integralgroups.in/templates",
  },
  openGraph: {
    title: "High-CTR Packaging Templates — PreYT",
    description: "Browse high-converting thumbnail templates and proven title formulas by archetype.",
    url: "https://preyt.integralgroups.in/templates",
    siteName: "PreYT",
  }
}

export default function TemplatesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Templates", url: "/templates" }
        ]}
      />
      <ComingSoonLight title="Thumbnail & Hook Templates" />
    </>
  )
}
