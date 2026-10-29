import type { Metadata } from "next"
import { ComingSoonLight } from "@/components/landing/coming-soon-light"
import { BreadcrumbSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "Careers at PreYT — Building the Future of Creator Intelligence",
  description: "Join the PreYT engineering and machine learning team. We build high-throughput computer vision, statistical ranking engines, and creator workflows.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers at PreYT — Integral Groups",
    description: "Join our machine learning and creator infrastructure team.",
    url: "https://preyt.integralgroups.in/careers",
    siteName: "PreYT",
  }
}

export default function CareersPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Careers", url: "/careers" }
        ]}
      />
      <ComingSoonLight title="Careers at PreYT" />
    </>
  )
}
