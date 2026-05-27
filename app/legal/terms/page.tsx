import { NavbarLight } from "@/components/landing/navbar-light";
import { FooterLight } from "@/components/landing/footer-light";
import { PageTransition } from "@/components/global/page-transition";

export default function TermsPage() {
  return (
    <PageTransition>
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
                <h2 className="text-zinc-900 text-2xl font-bold font-display">1. Service Usage</h2>
                <p>
                    By using preYT, you agree to these terms. Our service is currently in Closed Beta and is provided "as is" for engineering and testing purposes.
                </p>
            </section>
            <section className="space-y-6">
                <h2 className="text-zinc-900 text-2xl font-bold font-display">2. Predictive Nature</h2>
                <p>
                    Our platform provides performance predictions based on structural signals. We do not guarantee specific real-world views or revenue outcomes.
                </p>
            </section>
          </div>
        </article>
      </main>
      <FooterLight />
    </PageTransition>
  )
}
