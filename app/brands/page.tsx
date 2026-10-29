import type { Metadata } from "next"
import { ComingSoonLight } from "@/components/landing/coming-soon-light"
import { BreadcrumbSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "PreYT for Brand Channels — Corporate Video Packaging Intelligence",
  description: "Enterprise video packaging intelligence for brand marketing teams. Benchmark corporate YouTube packaging against top consumer content creators.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://preyt.integralgroups.in/brands",
  },
  openGraph: {
    title: "PreYT for Brand Channels",
    description: "Benchmark corporate YouTube packaging against top consumer content creators.",
    url: "https://preyt.integralgroups.in/brands",
    siteName: "PreYT",
  }
}

export default function BrandsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Brands", url: "/brands" }
        ]}
      />
      <ComingSoonLight title="For Brands & Enterprise Channels" />
    </>
  )
}
