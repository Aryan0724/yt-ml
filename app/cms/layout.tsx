import { Metadata } from "next"

export const metadata: Metadata = {
  title: "preYT Editorial Infrastructure",
  description: "Enterprise Content & SEO Operating System",
  robots: {
    index: false,
    follow: false,
  },
}

export default function CMSLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 font-sans selection:bg-white/10 selection:text-white antialiased">
      {children}
    </div>
  )
}
