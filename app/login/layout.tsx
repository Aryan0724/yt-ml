import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In — PreYT Creator Platform",
  description: "Sign in to access your PreYT workspace, packaging audits, and channel DNA analytics.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://preyt.integralgroups.in/login",
  },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
