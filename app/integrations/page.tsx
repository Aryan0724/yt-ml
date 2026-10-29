import type { Metadata } from "next"
import { ComingSoonLight } from "@/components/landing/coming-soon-light"
import { BreadcrumbSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "Integrations — Connect PreYT with YouTube Studio & Production Tools",
  description: "Seamlessly connect PreYT with YouTube Data API, Adobe Premiere Pro, Photoshop, and video editing workflow tools.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://preyt.integralgroups.in/integrations",
  },
  openGraph: {
    title: "PreYT Integrations & Extensions",
    description: "Connect PreYT with YouTube Studio and creator editing workflows.",
    url: "https://preyt.integralgroups.in/integrations",
    siteName: "PreYT",
  }
}

export default function IntegrationsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Integrations", url: "/integrations" }
        ]}
      />
      <ComingSoonLight title="PreYT Platform Integrations" />
    </>
  )
}
