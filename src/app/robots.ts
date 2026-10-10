import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.kesharjewellers.com";

  // Account pages (cart, login, profile, orders…) are crawlable but carry
  // `noindex` via their layout.tsx — robots.txt alone cannot keep a URL out of Google.
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
