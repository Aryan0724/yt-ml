import type { Metadata } from "next";
import { NavbarLight } from "@/components/landing/navbar-light";
import { FooterLight } from "@/components/landing/footer-light";
import { PageTransition } from "@/components/global/page-transition";
import { BreadcrumbSchema } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Terms of Service — PreYT Creator Decision Platform",
  description: "Review the PreYT terms of service for creator subscriptions, API quotas, packaging audit entitlements, and intellectual property.",
  alternates: {
    canonical: "/legal/terms",
  },
  openGraph: {
    title: "Terms of Service — PreYT Platform",
    description: "Review the PreYT terms of service for creator subscriptions and usage.",
    url: "https://preyt.integralgroups.in/legal/terms",
    siteName: "PreYT",
  }
};

export default function TermsPage() {
  return (
    <PageTransition>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Terms of Service", url: "/legal/terms" }
        ]}
      />
      <NavbarLight />
      <main className="pt-44 pb-32 px-6 min-h-screen bg-[#FAF9F6] relative overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <article className="max-w-3xl mx-auto relative z-10">
          <div className="inline-block px-3 py-1 text-[9px] font-mono font-bold tracking-widest text-[#FF0000] uppercase mb-4 border border-red-500/10 bg-red-500/5 rounded">
            [ LEGAL // TERMS ]
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-16 text-zinc-900 tracking-tight">Terms of Service</h1>
          <div className="prose prose-zinc max-w-none space-y-12 text-zinc-600 text-lg leading-relaxed font-medium">
            <section className="space-y-6">
                <h2 className="text-zinc-900 text-2xl font-bold font-display">1. Agreement to Terms</h2>
                <p>
                    By accessing or using PreYT, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
                </p>
            </section>
            <section className="space-y-6">
                <h2 className="text-zinc-900 text-2xl font-bold font-display">2. Service Usage &amp; Fair Use</h2>
                <p>
                    Our services provide predictive intelligence for YouTube packaging. Users must not attempt to reverse engineer, scrape, or overwhelm our algorithmic prediction endpoints outside sanctioned rate limits.
                </p>
            </section>
            <section className="space-y-6">
                <h2 className="text-zinc-900 text-2xl font-bold font-display">3. Intellectual Property</h2>
                <p>
                    All thumbnails, scripts, and video concepts uploaded by creators remain the exclusive intellectual property of the creator. PreYT claims zero ownership over your content.
                </p>
            </section>
            <p className="text-sm italic border-t border-zinc-200 pt-12">
                Last Updated: October 2026
            </p>
          </div>
        </article>
      </main>
      <FooterLight />
    </PageTransition>
  )
}
