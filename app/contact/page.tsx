import type { Metadata } from "next";
import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { PageTransition } from "@/components/global/page-transition";
import { BreadcrumbSchema } from "@/components/seo/json-ld";
import { Mail, MessageSquare, Twitter, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us & Support — PreYT Creator Decision Platform",
  description: "Connect with the PreYT engineering and support team. Inquiries for API access, enterprise studio packaging, and creator partnerships.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact PreYT — Creator Support & Partnerships",
    description: "Get in touch with the PreYT team. Email support, partnerships, and technical questions.",
    url: "https://preyt.integralgroups.in/contact",
    siteName: "PreYT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact PreYT — Creator Support & Partnerships",
    description: "Get in touch with the PreYT team. Email support, partnerships, and technical questions.",
  }
};

export default function ContactPage() {
  return (
    <PageTransition>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" }
        ]}
      />
      <Navbar />
      <main className="pt-44 pb-32 px-6">
        <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl md:text-8xl font-bold mb-8">Get in <br /><span className="text-gradient">Touch.</span></h1>
              <p className="text-zinc-500 text-xl max-w-lg leading-relaxed">
                Whether you're a creator seeking pre-upload packaging diagnostics or an agency scaling multi-channel productions, our team is ready to assist.
              </p>
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-6 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/10 transition-all">
                        <Mail className="w-6 h-6 text-zinc-500 group-hover:text-blue-500" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Email Support</div>
                        <a href="mailto:contact@integralgroups.in" className="text-lg font-bold hover:underline">contact@integralgroups.in</a>
                    </div>
                </div>
                <div className="flex items-center gap-6 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/10 transition-all">
                        <Twitter className="w-6 h-6 text-zinc-500 group-hover:text-blue-500" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Direct Message</div>
                        <a href="https://twitter.com/preYTAI" target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:underline">@preYTAI</a>
                    </div>
                </div>
            </div>
          </div>

          <div className="glass-card p-12 border-white/10 space-y-8 premium-shadow">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Name</label>
                    <input className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email</label>
                    <input className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all" />
                </div>
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Channel URL or Topic</label>
                <input placeholder="https://youtube.com/@yourchannel" className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all" />
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Message</label>
                <textarea rows={4} className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all resize-none" />
            </div>
            <button className="w-full py-5 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all">
                Send Message
                <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
