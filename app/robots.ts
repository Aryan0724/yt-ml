import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/login",
        "/signup",
        "/register",
        "/spec/",
      ]
    },
    sitemap: [
      "https://preyt.integralgroups.in/sitemap.xml",
      "https://preyt.integralgroups.in/sitemap_index.xml"
    ]
  }
}
