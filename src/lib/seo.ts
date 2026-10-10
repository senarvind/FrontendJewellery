import type { Product } from "@/frontend/types/product";
import { STORE_CATEGORIES } from "@/frontend/types/product";

export const SITE_URL = "https://www.kesharjewellers.com";

/** Single source of truth for business details (must match Google Business Profile). */
export const BUSINESS = {
  name: "Keshar Jewellers",
  legalName: "M/S Keshar Jewellers",
  owner: "Amit Kumar Soni",
  gstin: "23APOPS3397D1ZK",
  bisRegistration: "HM/C-8290497727",
  foundingYear: "2003",
  phone: "+91-9827415111",
  phoneDisplay: "+91 98274 15111",
  email: "kesharjewellers.vrs@gmail.com",
  streetAddress: "Charkha Line, Sarafa Market",
  locality: "Sehore",
  region: "Madhya Pradesh",
  postalCode: "466001",
  country: "IN",
  googleBusinessUrl: "https://share.google/sOFxnvHEcsAJKGel4",
  // Link that opens the "Write a review" box. Replace with
  // https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID once you have the Place ID.
  googleReviewUrl: "https://share.google/sOFxnvHEcsAJKGel4",
  instagram: "https://www.instagram.com/kesharjewellers2003/",
  facebook: "https://www.facebook.com/100063885402562/",
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "22:30" },
    { days: ["Sunday"], opens: "11:00", closes: "20:00" },
  ],
  hoursDisplay: ["Mon – Sat: 10:00 AM – 10:30 PM", "Sunday: 11:00 AM – 8:00 PM"],
} as const;

export const abs = (url: string) =>
  url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;

export const categoryName = (slug: string) =>
  STORE_CATEGORIES.find((c) => c.slug === slug)?.name ??
  slug.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());

/** Readable product name built from admin fields (until the admin stores a real name). */
export function productName(p: Product): string {
  const named = p.name?.trim();
  if (named) return named;
  const type = (p.productType || "").trim();
  const material = (p.material || "").toLowerCase();
  const metal = /gold|silver|925|916/i.test(type)
    ? ""
    : material.includes("gold")
      ? "Gold"
      : material.includes("silver") || material.includes("92")
        ? "925 Silver"
        : "";
  const name = `${metal} ${type}`.replace(/\s+/g, " ").trim();
  return name ? name.replace(/\b\w/g, (ch) => ch.toUpperCase()) : p.description;
}

/** The price a shopper sees first on cards, product page, checkout and JSON-LD. */
export function visiblePrice(p: Product): number {
  if (p.category === "anklets") return p.singlePrice || p.sellingPrice;
  return p.sellingPrice;
}

export const productPath = (p: Product) => `/products/details/${p.id}`;

export function isInStock(p: Product): boolean {
  return p.stock === undefined || p.stock === null || p.stock > 0;
}

export function breadcrumbLd(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: abs(item.path) } : {}),
    })),
  };
}

/** Serialise JSON-LD safely for a <script> tag. */
export const jsonLdHtml = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
