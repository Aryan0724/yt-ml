import { MetadataRoute } from "next"
import { getAllPosts, getAllCategories } from "@/lib/blog-data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://preyt.integralgroups.in"

  // 1. Static Core Marketing & Public Platform Pages
  const staticRoutes = [
    "",
    "/about",
    "/features",
    "/pricing",
    "/intelligence",
    "/blog",
    "/changelog",
    "/contact",
    "/waitlist",
    "/legal/terms",
    "/legal/privacy",
    "/legal/cookies"
  ].map((route) => {
    let priority = 0.8
    if (route === "") priority = 1.0
    if (route === "/blog") priority = 0.9
    if (route === "/pricing" || route === "/features") priority = 0.85
    if (route.startsWith("/legal")) priority = 0.3

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: (route === "" || route === "/blog" ? "daily" : "weekly") as "daily" | "weekly",
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
