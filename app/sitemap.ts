import { MetadataRoute } from "next"
import { supabaseServer } from "@/lib/supabase-server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://preyt.integralgroups.in"

  // 1. Static Core Marketing & Platform Pages
  const staticRoutes = [
    "",
    "/about",
    "/features",
    "/intelligence",
    "/integral-groups",
    "/blog",
    "/changelog",
    "/contact",
    "/waitlist",
    "/legal/terms",
    "/legal/privacy",
    "/legal/cookies"
  ].map((route) => {
    // Custom Search priority mapping
    let priority = 0.8
    if (route === "") priority = 1.0
    if (route.startsWith("/legal")) priority = 0.3

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: (route === "" || route === "/blog" ? "daily" : "weekly") as "daily" | "weekly",
      priority
    }
  })

  // 2. Dynamic Blog Posts from Supabase
  try {
    const { data: posts, error } = await supabaseServer
      .from("blogs")
      .select("slug, updated_at")
      .eq("status", "Published")

    if (!error && posts && posts.length > 0) {
      const dynamicBlogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7
      }))

      return [...staticRoutes, ...dynamicBlogRoutes]
    }
  } catch (err) {
    console.error("Sitemap dynamic parsing failed, using static fallback:", err)
  }

  return staticRoutes
}
