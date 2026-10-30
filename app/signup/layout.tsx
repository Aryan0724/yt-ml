import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Account — PreYT Creator Platform",
  description: "Create your PreYT account to test YouTube titles and thumbnails before you film.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://preyt.integralgroups.in/signup",
  },
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
