import type { Metadata } from "next";
import { NavbarLight } from "@/components/landing/navbar-light";
import { FooterLight } from "@/components/landing/footer-light";
import { PageTransition } from "@/components/global/page-transition";
import { BreadcrumbSchema } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Cookie Policy — PreYT Creator Intelligence",
  description: "Learn how PreYT uses essential session cookies and telemetry tokens to maintain your workspace state.",
  alternates: {
    canonical: "/legal/cookies",
  },
  openGraph: {
    title: "Cookie Policy — PreYT Platform",
    description: "Learn how PreYT uses essential session cookies and telemetry tokens.",
    url: "https://preyt.integralgroups.in/legal/cookies",
    siteName: "PreYT",
  }
};

export default function CookiesPage() {
  return (
    <PageTransition>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Cookie Policy", url: "/legal/cookies" }
        ]}
      />
      <NavbarLight />
      <main className="pt-44 pb-32 px-6 min-h-screen bg-[#FAF9F6] relative overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <article className="max-w-3xl mx-auto relative z-10">
          <div className="inline-block px-3 py-1 text-[9px] font-mono font-bold tracking-widest text-[#FF0000] uppercase mb-4 border border-red-500/10 bg-red-500/5 rounded">
            [ LEGAL // COOKIES ]
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-16 text-zinc-900 tracking-tight">Cookie Policy</h1>
          <div className="prose prose-zinc max-w-none space-y-12 text-zinc-600 text-lg leading-relaxed font-medium">
            <p>
                We use cookies to maintain your authenticated workspace session, store temporary analysis previews, and measure product performance metrics. We do not sell creator tracking data to third-party ad brokers.
            </p>
          </div>
        </article>
      </main>
      <FooterLight />
    </PageTransition>
  )
}
