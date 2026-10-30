import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact PreYT YouTube Analytics Support",
  description: "Connect with the PreYT engineering and support team. Inquiries for API access, enterprise studio packaging, and creator partnerships.",
  alternates: {
    canonical: "https://preyt.integralgroups.in/contact",
  },
  openGraph: {
    title: "Contact PreYT YouTube Analytics Support",
    description: "Get in touch with the PreYT team. Email support, partnerships, and technical questions.",
    url: "https://preyt.integralgroups.in/contact",
    siteName: "PreYT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact PreYT YouTube Analytics Support",
    description: "Get in touch with the PreYT team. Email support, partnerships, and technical questions.",
  }
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
