import { Product } from "@/frontend/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://my-jewellery-backend.onrender.com";

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
    id: "sample-ring-2",
    category: "rings",
    productType: "925 Sterling Silver Ring",
    description: "Royal 92.5 Sterling Silver Band with cubic zirconia stones.",
    material: "92.5 Silver",
    dimensionL: "19mm",
    dimensionW: "17mm",
    dimensionH: "4mm",
    weight: "2.8g",
    sellingPrice: 3499,
    mrp: 4499,
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
  {
    id: "sample-earring-1",
    category: "earrings",
    productType: "Traditional Gold Jhumka",
    description: "Authentic 22K Gold Jhumka Earrings with intricate Meenakari detail.",
    material: "22K Gold",
    dimensionL: "45mm",
    dimensionW: "22mm",
    dimensionH: "22mm",
    weight: "8.2g",
    sellingPrice: 58999,
    mrp: 64999,
    frontImage: "/images/categories/earrings.png",
    backImage: "/images/categories/earrings.png",
    modelImage: "/images/categories/earrings.png",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-bangle-1",
    category: "bangles",
    productType: "22K Gold Floral Bangle",
    description: "Set of 2 Premium 22K Hallmark Gold Floral Carved Bangles.",
    material: "22K Gold",
    dimensionL: "60mm",
    dimensionW: "60mm",
    dimensionH: "10mm",
    weight: "18.5g",
    sellingPrice: 128000,
    mrp: 142000,
    frontImage: "/images/categories/bangels.png",
    backImage: "/images/categories/bangels.png",
    modelImage: "/images/categories/bangels.png",
    createdAt: new Date().toISOString(),
  },
];

export async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`, { cache: "no-store" });
    if (!res.ok) return SAMPLE_PRODUCTS;
    const data = await res.json();
    return data.products || SAMPLE_PRODUCTS;
  } catch (error) {
    console.error("Failed to fetch products from backend server:", error);
    return SAMPLE_PRODUCTS;
  }
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/category/${categorySlug}`, {
      cache: "no-store",
    });
    if (!res.ok) return SAMPLE_PRODUCTS;
    const data = await res.json();
    return data.products || SAMPLE_PRODUCTS;
  } catch (error) {
    console.error(`Failed to fetch category ${categorySlug} from backend server:`, error);
    const normalized = categorySlug.toLowerCase().trim().replace(/s$/, "");
    const filtered = SAMPLE_PRODUCTS.filter(
      (p) =>
        p.category.toLowerCase().includes(normalized) ||
        normalized.includes(p.category.toLowerCase()) ||
        p.productType.toLowerCase().includes(normalized)
    );
    return filtered.length > 0 ? filtered : SAMPLE_PRODUCTS;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, { cache: "no-store" });
    if (!res.ok) return SAMPLE_PRODUCTS[0];
    const data = await res.json();
    return data.product || SAMPLE_PRODUCTS[0];
  } catch (error) {
    console.error(`Failed to fetch product ${id} from backend server:`, error);
    const found = SAMPLE_PRODUCTS.find((p) => p.id === id || p.id.includes(id));
    return found || SAMPLE_PRODUCTS[0];
  }
}
