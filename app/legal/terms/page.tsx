import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { PageTransition } from "@/components/global/page-transition";

export default function TermsPage() {
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-44 pb-32 px-6">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-16">Terms of Service</h1>
          <div className="prose prose-invert prose-zinc max-w-none space-y-12 text-zinc-500 text-lg leading-relaxed">
            <section className="space-y-6">
                <h2 className="text-white text-2xl font-bold">1. Service Usage</h2>
                <p>
                    By using AlgoPilot, you agree to these terms. Our service is currently in Closed Beta and is provided "as is" for engineering and testing purposes.
                </p>
            </section>
            <section className="space-y-6">
                <h2 className="text-white text-2xl font-bold">2. Predictive Nature</h2>
                <p>
                    Our platform provides performance predictions based on structural signals. We do not guarantee specific real-world views or revenue outcomes.
                </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </PageTransition>
  )
}
