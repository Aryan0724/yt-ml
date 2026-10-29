import type { Metadata } from "next";
import { NavbarLight } from "@/components/landing/navbar-light";
import { FooterLight } from "@/components/landing/footer-light";
import { PageTransition } from "@/components/global/page-transition";
import { BreadcrumbSchema } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Privacy Policy — PreYT Creator Intelligence",
  description: "Learn how PreYT safeguards creator metadata, drafts, and YouTube analytics. We prioritize data sovereignty and creator privacy.",
  alternates: {
    canonical: "/legal/privacy",
  },
  openGraph: {
    title: "Privacy Policy — PreYT Platform",
    description: "Learn how PreYT safeguards creator metadata, drafts, and YouTube analytics.",
    url: "https://preyt.integralgroups.in/legal/privacy",
    siteName: "PreYT",
  }
};

export default function PrivacyPage() {
  return (
    <PageTransition>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/legal/privacy" }
        ]}
      />
      <NavbarLight />
      <main className="pt-44 pb-32 px-6 min-h-screen bg-[#FAF9F6] relative overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <article className="max-w-3xl mx-auto relative z-10">
          <div className="inline-block px-3 py-1 text-[9px] font-mono font-bold tracking-widest text-[#FF0000] uppercase mb-4 border border-red-500/10 bg-red-500/5 rounded">
            [ LEGAL // PRIVACY ]
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-16 text-zinc-900 tracking-tight">Privacy Policy</h1>
          <div className="prose prose-zinc max-w-none space-y-12 text-zinc-600 text-lg leading-relaxed font-medium">
            <section className="space-y-6">
                <h2 className="text-zinc-900 text-2xl font-bold font-display">1. Introduction</h2>
                <p>
                    At PreYT, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you use our creator intelligence platform.
                </p>
            </section>
            <section className="space-y-6">
                <h2 className="text-zinc-900 text-2xl font-bold font-display">2. Data Collection &amp; Use</h2>
                <p>
                    We collect metadata related to your YouTube content, including titles, thumbnail draft images, and category parameters to provide our predictive analysis. We do not access your private Google account credentials; OAuth tokens are encrypted at rest.
                </p>
            </section>
            <section className="space-y-6">
                <h2 className="text-zinc-900 text-2xl font-bold font-display">3. Use of Intelligence Models</h2>
                <p>
                    Your data is processed by our format-native computer vision pipelines to generate performance scores. This data may be used in an anonymized, aggregated format to refine global intelligence benchmarks.
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
