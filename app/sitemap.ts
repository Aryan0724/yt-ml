import { MetadataRoute } from "next"

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

  // 2. Return all active routes (blog posts will be handled by VPS later)
  return staticRoutes
}
