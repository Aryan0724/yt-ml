import type { Metadata } from "next"
import { ComingSoonLight } from "@/components/landing/coming-soon-light"
import { BreadcrumbSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "Public Product Roadmap — PreYT Creator Intelligence",
  description: "View upcoming features for PreYT: Multi-model video script hook analysis, real-time A/B thumbnail testing integrations, and creator cohort benchmarking.",
  alternates: {
    canonical: "/roadmap",
  },
  openGraph: {
    title: "PreYT Public Product Roadmap",
    description: "View upcoming features, model research, and creator workflow releases.",
    url: "https://preyt.integralgroups.in/roadmap",
    siteName: "PreYT",
  }
}

export default function RoadmapPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Roadmap", url: "/roadmap" }
        ]}
      />
      <ComingSoonLight title="PreYT Product Roadmap" />
    </>
  )
}
