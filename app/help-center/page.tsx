import type { Metadata } from "next"
import { ComingSoonLight } from "@/components/landing/coming-soon-light"
import { BreadcrumbSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "Help Center & Documentation — PreYT Knowledge Base",
  description: "Learn how to interpret PreYT packaging scores, fix mobile truncation bottlenecks, and configure format-native archetype settings.",
  alternates: {
    canonical: "/help-center",
  },
  openGraph: {
    title: "PreYT Help Center & Knowledge Base",
    description: "Guides on packaging scores, mobile truncation, and archetype settings.",
    url: "https://preyt.integralgroups.in/help-center",
    siteName: "PreYT",
  }
}

export default function HelpCenterPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Help Center", url: "/help-center" }
        ]}
      />
      <ComingSoonLight title="PreYT Help & Knowledge Base" />
    </>
  )
}
