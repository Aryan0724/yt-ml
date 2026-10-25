import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/api/",
        "/cms/",
        "/admin/"
      ]
    },
    sitemap: "https://preyt.integralgroups.in/sitemap.xml",
  }
}
