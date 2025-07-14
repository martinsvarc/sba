import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/questions", "/application", "/book-call", "/thank-you", "/weappreciateyou", "/admin/", "/api/"],
      },
    ],
    sitemap: "https://solarbossautomations.com/sitemap.xml",
  }
}
