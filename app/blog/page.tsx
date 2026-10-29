import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { getAllPosts, getAllCategories } from "@/lib/blog-data"
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles, TrendingUp, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Resources & Research Hub — PreYT YouTube Intelligence",
  description: "Data-backed YouTube strategy articles, title formulas, and packaging benchmarks derived from empirical analysis of 14.8M uploads.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "PreYT Resource Hub — Creator Packaging & Decision Intelligence",
    description: "Learn how to write high-CTR titles, optimize thumbnail contrast, and discover unserved audience demand.",
    url: "https://preyt.integralgroups.in/blog",
    siteName: "PreYT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PreYT Resource Hub — Creator Packaging & Decision Intelligence",
    description: "Empirical insights from analyzing 14.8M YouTube uploads. Learn how to publish videos that earn the click.",
  }
}

export default function BlogIndexPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": "https://preyt.integralgroups.in/blog#collection",
        "url": "https://preyt.integralgroups.in/blog",
        "name": "PreYT Resource Hub",
        "description": "YouTube Packaging & Decision Intelligence Research",
        "publisher": {
          "@type": "Organization",
          "name": "PreYT",
          "url": "https://preyt.integralgroups.in"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://preyt.integralgroups.in/blog#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://preyt.integralgroups.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Resources & Blog",
            "item": "https://preyt.integralgroups.in/blog"
          }
        ]
      }
    ]
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 selection:bg-red-100 selection:text-red-900 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <Navbar variant="light" />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
          {/* Header Banner */}
          <div className="max-w-3xl space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold tracking-wider uppercase">
              <BookOpen className="w-3.5 h-3.5 text-red-600" />
              <span>THE PREYT RESOURCE HUB // 14.8M UPLOADS AUDITED</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              Creator Research &amp; <br />
              <span className="text-red-600">Packaging Intelligence.</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
              Empirical insights, format-native OpenCV computer-vision heuristics, and title formulas derived from analyzing 14.8M YouTube uploads.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="mb-10 flex flex-wrap items-center gap-2 pt-6 border-t border-neutral-200">
            <Link
              href="/blog"
              className="px-4 py-2 text-xs font-bold rounded-full bg-neutral-950 text-white transition-all shadow-xs"
            >
              All Articles ({posts.length})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/category/${cat.slug}`}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-white border border-neutral-200 text-neutral-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50/40 transition-all shadow-2xs"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md transition-all group flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-7 space-y-4 flex-1">
                    {/* Meta Badge Bar */}
                    <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                      <span className="px-2.5 py-1 rounded-md bg-neutral-100 font-semibold text-neutral-800 border border-neutral-200/60">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-neutral-950 leading-snug tracking-tight group-hover:text-red-600 transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`} className="focus:outline-hidden">
                        {post.title}
                      </Link>
                    </h2>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  {/* Card Bottom Bar */}
                  <div className="px-7 py-4 border-t border-neutral-100 bg-neutral-50/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-500 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{post.publishedAt}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-bold text-neutral-900 group-hover:text-red-600 flex items-center gap-1 transition-colors"
                      aria-label={`Read guide: ${post.title}`}
                    >
                      <span>Read guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center border border-neutral-200 rounded-2xl bg-white shadow-xs">
              <BookOpen className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-neutral-900">No articles published yet</h3>
              <p className="text-neutral-500 text-sm mt-1">Check back soon for new research reports from the PreYT team.</p>
            </div>
          )}

          {/* Bottom Conversion Prompt */}
          <div className="mt-16 p-8 sm:p-12 rounded-2xl bg-neutral-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <div className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">[ DIAGNOSTIC SIMULATOR ]</div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Benchmark your draft thumbnail before you film
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400">
                Run your draft title and thumbnail in our mobile feed simulator. Check timestamp overlaps and 54-character cutoffs in under 30 seconds.
              </p>
            </div>
            <Link
              href="/tools/youtube-feed-preview"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              Test Draft in Mobile Feed <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
