import Link from "next/link";
import { getProductsByCategory } from "@/lib/api";
import { STORE_CATEGORIES } from "@/frontend/types/product";
import ProductCard from "@/frontend/components/products/ProductCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const products = await getProductsByCategory(category);

  // Find category meta or generate fallback
  const catMeta = STORE_CATEGORIES.find(
    (c) => c.slug.toLowerCase() === category.toLowerCase()
  );

  const categoryTitle = catMeta
    ? catMeta.name
    : category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

  const hallmark = catMeta?.hallmarkText || "✦ BIS 91.6 & 92.5 STERLING HALLMARK CERTIFIED ✦";

  // Get unique product types in this category for filter pills
  const availableTypes = Array.from(
    new Set(products.map((p) => p.productType).filter(Boolean))
  );

  return (
    <main className="min-h-screen bg-[#FFF8F0] text-[#35191C] p-4 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-[#B82E44]">
          <Link href="/" className="hover:underline transition-all">Home</Link>
          <span className="text-[#6F4A4A]/40">/</span>
          <span className="text-[#35191C] font-bold">{categoryTitle}</span>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[#C77D62] uppercase tracking-[0.25em] text-xs font-bold block mb-2">
            {hallmark}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#9B1B30] tracking-tight mb-3">
            {categoryTitle} Collection
          </h1>
          <div className="flex items-center justify-center gap-3 my-3 text-[#D4AF37]/60 w-48 mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
            <span className="text-xs font-serif text-[#A77C18]">❖</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
          </div>
          <p className="font-light text-[#6F4A4A] text-sm sm:text-base leading-relaxed">
            Discover handcrafted 22K Gold, 92.5 Sterling Silver, and Natural Gemstone {categoryTitle.toLowerCase()} designed for eternal elegance by Keshar Jewellers.
          </p>
        </div>

        {/* Filter Pills */}
        {availableTypes.length > 0 && (
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
            <button className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-[#B82E44] text-[#FFF8F0] shadow-sm">
              All {categoryTitle} ({products.length})
            </button>
            {availableTypes.map((type) => (
              <span
                key={type}
                className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide bg-[#FFF0EA] border border-[#E8CFC5] text-[#35191C]"
              >
                {type}
              </span>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto shadow-sm my-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF0EA] border border-[#D4AF37]/40 flex items-center justify-center text-2xl mb-4">
              💎
            </div>
            <h3 className="font-serif text-2xl text-[#9B1B30] mb-2">
              New Designs Launching Soon
            </h3>
            <p className="text-sm text-[#6F4A4A] mb-6 leading-relaxed">
              We are curating exquisite new handcrafted pieces for our {categoryTitle} collection. Custom orders and instant catalog previews are available directly on WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`https://wa.me/919827415111?text=Hello%20Keshar%20Jewellers,%20please%20share%20the%20latest%20designs%20for%20${encodeURIComponent(categoryTitle)}.`}
                target="_blank"
                className="px-6 py-2.5 bg-[#B82E44] hover:bg-[#7C1B2A] text-[#FFF8F0] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
              >
                Enquire for {categoryTitle} on WhatsApp
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
