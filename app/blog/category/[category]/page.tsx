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
    title: `${category.name} Guides & Research`,
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
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 selection:bg-red-100 selection:text-red-900 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <Navbar variant="light" />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-neutral-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-neutral-950 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
            <Link href="/blog" className="hover:text-neutral-950 transition-colors">
              Resources
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
            <span className="text-neutral-950 font-semibold">{category.name}</span>
          </nav>

          {/* Header Banner */}
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold tracking-wider uppercase">
              <BookOpen className="w-3.5 h-3.5 text-red-600" />
              <span>CATEGORY TOPIC CLUSTER</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              {category.name}
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
              {category.description}
            </p>
          </div>

          {/* Category Switcher Pills */}
          <div className="mb-10 flex flex-wrap items-center gap-2 pt-6 border-t border-neutral-200">
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
                  className={`px-4 py-2 text-xs rounded-full transition-all shadow-2xs font-semibold ${
                    isActive
                      ? "bg-neutral-950 text-white"
                      : "bg-white border border-neutral-200 text-neutral-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50/40"
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
                  className="rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md transition-all group flex flex-col justify-between overflow-hidden"
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
                    <h2 className="text-xl font-bold text-neutral-950 leading-snug tracking-tight group-hover:text-red-600 transition-colors line-clamp-2">
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
            <div className="p-16 text-center border border-dashed border-neutral-200 rounded-2xl bg-white shadow-xs">
              <Sparkles className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-neutral-900">No articles in this category yet</h3>
              <p className="text-neutral-500 text-sm mt-1">Our data science team is preparing upcoming research in this topic cluster.</p>
              <div className="mt-6">
                <Link
                  href="/blog"
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-300 text-neutral-700 hover:border-black transition-colors"
                >
                  View All Articles
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
