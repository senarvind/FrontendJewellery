import HeroSection from "@/frontend/components/hero/HeroSection";
import CategoryCarousel from "@/frontend/components/categories/CategoryCarousel";
import FeaturedJewelleryCarousel from "@/frontend/components/categories/FeaturedJewelleryCarousel";
import SpecialCollectionCarousel from "@/frontend/components/categories/SpecialCollectionCarousel";
import CategoryProductsShowcase from "@/frontend/components/home/CategoryProductsShowcase";
import ShopByPrice from "@/frontend/components/pricing/ShopByPrice";
import TrustSection from "@/frontend/components/home/TrustSection";
import WhatsAppButton from "@/frontend/components/layout/WhatsAppButton";
import { CATEGORIES, CategoryItem } from "@/frontend/data/categories";
import { getAllProducts } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default async function Home() {
  const categories = await getUniqueCategories();

  return (
    <main className="min-h-screen bg-[#FFF8F0] flex flex-col">

      {/* 1. Hero Slider Banner */}
      <HeroSection />

      {/* 2. Horizontal Category Carousel */}
      <CategoryCarousel categories={categories} />

      {/* 2.5 Featured Jewellery Carousel (Exclusive Mangalsutra, Chains, Pendants, Bridal & Necklaces) */}
      <FeaturedJewelleryCarousel categories={categories} />

      {/* 2.8 Divine Articles, Gifts & Lifestyle Carousel */}
      <SpecialCollectionCarousel />

      {/* 3. Category Products Showcase (Real Admin Created Products) */}
      <CategoryProductsShowcase />

      {/* 4. Shop by Price Section */}
      <ShopByPrice />

      {/* 5. Trust & USP Section */}
      <TrustSection />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

    </main>
  );
}

