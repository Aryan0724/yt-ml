import { MetadataRoute } from "next"
import { getAllPosts, getAllCategories } from "@/lib/blog-data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://preyt.integralgroups.in"

  // 1. Static Core Marketing, Solution, & Resource Pages
  const staticRoutes = [
    "",
    "/features",
    "/pricing",
    "/intelligence",
    "/creators",
    "/brands",
    "/agencies",
    "/guides",
    "/templates",
    "/integrations",
    "/blog",
    "/about",
    "/changelog",
    "/roadmap",
    "/careers",
    "/partners",
    "/help-center",
    "/contact",
    "/waitlist",
    "/legal/terms",
    "/legal/privacy",
    "/legal/cookies"
  ].map((route) => {
    let priority = 0.7
    let changeFrequency: "daily" | "weekly" | "monthly" = "weekly"

    if (route === "") {
      priority = 1.0
      changeFrequency = "daily"
    } else if (route === "/features" || route === "/pricing" || route === "/intelligence") {
      priority = 0.9
      changeFrequency = "weekly"
    } else if (route === "/blog") {
      priority = 0.9
      changeFrequency = "daily"
    } else if (route === "/creators" || route === "/brands" || route === "/agencies" || route === "/guides") {
      priority = 0.8
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

  // 2. Published Blog Articles
  const posts = getAllPosts()
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }))

  // 3. Category Archive Pages
  const categories = getAllCategories()
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/blog/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7
  }))

  return [...staticRoutes, ...postRoutes, ...categoryRoutes]
}
