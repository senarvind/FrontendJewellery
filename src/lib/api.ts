import { Product } from "@/frontend/types/product";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://jewellery-backend-1ycr.onrender.com"
).trim().replace(/\/+$/, "");

const DEFAULT_RENDER_BACKEND = "https://jewellery-backend-1ycr.onrender.com";

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

async function fetchWithTimeout(url: string, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    clearTimeout(timeoutId);
  }
  return null;
}

async function safeFetch(url: string, fallbackUrl?: string) {
  // Try primary URL with 5-second timeout
  const data = await fetchWithTimeout(url, 5000);
  if (data) return data;

  // If primary failed and fallback exists, try fallback
  if (fallbackUrl && fallbackUrl !== url) {
    return await fetchWithTimeout(fallbackUrl, 5000);
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

export async function getProductsByPriceRange(
  maxPrice: number,
  strictlyLess: boolean = true
): Promise<Product[]> {
  const allProducts = await getAllProducts();
  return allProducts.filter((p) => {
    const rawPrice = p.sellingPrice;
    const price =
      typeof rawPrice === "number"
        ? rawPrice
        : parseFloat(String(rawPrice || "").replace(/[^0-9.]/g, ""));
    if (isNaN(price) || price <= 0) return false;
    return strictlyLess ? price < maxPrice : price <= maxPrice;
  });
}

export async function getFestivalProducts(): Promise<Product[]> {
  // Try direct category endpoints first
  const [catProducts, altCatProducts, allProducts] = await Promise.all([
    getProductsByCategory("festival-collection"),
    getProductsByCategory("festival"),
    getAllProducts(),
  ]);

  const map = new Map<string, Product>();

  // 1. Add direct category products
  catProducts.forEach((p) => map.set(p.id, p));
  altCatProducts.forEach((p) => map.set(p.id, p));

  // 2. Add products from allProducts where category or title matches festive keywords
  allProducts.forEach((p) => {
    const cat = (p.category || "").toLowerCase();
    const type = (p.productType || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    if (
      cat.includes("festival") ||
      cat.includes("festive") ||
      type.includes("festival") ||
      type.includes("festive") ||
      desc.includes("festival") ||
      desc.includes("festive")
    ) {
      map.set(p.id, p);
    }
  });

  return Array.from(map.values());
}

export async function getCustomizedProducts(): Promise<Product[]> {
  const [directProducts, altProducts, allProducts] = await Promise.all([
    getProductsByCategory("customized-jewellery"),
    getProductsByCategory("customer-on-demand"),
    getAllProducts(),
  ]);

  const map = new Map<string, Product>();

  // 1. Add direct category matches
  directProducts.forEach((p) => map.set(p.id, p));
  altProducts.forEach((p) => map.set(p.id, p));

  // 2. Add matching items from general catalog
  allProducts.forEach((p) => {
    const cat = (p.category || "").toLowerCase();
    const type = (p.productType || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    if (
      cat.includes("custom") ||
      cat.includes("demand") ||
      type.includes("custom") ||
      type.includes("demand") ||
      desc.includes("custom") ||
      desc.includes("on demand") ||
      desc.includes("bespoke")
    ) {
      map.set(p.id, p);
    }
  });

  return Array.from(map.values());
}

async function safePost(endpoint: string, bodyData: any) {
  const urlsToTry = [
    `${API_BASE_URL}${endpoint}`,
    `${DEFAULT_RENDER_BACKEND}${endpoint}`,
  ];

  // Unique URLs preserving order
  const uniqueUrls = Array.from(new Set(urlsToTry));

  for (const url of uniqueUrls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const contentType = res.headers.get("content-type") || "";
      const text = await res.text();

      // Check if response is JSON
      if (contentType.includes("application/json") || text.trim().startsWith("{") || text.trim().startsWith("[")) {
        try {
          const data = JSON.parse(text);
          if (res.ok || data.success !== undefined || data.orderId || data.error) {
            return data;
          }
        } catch (parseErr) {
          console.warn(`JSON parse failed for ${url}:`, parseErr);
        }
      }
    } catch (err) {
      // Fetch error for this URL, fallback to next URL
    }
  }

  return {
    success: false,
    error: "Backend payment service is unreachable. Please ensure the Express backend is running on https://jewellery-gfwd.onrender.com",
  };
}

export async function createRazorpayOrderApi(amount: number) {
  return await safePost("/api/payment/create-order", { amount });
}

export async function verifyRazorpayPaymentApi(paymentPayload: Record<string, any>) {
  return await safePost("/api/payment/verify", paymentPayload);
}

export async function updateProductApi(id: string, updatedData: Partial<Product>) {
  const urlsToTry = [
    `${API_BASE_URL}/api/products/${id}`,
    `${DEFAULT_RENDER_BACKEND}/api/products/${id}`,
  ];
  const uniqueUrls = Array.from(new Set(urlsToTry));

  for (const url of uniqueUrls) {
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const contentType = res.headers.get("content-type") || "";
      const text = await res.text();
      if (contentType.includes("application/json") || text.trim().startsWith("{")) {
        try {
          const data = JSON.parse(text);
          if (res.ok || data.success !== undefined) return data;
        } catch {}
      }
    } catch {}
  }
  return { success: false, error: "Backend unreachable. Could not update product." };
}

export async function getOrderByIdApi(id: string) {
  if (!id) return null;
  const primaryUrl = `${API_BASE_URL}/api/orders/${encodeURIComponent(id)}`;
  const fallbackUrl = `${DEFAULT_RENDER_BACKEND}/api/orders/${encodeURIComponent(id)}`;

  const data = await safeFetch(primaryUrl, fallbackUrl);
  if (data && data.success && data.order) {
    return data.order;
  }
  return null;
}

export async function searchOrdersApi(query: string) {
  if (!query) return [];
  const primaryUrl = `${API_BASE_URL}/api/orders/search?q=${encodeURIComponent(query)}`;
  const fallbackUrl = `${DEFAULT_RENDER_BACKEND}/api/orders/search?q=${encodeURIComponent(query)}`;

  const data = await safeFetch(primaryUrl, fallbackUrl);
  if (data && data.success && Array.isArray(data.orders)) {
    return data.orders;
  }
  return [];
}

export async function getAllOrdersApi() {
  const primaryUrl = `${API_BASE_URL}/api/orders`;
  const fallbackUrl = `${DEFAULT_RENDER_BACKEND}/api/orders`;

  const data = await safeFetch(primaryUrl, fallbackUrl);
  if (data && data.success && Array.isArray(data.orders)) {
    return data.orders;
  }
  return [];
}

export async function getOrderTrackingApi(orderId: string) {
  if (!orderId) return null;
  const primaryUrl = `${API_BASE_URL}/api/tracking/${encodeURIComponent(orderId)}`;
  const fallbackUrl = `${DEFAULT_RENDER_BACKEND}/api/tracking/${encodeURIComponent(orderId)}`;

  const data = await safeFetch(primaryUrl, fallbackUrl);
  if (data && data.success && data.tracking) {
    return data.tracking;
  }
  return null;
}

export async function updateOrderTrackingApi(payload: Record<string, any>) {
  return await safePost("/api/tracking/update", payload);
}

export async function searchOrderTrackingApi(query: string) {
  if (!query) return [];
  const primaryUrl = `${API_BASE_URL}/api/tracking/search?q=${encodeURIComponent(query)}`;
  const fallbackUrl = `${DEFAULT_RENDER_BACKEND}/api/tracking/search?q=${encodeURIComponent(query)}`;

  const data = await safeFetch(primaryUrl, fallbackUrl);
  if (data && data.success && Array.isArray(data.trackings)) {
    return data.trackings;
  }
  return [];
}



// -- Offers ------------------------------------------------------------------
export interface Offer {
  _id: string;
  title: string;
  description: string;
  discountPercent: number;
  originalPrice: number;
  offerPrice: number;
  category: string;
  image: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  productLink: string;
  createdAt: string;
}

export async function getActiveOffers(): Promise<Offer[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://jewellery-gfwd.onrender.com';
  const res = await fetch(`${base}/api/offers`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

// -- Gifts -------------------------------------------------------------------
export interface Gift {
  _id: string;
  name: string;
  image: string;
}

export async function getAllGiftsApi(): Promise<Gift[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://jewellery-backend-1ycr.onrender.com';
  try {
    const res = await fetch(`${base}/api/gifts/all`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    return [];
  }
}

export async function getGiftPackingPriceApi(): Promise<number> {
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://jewellery-backend-1ycr.onrender.com';
  try {
    const res = await fetch(`${base}/api/gifts/packing-price`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.packingPrice || 0;
  } catch (err) {
    return 0;
  }
}
