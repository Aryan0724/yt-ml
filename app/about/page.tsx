import type { Metadata } from "next";
import { NavbarLight } from "@/components/landing/navbar-light";
import { Footer } from "@/components/landing/footer";
import { PageTransition } from "@/components/global/page-transition";
import { BreadcrumbSchema } from "@/components/seo/json-ld";
import { Target, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "How PreYT Helps Creators Validate YouTube Video Packaging | PreYT",
  description: "Learn how PreYT empowers YouTube creators and studios with pre-upload packaging diagnostics, computer vision thumbnail analysis, and algorithmic certainty.",
  alternates: {
    canonical: "https://preyt.integralgroups.in/about",
  },
  openGraph: {
    title: "How PreYT Helps Creators Validate YouTube Video Packaging",
    description: "Empowering creators with pre-publish thumbnail and title analytics before filming.",
    url: "https://preyt.integralgroups.in/about",
    siteName: "PreYT",
  },
  twitter: {
    card: "summary_large_image",
    title: "How PreYT Helps Creators Validate YouTube Video Packaging",
    description: "Empowering creators with pre-publish thumbnail and title analytics before filming.",
  }
};

export default function AboutPage() {
  return (
    <PageTransition>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" }
        ]}
      />
      <NavbarLight />
      <main className="pt-24 pb-32 px-6 bg-[#FAF9F6] min-h-screen">
        <section className="max-w-[1200px] mx-auto space-y-16 pt-12">
            <div>
                <div className="text-[9px] font-mono font-bold text-[#FF0000] uppercase tracking-[0.2em] mb-4">[ THE STORY ]</div>
                <h1 className="font-display text-4xl sm:text-6xl font-bold mb-4 text-zinc-900 tracking-tight">
                  How PreYT Helps Creators <br /><span className="text-[#FF0000]">Validate Video Packaging</span>
                </h1>
                <p className="text-xs font-mono text-zinc-500 leading-relaxed max-w-2xl">
                    PreYT was born out of a simple observation: creators are working harder than ever, but publishing with less certainty. We provide statistical clarity before you hit upload.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-px border border-zinc-200 bg-zinc-200">
                {[
                    { title: "Our Mission", index: "01", icon: Target, desc: "To provide creators with professional-grade decision intelligence before every publish." },
                    { title: "Our Philosophy", index: "02", icon: ShieldCheck, desc: "Accuracy over aesthetics. Signal over noise. Certainty over hype." },
                    { title: "Our Studio", index: "03", icon: Zap, desc: "Built by Integral Groups, a systems-first execution studio." }
                ].map((item) => (
                    <div key={item.title} className="space-y-4 p-8 bg-[#FAF9F6]">
                        <div className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">[ {item.index} / MODULE ]</div>
                        <div className="w-10 h-10 rounded-[4px] bg-white border border-zinc-200 flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.04)]">
                            <item.icon className="w-4 h-4 text-zinc-500" />
                        </div>
                        <h2 className="font-display text-lg font-bold text-zinc-900">{item.title}</h2>
                        <p className="text-xs font-mono text-zinc-500 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="p-12 rounded-[4px] bg-zinc-950 border border-zinc-900 text-center shadow-[5px_5px_0px_rgba(0,0,0,0.15)]">
                <div className="text-[9px] font-mono font-bold text-[#FF0000] uppercase tracking-[0.2em] mb-4">[ FOR_PROFESSIONALS ]</div>
                <h2 className="font-display text-3xl font-bold mb-4 text-white">Built for the Professional Creator.</h2>
                <p className="text-zinc-400 text-xs font-mono leading-relaxed mb-8 max-w-lg mx-auto">
                    We don't build tools for everyone. We build for the serious creator who treats their channel like a high-performance system.
                </p>
                <a href="/waitlist" className="inline-flex items-center gap-2 px-6 py-3 rounded-[4px] bg-white text-black font-mono font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-[3px_3px_0px_rgba(255,255,255,0.15)] hover:shadow-none">
                  Join Waitlist →
                </a>
            </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
