export const dynamic = "force-static"
export const revalidate = 86400

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://preyt.integralgroups.in/sitemap.xml</loc>
    <lastmod>2026-10-30T10:45:00.000Z</lastmod>
  </sitemap>
</sitemapindex>`

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  })
}
