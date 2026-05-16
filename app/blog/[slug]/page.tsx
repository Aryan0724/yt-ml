import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { PageTransition } from "@/components/global/page-transition";
import Link from "next/link";
import { ArrowLeft, Clock, Share2 } from "lucide-react";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Mock content generation based on slug
  const title = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-44 pb-32">
        <article className="max-w-4xl mx-auto px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest mb-12 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Editorial
          </Link>

          <header className="mb-16">
            <div className="flex items-center gap-6 mb-8">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                    AI Research
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 8 min read
                </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-[1.1]">{title}</h1>
            <div className="flex items-center justify-between border-y border-white/5 py-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10" />
                    <div>
                        <div className="text-sm font-bold text-white">Diamond Editorial Team</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">May 15, 2026</div>
                    </div>
                </div>
                <button className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-zinc-500 hover:text-white">
                    <Share2 className="w-4 h-4" />
                </button>
            </div>
          </header>

          <div className="prose prose-invert prose-zinc max-w-none space-y-12 text-zinc-400 text-lg leading-relaxed">
            <p className="text-xl text-white font-medium">
                The future of creator success isn't built on intuition alone. It's built on identifying the structural signals that drive human decision-making at scale.
            </p>
            <p>
                In this article, we explore the core architecture of the Diamond Intelligence Engine and how we've moved beyond simple "viral scores" to provide a multi-dimensional diagnostic of creator metadata.
            </p>
            <h2 className="text-2xl font-bold text-white pt-8">The Signal vs. The Noise</h2>
            <p>
                Most creators rely on a combination of creative flair and historical performance. While intuition is powerful, it is subject to cognitive biases and emotional variance. Diamond Intelligence acts as a "cold-blooded" diagnostic layer that evaluates concepts against global performance benchmarks.
            </p>
            <div className="p-10 rounded-[2rem] bg-zinc-900/50 border border-white/5 my-12">
                <h3 className="text-white font-bold mb-4">Key Takeaway</h3>
                <p className="text-sm italic text-zinc-500">
                    "Accuracy isn't just about predicting the high-end virality; it's about identifying the floor. Knowing when an upload will fail is as valuable as knowing when it will win."
                </p>
            </div>
            <p>
                By analyzing focal points, linguistic hooks, and niche-specific visual rules, we provide creators with the certainty they need to publish with confidence.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </PageTransition>
  )
}
