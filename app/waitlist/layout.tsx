import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Join the PreYT Creator Waitlist — Early Access Rollout",
  description: "Apply for early access to PreYT's YouTube pre-upload packaging audits. Submit your channel details to join our priority onboarding queue.",
  alternates: {
    canonical: "https://preyt.integralgroups.in/waitlist",
  },
  openGraph: {
    title: "Join the PreYT Creator Waitlist — Early Access Rollout",
    description: "Apply for early access to PreYT's YouTube pre-upload packaging audits. Submit your channel details to join our priority onboarding queue.",
    url: "https://preyt.integralgroups.in/waitlist",
    siteName: "PreYT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the PreYT Creator Waitlist — Early Access Rollout",
    description: "Apply for early access to PreYT's YouTube pre-upload packaging audits. Submit your channel details to join our priority onboarding queue.",
  }
}

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return children
}
