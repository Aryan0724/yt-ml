import { MetadataRoute } from "next"
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog-data"
import { NICHE_PACKAGING_DATA } from "@/lib/niche-packaging-data"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://preyt.integralgroups.in"

  // 21 Core public indexable pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/intelligence`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/youtube-thumbnail-analyzer`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/youtube-title-analyzer`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/youtube-video-idea-generator`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/youtube-content-gap-finder`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/youtube-thumbnail-tester`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/youtube-feed-preview`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/waitlist`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/vs/vidiq`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vs/1of10`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/integral-groups`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/cookies`,
      lastModified: new Date("2026-10-30T10:00:00.000Z"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // 6 Niche Packaging Blueprints
  const nicheRoutes: MetadataRoute.Sitemap = Object.keys(NICHE_PACKAGING_DATA).map((slug) => ({
    url: `${baseUrl}/youtube-packaging/${slug}`,
    lastModified: new Date("2026-10-30T10:00:00.000Z"),
    changeFrequency: "weekly",
    priority: 0.75,
  }))

  // 9 Educational Research Articles
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.filter((post) => post.isPublished).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt || "2026-10-30T10:00:00.000Z"),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  // 4 Research Topic Categories
  const categoryRoutes: MetadataRoute.Sitemap = BLOG_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/blog/category/${cat.slug}`,
    lastModified: new Date("2026-10-30T10:00:00.000Z"),
    changeFrequency: "weekly",
    priority: 0.65,
  }))

  return [...staticRoutes, ...nicheRoutes, ...blogRoutes, ...categoryRoutes]
}
