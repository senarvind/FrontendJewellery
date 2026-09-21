import HeroSection from "@/frontend/components/hero/HeroSection";
import CategoryCarousel from "@/frontend/components/categories/CategoryCarousel";
import FeaturedJewelleryCarousel from "@/frontend/components/categories/FeaturedJewelleryCarousel";
import SpecialCollectionCarousel from "@/frontend/components/categories/SpecialCollectionCarousel";
import CategoryProductsShowcase from "@/frontend/components/home/CategoryProductsShowcase";
import ShopByPrice from "@/frontend/components/pricing/ShopByPrice";
import TrustSection from "@/frontend/components/home/TrustSection";
import WhatsAppButton from "@/frontend/components/layout/WhatsAppButton";
import { CATEGORIES } from "@/frontend/data/categories";
import { getAllProducts } from "@/lib/api";

<<<<<<< HEAD
export const revalidate = 60; // Revalidate every 60 seconds for production speed

function normalizeCategorySlug(slug: string): string {
  const compactSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  const aliases: Record<string, string> = {
    nosepins: "nosepin",
    nosepin: "nosepin",
    evileyes: "evileye",
    evileye: "evileye",
    pendents: "pendants",
    pendant: "pendants",
    pendants: "pendants",
  };

  return aliases[compactSlug] || compactSlug.replace(/s$/, "");
}

function categoryName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getUniqueCategories(): Promise<CategoryItem[]> {
  const uniqueCategories = new Map<string, CategoryItem>();

  for (const category of CATEGORIES) {
    uniqueCategories.set(normalizeCategorySlug(category.slug || category.name), category);
  }

  const allProducts = await getAllProducts();

  for (const product of allProducts) {
    if (!product.category) continue;
    const slug = product.category.toLowerCase().trim().replace(/\s+/g, "-");
    if (!slug) continue;

    const key = normalizeCategorySlug(slug);
    if (!uniqueCategories.has(key)) {
      uniqueCategories.set(key, {
        id: CATEGORIES.length + uniqueCategories.size + 1,
        name: categoryName(slug),
        slug,
        icon: "✨",
        image: product.frontImage || undefined,
        gradient: "from-[#FDE8E9] to-[#F7D2D6]",
        href: `/products/${slug}`,
      });
    }
  }

  return Array.from(uniqueCategories.values());
}
=======
// force-dynamic: Build time pe heavy data fetch avoid karo (Base64 images ~44MB)
// Jab images URL-based ho jaaye tab ISR (revalidate=60) pe switch karein
export const dynamic = "force-dynamic";
>>>>>>> 7fec2451a8e278a0263f2c87cb1e75d688ca4e95

export default async function Home() {
  const allProducts = await getAllProducts();

  return (
    <main className="min-h-screen bg-[#FFF8F0] flex flex-col">

      {/* 1. Hero Slider Banner */}
      <HeroSection />

      {/* 2. Shop by Category — Sirf fixed CATEGORIES dikhao, database se koi naya category nahi */}
      <CategoryCarousel categories={CATEGORIES} />

      {/* 3. Featured Jewellery Carousel (Mangalsutra, Chains, Pendants, Bridal, Necklaces) */}
      <FeaturedJewelleryCarousel categories={CATEGORIES} />

      {/* 4. Divine Articles, Gifts & Lifestyle — SPECIAL_COLLECTIONS se aata hai */}
      <SpecialCollectionCarousel />

      {/* 5. Products Showcase (Real Admin Products) */}
      <CategoryProductsShowcase initialProducts={allProducts} />

      {/* 6. Shop by Price Section */}
      <ShopByPrice />

      {/* 7. Trust & USP Section */}
      <TrustSection />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

    </main>
  );
}
