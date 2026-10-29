import type { Metadata } from "next"
import { ComingSoonLight } from "@/components/landing/coming-soon-light"
import { BreadcrumbSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "PreYT for Production Agencies & MCNs — Multi-Channel Packaging",
  description: "Scale pre-publish quality assurance across 20+ client channels. Standardize thumbnail review workflows and generate automated packaging audits.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://preyt.integralgroups.in/agencies",
  },
  openGraph: {
    title: "PreYT for Production Agencies & MCNs",
    description: "Standardize thumbnail review workflows and generate automated packaging audits across client channels.",
    url: "https://preyt.integralgroups.in/agencies",
    siteName: "PreYT",
  }
}

export default function AgenciesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Agencies", url: "/agencies" }
        ]}
      />
      <ComingSoonLight title="For Production Studios & Agencies" />
    </>
  )
}
