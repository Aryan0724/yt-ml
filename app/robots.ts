import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cms",
        "/admin",
        "/api/",
        "/_next/",
        "/static/"
      ]
    },
    sitemap: "https://preyt.integralgroups.in/sitemap.xml",
  }
}
