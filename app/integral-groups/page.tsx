import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { Boxes, Zap, Globe, Cpu, Target, ArrowRight, ShieldCheck, Terminal } from "lucide-react"

export const metadata: Metadata = {
  title: "Integral Groups Studio — The Systems Architecture Studio Behind PreYT",
  description: "Integral Groups is an execution-first systems engineering studio based in India. We design intelligent infrastructure, creator analytics, and autonomous software platforms.",
  alternates: {
    canonical: "https://preyt.integralgroups.in/integral-groups",
  },
  openGraph: {
    title: "Integral Groups Studio — Systems & Decision Architecture",
    description: "An execution-first systems studio focused on intelligent infrastructure and creator decision intelligence.",
    url: "https://preyt.integralgroups.in/integral-groups",
    siteName: "PreYT",
  }
}

export default function IntegralGroupsPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 selection:bg-red-100 selection:text-red-900 flex flex-col justify-between">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Integral Groups", url: "/integral-groups" }
        ]}
      />
      <div>
        <Navbar variant="light" />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-20">
          {/* Header */}
          <section className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-mono font-bold tracking-wider uppercase">
              <Terminal className="w-3.5 h-3.5 text-neutral-800" />
              <span>STUDIO PROFILE // INTEGRAL GROUPS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-neutral-950 tracking-tight leading-[1.08]">
              Built Under the <br />
              <span className="text-red-600">Integral Groups.</span>
            </h1>

            <p className="text-base sm:text-xl text-neutral-600 font-normal leading-relaxed">
              An execution-first systems engineering studio focused on intelligent software architecture, algorithmic telemetry, and next-generation creator intelligence infrastructure.
            </p>
          </section>

          {/* Pillars */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                <Boxes className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-950">Systems Thinking</h2>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                We do not build superficial features; we build rigorous algorithmic systems. Every product under Integral Groups is an iteration on robust architecture engineered for scalability, precision, and privacy.
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-950">Execution First</h2>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                The difference between a research paper and a successful product is relentless execution. We prioritize low-latency inference, computer vision accuracy, and measurable creator lift over abstract complexity.
              </p>
            </div>
          </section>

          {/* Infrastructure Grid */}
          <section className="p-8 sm:p-12 rounded-3xl bg-neutral-950 text-white space-y-8">
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">[ CAPABILITY MATRIX ]</div>
              <h2 className="text-2xl sm:text-3xl font-black">Intelligence as Infrastructure</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono text-xs">
              {[
                { label: "AI Infrastructure", icon: Cpu, sub: "Computer Vision & NLP" },
                { label: "Data Telemetry", icon: Globe, sub: "YouTube API Ingestion" },
                { label: "Creator Forensics", icon: Target, sub: "Packaging Benchmarks" },
                { label: "Automation Core", icon: Zap, sub: "Closed-Loop Learning" }
              ].map((item) => (
                <div key={item.label} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <item.icon className="w-6 h-6 text-red-500" />
                  <div className="font-bold text-white text-sm">{item.label}</div>
                  <div className="text-[11px] text-neutral-400 font-sans">{item.sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Studio */}
          <section className="p-8 rounded-2xl bg-white border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-neutral-950">Partner with Integral Groups Studio</h3>
              <p className="text-xs text-neutral-600">Enterprise studio deployments, API integration, and research inquiries.</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              Contact Studio <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  )
}
