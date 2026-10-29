import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Join the VIP Creator Waitlist — Early Access to PreYT",
  description: "Apply for priority beta access to PreYT. Get 3 free packaging audits and test your upcoming video concepts before filming.",
  alternates: {
    canonical: "/waitlist",
  },
  openGraph: {
    title: "Join the VIP Creator Waitlist — PreYT",
    description: "Apply for priority beta access to PreYT. Get 3 free packaging audits before filming.",
    url: "https://preyt.integralgroups.in/waitlist",
    siteName: "PreYT",
  }
}

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return children
}
