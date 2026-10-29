import type { MetadataRoute } from "next"
import { getAllPosts, getAllCategories } from "@/lib/blog-data"
import { getAllNicheSlugs } from "@/lib/niche-packaging-data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://preyt.integralgroups.in"

  // 1. Core High-Intent Public Tool & Product Pages (Excludes noindexed thin pages)
  const staticRoutes = [
    "",
    "/features",
    "/pricing",
    "/intelligence",
    "/youtube-thumbnail-analyzer",
    "/youtube-title-analyzer",
    "/youtube-video-idea-generator",
    "/youtube-content-gap-finder",
    "/youtube-thumbnail-tester",
    "/tools/youtube-feed-preview",
    "/blog",
    "/about",
    "/changelog",
    "/contact",
    "/waitlist",
    "/vs/vidiq",
    "/vs/1of10",
    "/integral-groups",
    "/legal/terms",
    "/legal/privacy",
    "/legal/cookies"
  ].map((route) => {
    let priority = 0.7
    let changeFrequency: "daily" | "weekly" | "monthly" = "weekly"

    if (route === "") {
      priority = 1.0
      changeFrequency = "daily"
    } else if (
      route === "/youtube-thumbnail-analyzer" ||
      route === "/youtube-title-analyzer" ||
      route === "/youtube-video-idea-generator" ||
      route === "/youtube-content-gap-finder" ||
      route === "/youtube-thumbnail-tester" ||
      route === "/tools/youtube-feed-preview" ||
      route === "/features" ||
      route === "/pricing" ||
      route === "/intelligence"
    ) {
      priority = 0.95
      changeFrequency = "daily"
    } else if (route === "/blog") {
      priority = 0.9
      changeFrequency = "daily"
    } else if (route === "/vs/vidiq" || route === "/vs/1of10") {
      priority = 0.85
      changeFrequency = "weekly"
    } else if (route.startsWith("/legal")) {
      priority = 0.3
      changeFrequency = "monthly"
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority
    }
  })

  // 2. Format-Native Niche Packaging Blueprints
  const nicheSlugs = getAllNicheSlugs()
  const nicheRoutes = nicheSlugs.map((slug) => ({
    url: `${baseUrl}/youtube-packaging/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85
  }))

  // 3. Published Blog Articles (9 authoritative guides)
  const posts = getAllPosts()
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.85
  }))

  // 4. Category Archive Pages
  const categories = getAllCategories()
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/blog/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7
  }))

  return [...staticRoutes, ...nicheRoutes, ...postRoutes, ...categoryRoutes]
}
