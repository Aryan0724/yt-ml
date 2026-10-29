import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { Cookie, CheckCircle2, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Cookie Policy — PreYT Creator Intelligence",
  description: "Learn how PreYT utilizes essential session cookies, workspace tokens, and diagnostic telemetry to maintain your creator workspace.",
  alternates: {
    canonical: "/legal/cookies",
  },
  openGraph: {
    title: "Cookie Policy — PreYT Platform",
    description: "Learn how PreYT utilizes cookies to maintain your workspace state without tracking ad pixels.",
    url: "https://preyt.integralgroups.in/legal/cookies",
    siteName: "PreYT",
  }
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 selection:bg-red-100 selection:text-red-900 flex flex-col justify-between">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Legal", url: "/legal/cookies" },
          { name: "Cookie Policy", url: "/legal/cookies" }
        ]}
      />
      <div>
        <Navbar variant="light" />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-12">
          {/* Header */}
          <div className="space-y-4 border-b border-neutral-200 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono font-bold tracking-wider uppercase">
              <Cookie className="w-3.5 h-3.5 text-neutral-700" />
              <span>TRANSPARENCY // COOKIES &amp; LOCAL STORAGE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              Cookie Policy
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-mono">
              Entity: Integral Groups Studio · Effective Date: October 29, 2026
            </p>
          </div>

          {/* Core Content Body */}
          <article className="space-y-10 text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
            
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">01.</span>
                <span>How PreYT Uses Cookies</span>
              </h2>
              <p>
                PreYT uses minimal, privacy-first cookies and browser local storage mechanisms exclusively to maintain your authenticated login session, preserve your temporary thumbnail preview state, and secure your session against CSRF vulnerabilities. <strong>We do not embed third-party surveillance ad trackers or sell creator behavioral cookies to data brokers.</strong>
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">02.</span>
                <span>Cookie Categories</span>
              </h2>
              <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-900 font-bold">
                      <th className="p-3">Type</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-600">
                    <tr>
                      <td className="p-3 font-semibold text-neutral-900">Strictly Necessary</td>
                      <td className="p-3">User session authentication, anti-forgery token, workspace authorization</td>
                      <td className="p-3">Session / 30 Days</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-neutral-900">Functional State</td>
                      <td className="p-3">Preserves your dark/light mobile preview preferences and active archetype selection</td>
                      <td className="p-3">Persistent (Local Storage)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-neutral-900">Performance Telemetry</td>
                      <td className="p-3">Anonymized latency metrics and API endpoint error telemetry</td>
                      <td className="p-3">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">03.</span>
                <span>User Choice &amp; Cookie Management</span>
              </h2>
              <p>
                You can manage or disable cookies via your browser settings at any time. Please note that disabling strictly necessary session cookies will prevent you from signing in to the PreYT creator dashboard or executing authenticated packaging audits.
              </p>
            </section>
          </article>
        </main>
      </div>

      <Footer />
    </div>
  )
}
