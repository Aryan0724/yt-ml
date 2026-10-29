import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, AlertCircle, Building } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy & DPDP Act Compliance — PreYT Creator Intelligence",
  description: "Comprehensive privacy policy detailing PreYT and Integral Groups' data protection practices under the Digital Personal Data Protection Act 2023 (DPDP Act, India), GDPR, and YouTube API Services Developer Policies.",
  alternates: {
    canonical: "/legal/privacy",
  },
  openGraph: {
    title: "Privacy Policy & DPDP Act Compliance — PreYT Platform",
    description: "Learn how PreYT safeguards creator metadata, drafts, and YouTube analytics with full DPDP Act 2023 compliance.",
    url: "https://preyt.integralgroups.in/legal/privacy",
    siteName: "PreYT",
  }
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 selection:bg-red-100 selection:text-red-900 flex flex-col justify-between">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Legal", url: "/legal/privacy" },
          { name: "Privacy Policy", url: "/legal/privacy" }
        ]}
      />
      <div>
        <Navbar variant="light" />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-12">
          {/* Header */}
          <div className="space-y-4 border-b border-neutral-200 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>DATA GOVERNANCE // DPDP ACT 2023 &amp; GDPR COMPLIANT</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              Privacy Policy &amp; Data Governance
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-mono">
              Entity: Integral Groups Studio · Effective Date: October 29, 2026 · Jurisdiction: India &amp; Global
            </p>
          </div>

          {/* Core Content Body */}
          <article className="space-y-10 text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">01.</span>
                <span>Data Fiduciary Identity &amp; Overview</span>
              </h2>
              <p>
                This Privacy Policy explains how <strong>PreYT</strong>, operated under <strong>Integral Groups Studio</strong> (&quot;PreYT&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;Data Fiduciary&quot;), collects, processes, stores, and protects personal data and creative assets when you use our website (<a href="https://preyt.integralgroups.in" className="text-red-600 underline">https://preyt.integralgroups.in</a>), web applications, and pre-upload decision APIs.
              </p>
              <p>
                We are committed to full compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act, India)</strong>, the <strong>General Data Protection Regulation (GDPR, EU)</strong>, the <strong>California Consumer Privacy Act (CCPA)</strong>, and the <strong>YouTube API Services Developer Policies</strong>.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">02.</span>
                <span>Mandatory YouTube API Services &amp; Google Disclosure</span>
              </h2>
              <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2 text-xs sm:text-sm">
                <p className="font-semibold text-neutral-900">
                  PreYT utilizes the official YouTube Data API v3 to calculate channel baseline views, view velocity, and post-publish telemetry calibration.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                  <li>
                    By authenticating your channel with PreYT via Google OAuth, you agree to be bound by the{" "}
                    <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-red-600 underline font-bold">
                      YouTube Terms of Service
                    </a>{" "}
                    and acknowledge the{" "}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-red-600 underline font-bold">
                      Google Privacy Policy
                    </a>.
                  </li>
                  <li>
                    <strong>Zero Password Storage:</strong> PreYT never accesses, requests, or stores your Google or YouTube account passwords. Authentication is handled exclusively through encrypted OAuth 2.0 PKCE tokens.
                  </li>
                  <li>
                    <strong>Revocation of Access:</strong> You can revoke PreYT&apos;s access to your YouTube channel at any time through the{" "}
                    <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noopener noreferrer" className="text-red-600 underline font-bold">
                      Google Security Permissions Settings
                    </a>.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">03.</span>
                <span>Information We Collect &amp; Purpose of Processing</span>
              </h2>
              <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-900 font-bold">
                      <th className="p-3">Data Category</th>
                      <th className="p-3">Data Elements</th>
                      <th className="p-3">Lawful Basis &amp; Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-600">
                    <tr>
                      <td className="p-3 font-semibold text-neutral-900">Account Credentials</td>
                      <td className="p-3">Email address, display name, encrypted session token</td>
                      <td className="p-3">Contractual necessity to provision your workspace session</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-neutral-900">Packaging Draft Assets</td>
                      <td className="p-3">Uploaded thumbnail images (JPEG/PNG), draft video titles, tags</td>
                      <td className="p-3">Consent &amp; processing through OpenCV computer vision for glanceability and contrast diagnostics</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-neutral-900">Channel Telemetry</td>
                      <td className="p-3">Channel ID, aggregate median view velocity, historical CTR (read-only)</td>
                      <td className="p-3">Establishing baseline multipliers and feedback-loop calibration</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-neutral-900">Diagnostic Logs</td>
                      <td className="p-3">IP address, browser user-agent, error logs</td>
                      <td className="p-3">Legitimate interest in maintaining security and preventing API DDoS abuse</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">04.</span>
                <span>Rights of Data Principals under DPDP Act 2023 (India)</span>
              </h2>
              <p>
                In strict accordance with the Digital Personal Data Protection Act, 2023, you have the following enforceable rights regarding your personal and creative data:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1.5 shadow-2xs">
                  <div className="font-bold text-xs text-neutral-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Right to Access &amp; Summary</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    You may request a complete summary of all personal data, uploaded draft files, and processing activities undertaken by PreYT.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1.5 shadow-2xs">
                  <div className="font-bold text-xs text-neutral-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Right to Correction &amp; Erasure</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    You have the right to permanently erase your account, diagnostic records, and uploaded thumbnail files from our databases at any time.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1.5 shadow-2xs">
                  <div className="font-bold text-xs text-neutral-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Right to Grievance Redressal</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    You may file a grievance directly with our designated Grievance Officer regarding any data processing concern.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1.5 shadow-2xs">
                  <div className="font-bold text-xs text-neutral-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Right to Nominate</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    You have the right to designate another individual to exercise your data principal rights in the event of death or incapacity.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">05.</span>
                <span>Mandatory Grievance Redressal Officer Contact</span>
              </h2>
              <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2 text-xs sm:text-sm">
                <p>
                  Pursuant to <strong>Section 8(10) of the Digital Personal Data Protection Act, 2023</strong>, the details of PreYT&apos;s designated Grievance Redressal Officer are as follows:
                </p>
                <div className="space-y-1 font-mono text-xs pt-2 text-neutral-800">
                  <div><strong>Designation:</strong> Data Protection &amp; Grievance Officer</div>
                  <div><strong>Entity:</strong> Integral Groups Studio</div>
                  <div><strong>Email:</strong> <a href="mailto:grievance@integralgroups.in" className="text-red-600 underline">grievance@integralgroups.in</a> / <a href="mailto:contact@integralgroups.in" className="text-red-600 underline">contact@integralgroups.in</a></div>
                  <div><strong>Headquarters:</strong> New Delhi, India</div>
                  <div><strong>Resolution Timeline:</strong> Grievances acknowledged within 48 business hours; resolved within 30 days.</div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
                <span className="text-red-600 font-mono text-base">06.</span>
                <span>Data Security &amp; Encryption Standards</span>
              </h2>
              <p>
                All data in transit is encrypted using <strong>TLS 1.3</strong> with modern cipher suites. Data at rest, including OAuth tokens, is secured using <strong>AES-256-GCM encryption</strong>. We do not sell, rent, or monetize your creative packaging files or channel subscriber telemetry to third-party ad brokers.
              </p>
            </section>
          </article>
        </main>
      </div>

      <Footer />
    </div>
  )
}
