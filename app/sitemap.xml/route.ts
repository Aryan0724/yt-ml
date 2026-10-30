import { getAllPosts, getAllCategories } from "@/lib/blog-data"
import { getAllNicheSlugs } from "@/lib/niche-packaging-data"

export const dynamic = "force-static"

export async function GET() {
  const baseUrl = "https://preyt.integralgroups.in"

  const staticRoutes = [
    { path: "", priority: "1.0", changefreq: "daily" },
    { path: "/features", priority: "0.95", changefreq: "daily" },
    { path: "/pricing", priority: "0.95", changefreq: "daily" },
    { path: "/intelligence", priority: "0.95", changefreq: "daily" },
    { path: "/youtube-thumbnail-analyzer", priority: "0.95", changefreq: "daily" },
    { path: "/youtube-title-analyzer", priority: "0.95", changefreq: "daily" },
    { path: "/youtube-video-idea-generator", priority: "0.95", changefreq: "daily" },
    { path: "/youtube-content-gap-finder", priority: "0.95", changefreq: "daily" },
    { path: "/youtube-thumbnail-tester", priority: "0.95", changefreq: "daily" },
    { path: "/tools/youtube-feed-preview", priority: "0.95", changefreq: "daily" },
    { path: "/blog", priority: "0.9", changefreq: "daily" },
    { path: "/about", priority: "0.7", changefreq: "weekly" },
    { path: "/changelog", priority: "0.7", changefreq: "weekly" },
    { path: "/contact", priority: "0.7", changefreq: "weekly" },
    { path: "/waitlist", priority: "0.7", changefreq: "weekly" },
    { path: "/vs/vidiq", priority: "0.85", changefreq: "weekly" },
    { path: "/vs/1of10", priority: "0.85", changefreq: "weekly" },
    { path: "/integral-groups", priority: "0.7", changefreq: "weekly" },
    { path: "/legal/terms", priority: "0.3", changefreq: "monthly" },
    { path: "/legal/privacy", priority: "0.3", changefreq: "monthly" },
    { path: "/legal/cookies", priority: "0.3", changefreq: "monthly" },
  ]

  const now = new Date().toISOString()

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

  for (const r of staticRoutes) {
    xml += `  <url>\n    <loc>${baseUrl}${r.path}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`
  }

  for (const slug of getAllNicheSlugs()) {
    xml += `  <url>\n    <loc>${baseUrl}/youtube-packaging/${slug}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`
  }

  for (const post of getAllPosts()) {
    const postDate = new Date(post.updatedAt || post.publishedAt || now).toISOString()
    xml += `  <url>\n    <loc>${baseUrl}/blog/${post.slug}</loc>\n    <lastmod>${postDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`
  }

  for (const cat of getAllCategories()) {
    xml += `  <url>\n    <loc>${baseUrl}/blog/category/${cat.slug}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`
  }

  xml += `</urlset>`

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  })
}
