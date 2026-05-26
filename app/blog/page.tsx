import { NavbarLight } from "@/components/landing/navbar-light";
import { FooterLight } from "@/components/landing/footer-light";
import { PageTransition } from "@/components/global/page-transition";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";

const posts = [
  {
    slug: "why-most-viral-predictions-fail",
    title: "Why Most Viral Predictions Fail",
    desc: "Understanding the difference between raw scoring and psychological signal forensic.",
    category: "AI Research",
    date: "May 15, 2026",
    readTime: "8 min"
  },
  {
    slug: "psychology-of-high-ctr-thumbnails",
    title: "The Psychology of High-CTR Thumbnails",
    desc: "A deep dive into focal points, saturation, and the curiosity gap loop.",
    category: "Thumbnail Science",
    date: "May 12, 2026",
    readTime: "12 min"
  },
  {
    slug: "confidence-vs-virality",
    title: "Confidence vs Virality: The Creator Paradox",
    desc: "Why choosing the highest score isn't always the best long-term strategy.",
    category: "Growth Intelligence",
    date: "May 10, 2026",
    readTime: "6 min"
  },
  {
    slug: "why-creator-intelligence-matters",
    title: "Why Creator Intelligence Matters",
    desc: "The transition from creative intuition to data-backed systems thinking.",
    category: "Creator Systems",
    date: "May 08, 2026",
    readTime: "10 min"
  }
]

export default function BlogPage() {
  return (
    <PageTransition>
      <NavbarLight />
      <main className="pt-24 pb-32 bg-[#FAF9F6] min-h-screen">
        <section className="px-6 max-w-[1200px] mx-auto mb-16 pt-12">
          <div className="text-[9px] font-mono font-bold text-[#FF0000] uppercase tracking-[0.2em] mb-4">[ INTELLIGENCE EDITORIAL ]</div>
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 text-zinc-900 tracking-tight">
              Intelligence <br /><span className="text-[#FF0000]">Editorial.</span>
            </h1>
            <p className="text-xs font-mono text-zinc-500 leading-relaxed">
              Research, strategies, and insights into the future of creator decision intelligence.
            </p>
          </div>
        </section>

        <section className="px-6 max-w-[1200px] mx-auto grid md:grid-cols-2 gap-6 border-t border-zinc-200 pt-12">
            {posts.map((post, i) => (
                <Link 
                    key={post.slug} 
                    href={`/blog/${post.slug}`}
                    className="group block p-8 rounded-[4px] bg-white border border-zinc-200 hover:border-zinc-400 transition-all relative overflow-hidden shadow-[3px_3px_0px_rgba(0,0,0,0.04)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.06)]"
                >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FF0000] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex flex-col h-full justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 rounded-[3px] border border-zinc-200 text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                                    {post.category}
                                </span>
                                <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" /> {post.readTime}
                                </span>
                            </div>
                            <h2 className="font-display text-xl font-bold group-hover:text-[#FF0000] transition-colors leading-tight text-zinc-900">
                                {post.title}
                            </h2>
                            <p className="text-xs font-mono text-zinc-500 leading-relaxed max-w-sm">
                                {post.desc}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest group-hover:text-black group-hover:gap-4 transition-all">
                            Read Article <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>
                </Link>
            ))}
        </section>
      </main>
      <FooterLight />
    </PageTransition>
  )
}
