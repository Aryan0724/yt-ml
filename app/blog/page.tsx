import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { getAllPosts, getAllCategories } from "@/lib/blog-data"
import { BookOpen, Clock, Calendar, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "PreYT Resource Hub | YouTube SEO, Packaging & Growth Research",
  description: "Actionable research, data-backed guides, and packaging strategies to help YouTube creators evaluate titles, thumbnails, and viewer demand before publishing.",
  alternates: {
    canonical: "https://preyt.integralgroups.in/blog",
  },
  openGraph: {
    title: "PreYT Resource Hub | YouTube SEO & Creator Intelligence",
    description: "Data-backed guides and empirical YouTube packaging insights from analyzing 14.8M uploads.",
    url: "https://preyt.integralgroups.in/blog",
    siteName: "PreYT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PreYT Resource Hub | YouTube SEO & Creator Intelligence",
    description: "Data-backed guides and empirical YouTube packaging insights from analyzing 14.8M uploads.",
  },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://preyt.integralgroups.in/blog#collection",
        "url": "https://preyt.integralgroups.in/blog",
        "name": "PreYT Resource Hub",
        "description": "Practical guides, creator research, and actionable insights to help you discover video opportunities and improve content before publishing.",
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
    <div className="landing-page-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header Gradient */}
      <div className="hero-background-gradient" style={{ height: "460px" }}>
        <div className="hero-radial-glow" style={{ top: "60px", height: "300px" }} />
      </div>

      <div className="landing relative z-10">
        <Navbar />

        <main className="w-full pt-10 pb-24">
          {/* Header Banner */}
          <div className="landing-col pt-4 pb-12 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono font-bold tracking-wider uppercase border border-white/20 mb-6 backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5 text-red-400" />
              <span>THE PREYT RESOURCE HUB</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-4">
              Creator Research &amp; <br />
              <span className="text-red-400">Packaging Intelligence.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/80 max-w-2xl font-normal leading-relaxed">
              Empirical insights from analyzing 14.8M YouTube uploads. Learn how to write high-CTR titles, optimize thumbnail contrast, and discover unserved audience demand.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-4 mb-10 flex flex-wrap items-center gap-2 pt-6 border-t border-neutral-200">
            <Link
              href="/blog"
              className="px-4 py-2 text-xs font-semibold rounded-full bg-[#161512] text-white transition-all shadow-xs"
            >
              All Articles ({posts.length})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/category/${cat.slug}`}
                className="px-4 py-2 text-xs font-medium rounded-full bg-white border border-neutral-200 text-neutral-700 hover:border-[#EE1122] hover:text-[#EE1122] hover:bg-red-50/30 transition-all shadow-2xs"
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
                  className="squircle-card flex flex-col justify-between hover:border-neutral-300 transition-all group bg-white"
                >
                  <div className="p-7 space-y-4 flex-1">
                    {/* Meta Badge Bar */}
                    <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                      <span className="px-2.5 py-1 rounded-md bg-neutral-100 font-semibold text-neutral-800 border border-neutral-200/60">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-[#161512] leading-snug tracking-tight group-hover:text-[#EE1122] transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`} className="focus:outline-hidden">
                        {post.title}
                      </Link>
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-neutral-600 font-normal leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  {/* Card Bottom Bar */}
                  <div className="px-7 py-4 border-t border-neutral-100 bg-neutral-50/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-neutral-400 font-mono text-[11px]">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      <span>{post.publishedAt}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-semibold text-neutral-900 group-hover:text-[#EE1122] flex items-center gap-1 transition-colors"
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
          <div className="mt-16 p-8 sm:p-12 rounded-2xl bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Benchmark your next video before you film
              </h3>
              <p className="text-sm text-neutral-300">
                Run your draft title and thumbnail against 14.8M uploads. Test mobile feed contrast and curiosity tension in under 30 seconds.
              </p>
            </div>
            <Link
              href="/signup"
              className="action-button action-button--hero-solid px-6 py-3 text-sm font-semibold whitespace-nowrap"
            >
              Start Free Trial
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
