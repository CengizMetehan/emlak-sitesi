import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/hesabim/", "/giris/", "/api/"],
    },

    sitemap: "https://www.bilalbasol.com/sitemap.xml",
    host: "https://www.bilalbasol.com",
  };
}
