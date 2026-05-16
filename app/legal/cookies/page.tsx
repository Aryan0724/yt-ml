import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { PageTransition } from "@/components/global/page-transition";

export default function CookiesPage() {
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-44 pb-32 px-6">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-16">Cookie Policy</h1>
          <div className="prose prose-invert prose-zinc max-w-none space-y-12 text-zinc-500 text-lg leading-relaxed">
            <p>
                We use cookies to enhance your intelligence experience and remember your workspace settings.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </PageTransition>
  )
}
