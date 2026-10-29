import type { Metadata } from "next"
import { ComingSoonLight } from "@/components/landing/coming-soon-light"
import { BreadcrumbSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "Partner Program — PreYT YouTube Creator Ecosystem",
  description: "Collaborate with PreYT: Agency referral programs, MCN volume packaging licensing, and creator tool developer integrations.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://preyt.integralgroups.in/partners",
  },
  openGraph: {
    title: "Partner Program — PreYT Ecosystem",
    description: "Agency referral programs, MCN volume packaging licensing, and tool integrations.",
    url: "https://preyt.integralgroups.in/partners",
    siteName: "PreYT",
  }
}

export default function PartnersPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Partners", url: "/partners" }
        ]}
      />
      <ComingSoonLight title="PreYT Partner Network" />
    </>
  )
}
