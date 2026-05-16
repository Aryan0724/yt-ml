import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
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
      <Navbar />
      <main className="pt-44 pb-32">
        <section className="px-6 max-w-7xl mx-auto mb-24">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-8">Intelligence <br /><span className="text-gradient">Editorial.</span></h1>
            <p className="text-zinc-500 text-xl leading-relaxed">
              Research, strategies, and insights into the future of creator decision intelligence.
            </p>
          </div>
        </section>

        <section className="px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
            {posts.map((post, i) => (
                <Link 
                    key={post.slug} 
                    href={`/blog/${post.slug}`}
                    className="group block p-10 rounded-[3rem] glass-card border-white/5 hover:border-white/10 transition-all relative overflow-hidden"
                >
                    <div className="flex flex-col h-full justify-between gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    {post.category}
                                </span>
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {post.readTime}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold group-hover:text-blue-400 transition-colors leading-tight">
                                {post.title}
                            </h2>
                            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                                {post.desc}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest group-hover:gap-4 transition-all">
                            Read Article <ChevronRight className="w-4 h-4 text-blue-500" />
                        </div>
                    </div>
                </Link>
            ))}
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
