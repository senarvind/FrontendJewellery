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

// force-dynamic: Build time pe heavy data fetch avoid karo (Base64 images ~44MB)
// Jab images URL-based ho jaaye tab ISR (revalidate=60) pe switch karein
export const dynamic = "force-dynamic";

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
