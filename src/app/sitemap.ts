import type { MetadataRoute } from "next";
import type { Product } from "@/frontend/types/product";
import { CATEGORIES, SPECIAL_COLLECTIONS } from "@/frontend/data/categories";
import { getAllProducts } from "@/lib/api";
import { SITE_URL, abs, productPath } from "@/lib/seo";

// Rebuilt every hour so new products reach Google quickly.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: Product[] = [];
  try {
    products = await getAllProducts();
  } catch {
    // Backend asleep: still publish the static pages.
  }

  const staticPaths = [
    "/",
    "/products",
    "/products/new-arrival",
    "/products/bestsellers",
    "/products/festival-collection",
    "/products/customized-jewellery",
    "/products/price/under-999",
    "/info",
    "/policies",
  ];

  // Only list categories that have products (empty ones are noindex).
  const stocked = new Set(products.map((p) => (p.category || "").toLowerCase()));
  const categoryPaths = [...CATEGORIES, ...SPECIAL_COLLECTIONS]
    .filter((c) => products.length === 0 || stocked.has(c.slug))
    .map((c) => c.href || `/products/${c.slug}`);

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}${productPath(p)}`,
    ...(p.createdAt ? { lastModified: new Date(p.createdAt) } : {}),
    images: [p.frontImage, p.modelImage].filter(Boolean).map(abs),
  }));

  return [
    ...[...staticPaths, ...categoryPaths].map((path) => ({ url: `${SITE_URL}${path}` })),
    ...productEntries,
  ];
}
