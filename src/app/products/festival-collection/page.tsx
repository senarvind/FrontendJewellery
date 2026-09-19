import Link from "next/link";
import { getFestivalProducts } from "@/lib/api";
import ProductCard from "@/frontend/components/products/ProductCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FestivalCollectionPage() {
  const products = await getFestivalProducts();

  // Extract unique sub-categories if any
  const categoryCounts = products.reduce((acc: Record<string, number>, p) => {
    const cat = p.category ? p.category.toLowerCase().trim() : "uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const availableCategories = Object.keys(categoryCounts).filter(
    (c) => c !== "festival-collection" && c !== "festival" && c !== "uncategorized"
  );

  return (
    <main className="min-h-screen bg-[#FFF8F0] text-[#35191C] px-2.5 sm:px-8 lg:px-12 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4 sm:mb-6 flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-[#B82E44]">
          <Link href="/" className="hover:underline transition-all">
            Home
          </Link>
          <span className="text-[#6F4A4A]/40">/</span>
          <Link href="/products" className="hover:underline transition-all">
            Products
          </Link>
          <span className="text-[#6F4A4A]/40">/</span>
          <span className="text-[#35191C] font-bold">Festival Collection</span>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 px-1">
          <span className="text-[#C77D62] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-xs font-bold block mb-1.5 sm:mb-2">
            ✦ AUSPICIOUS CELEBRATIONS • 91.6 GOLD &amp; 92.5 STERLING SILVER ✦
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#9B1B30] tracking-tight mb-2 sm:mb-3">
            Festival Collection
          </h1>
          <div className="flex items-center justify-center gap-3 my-2 sm:my-3 text-[#D4AF37]/60 w-36 sm:w-48 mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
            <span className="text-sm font-serif text-[#A77C18]">🪔</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
          </div>
          <p className="font-light text-[#6F4A4A] text-xs sm:text-base leading-relaxed">
            Celebrate Dhanteras, Diwali, Navratri, and auspicious weddings with handcrafted gold, silver, and gemstone masterworks by Keshar Jewellers.
          </p>
        </div>

        {/* Category Filter Pills (if multiple categories present) */}
        {availableCategories.length > 0 && (
          <div className="overflow-x-auto scrollbar-none flex items-center justify-start sm:justify-center gap-2 sm:gap-3 pb-2 mb-6 sm:mb-10">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-[#B82E44] text-[#FFF8F0] shadow-xs whitespace-nowrap">
              All Festive Pieces ({products.length})
            </span>
            {availableCategories.map((cat) => (
              <Link
                key={cat}
                href={`/products/${cat}`}
                className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide bg-[#FFF0EA] border border-[#E8CFC5] text-[#35191C] hover:bg-[#B82E44] hover:text-[#FFF8F0] hover:border-[#B82E44] transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span className="capitalize">{cat.replace(/-/g, " ")}</span>
                <span className="text-[10px] bg-[#FFE2D8] text-[#7C1B2A] px-1.5 py-0.2 rounded-full font-bold">
                  {categoryCounts[cat]}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-6 sm:p-16 text-center max-w-2xl mx-auto shadow-sm my-6 sm:my-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-[#FFF0EA] border border-[#D4AF37]/40 flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4">
              🪔
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#9B1B30] mb-2 font-bold">
              Exclusive Festive Pieces Loading
            </h3>
            <p className="text-xs sm:text-sm text-[#6F4A4A] mb-6 leading-relaxed">
              We are adding new auspicious festive pieces to our catalog. You can also view our complete private festival collection directly on WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="https://wa.me/919827415111?text=Hello%20Keshar%20Jewellers,%20please%20share%20the%20latest%20Festival%20Collection%20catalog."
                target="_blank"
                className="px-5 py-2.5 bg-[#B82E44] hover:bg-[#7C1B2A] text-[#FFF8F0] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs inline-block"
              >
                Enquire for Festive Collection on WhatsApp
              </Link>
              <Link
                href="/products"
                className="px-5 py-2.5 bg-[#FFF0EA] border border-[#E8CFC5] hover:border-[#B82E44] text-[#7C1B2A] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all inline-block"
              >
                Explore All Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
