import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { getPostBySlug, getAllPosts } from "@/lib/blog-data"
import { Clock, Calendar, ArrowRight, ChevronRight, Share2, Sparkles, User, Tag } from "lucide-react"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: "Article Not Found | PreYT",
    }
  }

  const url = `https://preyt.integralgroups.in/blog/${post.slug}`

  return {
    title: `${post.title} | PreYT Guide`,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: "PreYT",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Related articles
  const allPosts = getAllPosts()
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && (post.relatedSlugs.includes(p.slug) || p.categorySlug === post.categorySlug))
    .slice(0, 2)

  const articleUrl = `https://preyt.integralgroups.in/blog/${post.slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${articleUrl}#article`,
        "isPartOf": {
          "@type": "Blog",
          "@id": "https://preyt.integralgroups.in/blog#collection",
          "name": "PreYT Resource Hub"
        },
        "headline": post.title,
        "description": post.description,
        "datePublished": post.publishedAt,
        "dateModified": post.updatedAt || post.publishedAt,
        "mainEntityOfPage": articleUrl,
        "articleSection": post.category,
        "keywords": post.tags.join(", "),
        "author": {
          "@type": "Organization",
          "name": post.author.name,
          "url": "https://preyt.integralgroups.in"
        },
        "publisher": {
          "@type": "Organization",
          "name": "PreYT",
          "url": "https://preyt.integralgroups.in",
          "logo": {
            "@type": "ImageObject",
            "url": "https://preyt.integralgroups.in/preyt-logo-dark.png"
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${articleUrl}#breadcrumb`,
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
            "name": "Resources",
            "item": "https://preyt.integralgroups.in/blog"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.category,
            "item": `https://preyt.integralgroups.in/blog/category/${post.categorySlug}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": post.title,
            "item": articleUrl
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

      {/* Subtle Top Ambient Gradient */}
      <div className="hero-background-gradient" style={{ height: "420px" }}>
        <div className="hero-radial-glow" style={{ top: "40px", height: "260px" }} />
      </div>

      <div className="landing relative z-10">
        <Navbar />

        <main className="w-full pt-8 pb-24">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-white/80 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-white/40 shrink-0" />
            <Link href="/blog" className="hover:text-white transition-colors">
              Resources
            </Link>
            <ChevronRight className="w-3 h-3 text-white/40 shrink-0" />
            <Link href={`/blog/category/${post.categorySlug}`} className="hover:text-white transition-colors">
              {post.category}
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-12 max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/blog/category/${post.categorySlug}`}
                className="px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md hover:bg-white/25 transition-all"
              >
                {post.category}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-white/80 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12]">
              {post.title}
            </h1>

            <p className="text-base sm:text-xl text-white/90 leading-relaxed font-normal">
              {post.description}
            </p>

            {/* Author & Date Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 text-xs text-white/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">{post.author.name}</div>
                  <div className="text-[11px] text-white/70">{post.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published {post.publishedAt}</span>
              </div>
            </div>
          </header>

          {/* Article Grid Layout: Content (8 cols) + Sidebar TOC (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Main Content Body */}
            <article className="lg:col-span-8 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 md:p-12 shadow-xs space-y-8 prose-neutral max-w-none">
              
              {/* Render Structured Content */}
              <div className="space-y-6 text-neutral-800 leading-relaxed font-normal text-base sm:text-[17px]">
                {post.content.split("\n\n").map((block, idx) => {
                  const trimmed = block.trim()

                  if (trimmed.startsWith("## ")) {
                    const headingText = trimmed.replace("## ", "")
                    const headingId = headingText
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "")
                    return (
                      <h2
                        key={idx}
                        id={headingId}
                        className="text-2xl sm:text-3xl font-bold text-[#161512] tracking-tight pt-6 pb-2 border-b border-neutral-100 scroll-mt-24"
                      >
                        {headingText}
                      </h2>
                    )
                  }

                  if (trimmed.startsWith("### ")) {
                    const headingText = trimmed.replace("### ", "")
                    const headingId = headingText
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "")
                    return (
                      <h3
                        key={idx}
                        id={headingId}
                        className="text-xl sm:text-2xl font-bold text-[#161512] tracking-tight pt-4 pb-1 scroll-mt-24"
                      >
                        {headingText}
                      </h3>
                    )
                  }

                  if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
                    const items = trimmed.split("\n").map((line) => line.replace(/^[\*\-]\s+/, ""))
                    return (
                      <ul key={idx} className="space-y-2 my-4 list-disc pl-5 text-neutral-700">
                        {items.map((item, itemIdx) => (
                          <li key={itemIdx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )
                  }

                  if (trimmed.startsWith("1. ")) {
                    const items = trimmed.split("\n").map((line) => line.replace(/^\d+\.\s+/, ""))
                    return (
                      <ol key={idx} className="space-y-2 my-4 list-decimal pl-5 text-neutral-700">
                        {items.map((item, itemIdx) => (
                          <li key={itemIdx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ol>
                    )
                  }

                  if (trimmed.startsWith("|")) {
                    const rows = trimmed.split("\n").filter((r) => !r.includes(":---") && !r.includes("---"))
                    if (rows.length === 0) return null
                    const headerCells = rows[0].split("|").filter(Boolean).map((c) => c.trim())
                    const dataRows = rows.slice(1).map((r) => r.split("|").filter(Boolean).map((c) => c.trim()))
                    return (
                      <div key={idx} className="my-6 overflow-x-auto rounded-xl border border-neutral-200">
                        <table className="w-full text-sm text-left border-collapse">
                          <thead className="bg-neutral-50 border-b border-neutral-200 font-bold text-neutral-900">
                            <tr>
                              {headerCells.map((h, hIdx) => (
                                <th key={hIdx} className="p-3 font-semibold">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {dataRows.map((row, rIdx) => (
                              <tr key={rIdx} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-3 text-neutral-700 font-mono text-xs">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  }

                  if (trimmed === "---") {
                    return <hr key={idx} className="my-8 border-neutral-200" />
                  }

                  return (
                    <p key={idx} className="text-neutral-700 leading-relaxed">
                      {trimmed}
                    </p>
                  )
                })}
              </div>

              {/* In-Article Feature Callout Box */}
              <div className="my-8 p-6 sm:p-8 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#EE1122] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#EE1122]" />
                  <span>PRE-UPLOAD PACKAGING DIAGNOSTIC</span>
                </div>
                <h4 className="text-xl font-bold text-[#161512] tracking-tight">
                  Test your title and thumbnail before spending 40 hours filming.
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  The PreYT engine simulates mobile screen cutoffs, checks dark theme contrast, and flags missing curiosity hooks in your title.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/signup"
                    className="action-button action-button--primary text-xs px-5 py-2.5 font-semibold"
                  >
                    Start Free Audit
                  </Link>
                  <Link
                    href="/#draft"
                    className="action-button action-button--secondary text-xs px-4 py-2.5 font-semibold border border-neutral-200"
                  >
                    Try Title Sandbox
                  </Link>
                </div>
              </div>

              {/* Tags */}
              <div className="pt-8 border-t border-neutral-200 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-neutral-400 mr-2 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Tags:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>

            {/* Sidebar (4 cols) */}
            <aside className="lg:col-span-4 space-y-8 sticky top-6">
              
              {/* Table of Contents Box */}
              {post.tableOfContents.length > 0 && (
                <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-2xs space-y-3">
                  <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    Table of Contents
                  </h3>
                  <nav aria-label="Table of Contents">
                    <ul className="space-y-2 text-xs sm:text-sm">
                      {post.tableOfContents.map((item) => (
                        <li
                          key={item.id}
                          className={item.level === 3 ? "pl-4 text-neutral-500" : "font-medium text-neutral-800"}
                        >
                          <a
                            href={`#${item.id}`}
                            className="hover:text-[#EE1122] transition-colors block py-0.5 line-clamp-1"
                          >
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}

              {/* Related Articles Card */}
              {relatedPosts.length > 0 && (
                <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-2xs space-y-4">
                  <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    Related Research
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((related) => (
                      <div key={related.slug} className="space-y-1.5 group">
                        <span className="text-[10px] font-mono font-semibold text-neutral-400 uppercase">
                          {related.category}
                        </span>
                        <h4 className="text-sm font-bold text-[#161512] group-hover:text-[#EE1122] transition-colors leading-snug">
                          <Link href={`/blog/${related.slug}`}>
                            {related.title}
                          </Link>
                        </h4>
                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                          {related.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sidebar Quick Audit CTA */}
              <div className="p-6 bg-[#161512] text-white rounded-2xl space-y-3 shadow-md">
                <span className="text-[11px] font-mono text-red-400 font-bold uppercase tracking-wider">
                  FREE CREATOR TRIAL
                </span>
                <h4 className="text-base font-bold leading-snug">
                  Never flop a YouTube upload again.
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Audit your title, contrast, and curiosity tension against 14.8M uploads before you film.
                </p>
                <Link
                  href="/signup"
                  className="action-button action-button--hero-solid text-xs px-4 py-2.5 w-full text-center mt-2 font-semibold"
                >
                  Start Free Trial →
                </Link>
              </div>

            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
