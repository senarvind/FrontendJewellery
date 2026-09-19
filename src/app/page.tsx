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

// 60-second ISR caching: instant page loads from edge cache, background refresh every 60s
export const revalidate = 60;

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
