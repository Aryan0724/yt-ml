import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { PageTransition } from "@/components/global/page-transition";

export default function PrivacyPage() {
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-44 pb-32 px-6">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-16">Privacy Policy</h1>
          <div className="prose prose-invert prose-zinc max-w-none space-y-12 text-zinc-500 text-lg leading-relaxed">
            <section className="space-y-6">
                <h2 className="text-white text-2xl font-bold">1. Introduction</h2>
                <p>
                    At Diamond Intelligence, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you use our creator intelligence platform.
                </p>
            </section>
            <section className="space-y-6">
                <h2 className="text-white text-2xl font-bold">2. Data Collection</h2>
                <p>
                    We collect metadata related to your YouTube content, including titles and thumbnail variants, to provide our predictive analysis. We do not access your private account data unless explicitly authorized for feedback loops.
                </p>
            </section>
            <section className="space-y-6">
                <h2 className="text-white text-2xl font-bold">3. Use of Intelligence Models</h2>
                <p>
                    Your data is processed by our ensemble models to generate performance scores. This data may be used in an anonymized, aggregated format to improve our global intelligence benchmarks.
                </p>
            </section>
            <p className="text-sm italic border-t border-white/5 pt-12">
                Last Updated: May 2026
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </PageTransition>
  )
}
