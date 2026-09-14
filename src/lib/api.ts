import { Product } from "@/frontend/types/product";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://my-jewellery-backend.onrender.com"
).trim().replace(/\/+$/, "");

const DEFAULT_RENDER_BACKEND = "https://my-jewellery-backend.onrender.com";

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "sample-ring-1",
    category: "rings",
    productType: "22K Gold Solitaire Ring",
    description: "Exquisite 22K Hallmark Gold Ring crafted with precision and classic elegance.",
    material: "22K Gold",
    dimensionL: "20mm",
    dimensionW: "18mm",
    dimensionH: "5mm",
    weight: "3.5g",
    sellingPrice: 24999,
    mrp: 28999,
    frontImage: "/images/categories/ring.png",
    backImage: "/images/categories/ring.png",
    modelImage: "/images/categories/ring.png",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-necklace-1",
    category: "necklaces",
    productType: "Royal Kundan Gold Necklace",
    description: "Handcrafted 22K Gold Traditional Bridal Kundan Necklace Set.",
    material: "22K Gold",
    dimensionL: "180mm",
    dimensionW: "120mm",
    dimensionH: "15mm",
    weight: "24.5g",
    sellingPrice: 165000,
    mrp: 185000,
    frontImage: "/images/categories/Necklace.png",
    backImage: "/images/categories/Necklace.png",
    modelImage: "/images/categories/Necklace.png",
    createdAt: new Date().toISOString(),
  },
];

async function safeFetch(url: string, fallbackUrl?: string) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    // Primary request failed
  }

  if (fallbackUrl && fallbackUrl !== url) {
    try {
      const res = await fetch(fallbackUrl, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.error(`Fallback fetch failed for ${fallbackUrl}:`, err);
    }
  }
  return null;
}

export async function getAllProducts(): Promise<Product[]> {
  const primaryUrl = `${API_BASE_URL}/api/products`;
  const fallbackUrl = `${DEFAULT_RENDER_BACKEND}/api/products`;

  const data = await safeFetch(primaryUrl, fallbackUrl);
  if (data && (data.success || Array.isArray(data.products))) {
    return data.products || [];
  }
  return SAMPLE_PRODUCTS;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const primaryUrl = `${API_BASE_URL}/api/products/category/${categorySlug}`;
  const fallbackUrl = `${DEFAULT_RENDER_BACKEND}/api/products/category/${categorySlug}`;

  const data = await safeFetch(primaryUrl, fallbackUrl);
  if (data && (data.success || Array.isArray(data.products))) {
    return data.products || [];
  }

  const normalized = categorySlug.toLowerCase().trim().replace(/s$/, "");
  const filtered = SAMPLE_PRODUCTS.filter(
    (p) =>
      p.category.toLowerCase().includes(normalized) ||
      normalized.includes(p.category.toLowerCase()) ||
      p.productType.toLowerCase().includes(normalized)
  );
  return filtered;
}

export async function getProductById(id: string): Promise<Product | null> {
  const primaryUrl = `${API_BASE_URL}/api/products/${id}`;
  const fallbackUrl = `${DEFAULT_RENDER_BACKEND}/api/products/${id}`;

  const data = await safeFetch(primaryUrl, fallbackUrl);
  if (data && data.product) {
    return data.product;
  }

  const found = SAMPLE_PRODUCTS.find((p) => p.id === id || p.id.includes(id));
  return found || SAMPLE_PRODUCTS[0];
}
