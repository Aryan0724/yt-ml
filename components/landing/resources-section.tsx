import Link from "next/link"
import { ArrowRight, BookOpen, Clock, Calendar, Sparkles } from "lucide-react"
import { getFeaturedPosts, getAllCategories } from "@/lib/blog-data"

export function ResourcesSection() {
  const posts = getFeaturedPosts(3)
  const categories = getAllCategories()

  return (
    <section id="resources" className="landing-col py-24 border-b border-neutral-200 relative z-10" aria-labelledby="resources-heading">
      {/* Header */}
      <div className="max-w-3xl mb-14 space-y-4">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#EE1122] text-xs font-mono font-bold tracking-wider uppercase border border-red-200/60 shadow-2xs">
          <BookOpen className="w-3.5 h-3.5 text-[#EE1122]" />
          <span>THE PREYT RESOURCE HUB</span>
        </div>

        {/* Heading */}
        <h2 id="resources-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#161512] leading-[1.12]">
          Make better decisions about <br className="hidden sm:inline" />
          <span className="text-[#EE1122]">your next YouTube video.</span>
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl font-normal leading-relaxed">
          Practical guides, creator research, and actionable insights to help you discover video opportunities, understand your competition, and prepare stronger content.
        </p>

        {/* Categories Filter Rail */}
        <div className="pt-2 flex flex-wrap items-center gap-2" aria-label="Resource Categories">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/category/${cat.slug}`}
              className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-white border border-neutral-200 text-neutral-700 hover:border-[#EE1122] hover:text-[#EE1122] hover:bg-red-50/30 transition-all shadow-2xs"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Article Cards Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="squircle-card flex flex-col justify-between hover:border-neutral-300 transition-all group bg-white"
            >
              <div className="p-6 sm:p-7 space-y-4 flex-1">
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
                <h3 className="text-lg sm:text-xl font-bold text-[#161512] leading-snug tracking-tight group-hover:text-[#EE1122] transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="focus:outline-hidden">
                    {post.title}
                  </Link>
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed line-clamp-3">
                  {post.description}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="px-6 sm:px-7 py-4 border-t border-neutral-100 bg-neutral-50/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-neutral-400 font-mono text-[11px]">
                  <Calendar className="w-3 h-3 text-neutral-400" />
                  <span>{post.publishedAt}</span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-semibold text-neutral-900 group-hover:text-[#EE1122] flex items-center gap-1 transition-colors"
                  aria-label={`Read article: ${post.title}`}
                >
                  <span>Read guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed border-neutral-200 rounded-2xl bg-neutral-50 mb-12">
          <Sparkles className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
          <p className="text-neutral-600 text-sm">New research guides are currently being prepared.</p>
        </div>
      )}

      {/* Explore All Resources CTA */}
      <div className="flex items-center justify-center pt-2">
        <Link
          href="/blog"
          className="action-button action-button--secondary text-sm font-semibold border border-neutral-200 hover:border-neutral-400 flex items-center gap-2 group transition-all"
        >
          <span>Explore All Resources</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
