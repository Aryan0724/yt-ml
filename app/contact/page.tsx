import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { PageTransition } from "@/components/global/page-transition";
import { Mail, MessageSquare, Twitter, ArrowRight } from "lucide-react";

export default function ContactPage() {
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-44 pb-32 px-6">
        <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl md:text-8xl font-bold mb-8">Get in <br /><span className="text-gradient">Touch.</span></h1>
              <p className="text-zinc-500 text-xl max-w-lg leading-relaxed">
                Whether you're a creator seeking beta access or a partner interested in our systems thinking, we're ready to connect.
              </p>
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-6 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/10 transition-all">
                        <Mail className="w-6 h-6 text-zinc-500 group-hover:text-blue-500" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Email Support</div>
                        <div className="text-lg font-bold">hello@diamondintelligence.ai</div>
                    </div>
                </div>
                <div className="flex items-center gap-6 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/10 transition-all">
                        <Twitter className="w-6 h-6 text-zinc-500 group-hover:text-blue-500" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Direct Message</div>
                        <div className="text-lg font-bold">@DiamondIntell</div>
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
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Subject</label>
                <select className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer">
                    <option>Business Inquiry</option>
                    <option>Beta Support</option>
                    <option>Partnerships</option>
                    <option>General</option>
                </select>
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Message</label>
                <textarea rows={5} className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all resize-none" />
            </div>
            <button className="w-full py-5 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-3">
                Send Transmission <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
