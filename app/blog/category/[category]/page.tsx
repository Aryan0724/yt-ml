import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { getPostsByCategory, getCategoryBySlug, getAllCategories } from "@/lib/blog-data"
import { BookOpen, Clock, Calendar, ArrowRight, ChevronRight, Sparkles } from "lucide-react"

interface PageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((cat) => ({
    category: cat.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: catSlug } = await params
  const category = getCategoryBySlug(catSlug)

  if (!category) {
    return {
      title: "Category Not Found | PreYT",
    }
  }

  const url = `https://preyt.integralgroups.in/blog/category/${category.slug}`

  return {
    title: `${category.name} Guides & Research | PreYT`,
    description: `${category.description} Read data-driven YouTube insights from the PreYT research team.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${category.name} Guides | PreYT`,
      description: category.description,
      url,
      siteName: "PreYT",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} Guides | PreYT`,
      description: category.description,
    },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: catSlug } = await params
  const category = getCategoryBySlug(catSlug)

  if (!category) {
    notFound()
  }

  const posts = getPostsByCategory(category.slug)
  const allCategories = getAllCategories()
  const catUrl = `https://preyt.integralgroups.in/blog/category/${category.slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${catUrl}#collection`,
        "url": catUrl,
        "name": `${category.name} - PreYT Resource Hub`,
        "description": category.description,
        "publisher": {
          "@type": "Organization",
          "name": "PreYT",
          "url": "https://preyt.integralgroups.in"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${catUrl}#breadcrumb`,
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
            "name": category.name,
            "item": catUrl
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
      <div className="hero-background-gradient" style={{ height: "440px" }}>
        <div className="hero-radial-glow" style={{ top: "60px", height: "280px" }} />
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
            <span className="text-white font-medium">{category.name}</span>
          </nav>

          {/* Header Banner */}
          <div className="landing-col pt-2 pb-12 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono font-bold tracking-wider uppercase border border-white/20 mb-6 backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5 text-red-400" />
              <span>CATEGORY TOPIC CLUSTER</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-4">
              {category.name}
            </h1>

            <p className="text-base sm:text-lg text-white/80 max-w-2xl font-normal leading-relaxed">
              {category.description}
            </p>
          </div>

          {/* Category Switcher Pills */}
          <div className="mt-4 mb-10 flex flex-wrap items-center gap-2 pt-6 border-t border-neutral-200">
            <Link
              href="/blog"
              className="px-4 py-2 text-xs font-medium rounded-full bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400 transition-all shadow-2xs"
            >
              All Articles
            </Link>
            {allCategories.map((cat) => {
              const isActive = cat.slug === category.slug
              return (
                <Link
                  key={cat.slug}
                  href={`/blog/category/${cat.slug}`}
                  className={`px-4 py-2 text-xs rounded-full transition-all shadow-2xs ${
                    isActive
                      ? "bg-[#161512] text-white font-semibold"
                      : "bg-white border border-neutral-200 text-neutral-700 hover:border-[#EE1122] hover:text-[#EE1122]"
                  }`}
                >
                  {cat.name}
                </Link>
              )
            })}
          </div>

          {/* Filtered Articles Grid */}
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
            <div className="p-16 text-center border border-dashed border-neutral-200 rounded-2xl bg-white shadow-xs">
              <Sparkles className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-neutral-900">No articles in this category yet</h3>
              <p className="text-neutral-500 text-sm mt-1">Our data science team is preparing upcoming research in this topic cluster.</p>
              <div className="mt-6">
                <Link
                  href="/blog"
                  className="action-button action-button--secondary text-xs px-4 py-2 font-semibold"
                >
                  View All Articles
                </Link>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  )
}
