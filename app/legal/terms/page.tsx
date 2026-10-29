import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { FileText, Shield, CheckCircle2, AlertTriangle, Scale } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service — PreYT Creator Decision Platform",
  description: "Review PreYT's terms of service governing creator intellectual property rights, YouTube API integrations, subscriptions, and acceptable use policies.",
  alternates: {
    canonical: "/legal/terms",
  },
  openGraph: {
    title: "Terms of Service — PreYT Platform",
    description: "Review PreYT's terms of service governing creator intellectual property, subscriptions, and usage.",
    url: "https://preyt.integralgroups.in/legal/terms",
    siteName: "PreYT",
  }
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 selection:bg-red-100 selection:text-red-900 flex flex-col justify-between">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Legal", url: "/legal/terms" },
          { name: "Terms of Service", url: "/legal/terms" }
        ]}
      />
      <div>
        <Navbar variant="light" />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-12">
          {/* Header */}
          <div className="space-y-4 border-b border-neutral-200 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono font-bold tracking-wider uppercase">
              <Scale className="w-3.5 h-3.5 text-neutral-700" />
              <span>CONTRACTUAL TERMS // CREATOR PLATFORM</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-mono">
              Entity: Integral Groups Studio · Effective Date: October 29, 2026 · Jurisdiction: India
            </p>
          </div>

          {/* Core Content Body */}
          <article className="space-y-10 text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">01.</span>
                <span>Agreement to Terms &amp; Scope</span>
              </h2>
              <p>
                By accessing, browsing, registering for, or using the <strong>PreYT</strong> platform, diagnostic APIs, or website (<a href="https://preyt.integralgroups.in" className="text-red-600 underline">https://preyt.integralgroups.in</a>), operated by <strong>Integral Groups Studio</strong> (&quot;PreYT&quot;, &quot;Company&quot;, &quot;we&quot;, or &quot;us&quot;), you enter into a legally binding agreement with us and agree to comply with these Terms of Service.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">02.</span>
                <span>100% Creator Intellectual Property Ownership</span>
              </h2>
              <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2 text-xs sm:text-sm">
                <p className="font-bold text-neutral-950">
                  You retain 100% exclusive copyright and intellectual property rights over all content you submit to PreYT.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                  <li>
                    All thumbnail artwork, titles, video hooks, scripts, and channel concepts remain your exclusive property. PreYT claims zero ownership, license, or right to monetize your creative assets.
                  </li>
                  <li>
                    Uploaded draft assets are processed strictly for the purpose of generating your diagnostic scores, mobile feed previews, and perceptual hash similarity ratings.
                  </li>
                  <li>
                    PreYT retains all proprietary rights, copyright, and patent rights in its computer-vision pipelines, OpenCV feature weight matrices, machine-learning inference engines, and user interface.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">03.</span>
                <span>YouTube API Services Non-Affiliation Disclosure</span>
              </h2>
              <p>
                PreYT is an independent creator intelligence tool that integrates with the official YouTube Data API v3. <strong>PreYT is not affiliated with, endorsed by, sponsored by, or operated by YouTube LLC or Google LLC.</strong>
              </p>
              <p>
                Users connecting their YouTube channels acknowledge that access is subject to YouTube&apos;s Developer Terms of Service and API Quotas. PreYT does not make alterations to your channel metadata without explicit one-click confirmation.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">04.</span>
                <span>Permissible Use &amp; Rate Limiting</span>
              </h2>
              <p>
                You agree to use PreYT only for lawful packaging evaluation. You specifically agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-neutral-600 text-xs sm:text-sm">
                <li>Attempt to decompile, reverse engineer, or extract source code from the OpenCV archetype extractors or pHash matrices.</li>
                <li>Deploy automated scrapers, bots, or unauthorized crawlers to extract niche outlier intelligence outside sanctioned API limits.</li>
                <li>Share account credentials or abuse free trial tiers through multi-account sybil attacks.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">05.</span>
                <span>Subscription, Billing &amp; Cancellation Policy</span>
              </h2>
              <p>
                PreYT offers free diagnostics alongside paid Creator Pro and Studio plans. Subscriptions renew on a monthly basis. You may cancel your subscription at any time directly through your account dashboard with zero cancellation penalties. Access remains active until the conclusion of the current billing cycle.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">06.</span>
                <span>Algorithmic Warranty Disclaimer</span>
              </h2>
              <p>
                PreYT provides predictive statistical models based on empirical analysis of 14.8M uploads and OpenCV visual glanceability heuristics. However, YouTube&apos;s recommendation engine incorporates individualized viewer history, session velocity, and platform shifts. <strong>PreYT makes no warranty that a high packaging score will guarantee viral distribution, subscriber growth, or specific revenue outcomes.</strong>
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">07.</span>
                <span>Governing Law &amp; Jurisdiction</span>
              </h2>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of <strong>India</strong>, without regard to conflict of law principles. Any legal dispute, controversy, or claim arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts located in <strong>New Delhi, India</strong>, or resolved via binding commercial arbitration.
              </p>
            </section>
          </article>
        </main>
      </div>

      <Footer />
    </div>
  )
}
