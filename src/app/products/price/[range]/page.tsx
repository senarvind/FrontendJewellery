import Link from "next/link";
import { getAllProducts } from "@/lib/api";
import ProductCard from "@/frontend/components/products/ProductCard";
import { STORE_CATEGORIES } from "@/frontend/types/product";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PriceRangePageProps {
  params: Promise<{
    range: string;
  }>;
}

function parsePriceParam(rangeSlug: string): { maxPrice: number; title: string } {
  const clean = rangeSlug.toLowerCase().trim();
  const match = clean.match(/under-(\d+)/);
  if (match && match[1]) {
    const num = parseInt(match[1], 10);
    return {
      maxPrice: num,
      title: `Under ₹${num.toLocaleString("en-IN")}`,
    };
  }
  return {
    maxPrice: 999,
    title: "Under ₹999",
  };
}

export default async function PriceRangeProductsPage({ params }: PriceRangePageProps) {
  const { range } = await params;
  const { maxPrice, title } = parsePriceParam(range);

  // Fetch all products across entire store
  const allProducts = await getAllProducts();

  // Filter products strictly where sellingPrice < maxPrice
  const filteredProducts = allProducts.filter((p) => {
    const raw = p.sellingPrice;
    const price =
      typeof raw === "number"
        ? raw
        : parseFloat(String(raw || "").replace(/[^0-9.]/g, ""));
    return !isNaN(price) && price > 0 && price < maxPrice;
  });

  // Calculate categories represented in the filtered list
  const categoryCounts = filteredProducts.reduce((acc: Record<string, number>, p) => {
    const cat = p.category ? p.category.toLowerCase().trim() : "uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const availableCategories = Object.keys(categoryCounts);

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
          <span className="text-[#35191C] font-bold">{title}</span>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 px-1">
          <span className="text-[#C77D62] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-xs font-bold block mb-1.5 sm:mb-2">
            ✦ AFFORDABLE LUXURY • 92.5 STERLING SILVER &amp; HALLMARK ✦
          </span>
          <h1 className="font-serif text-2xl sm:text-5xl lg:text-6xl text-[#9B1B30] tracking-tight mb-2 sm:mb-3">
            {title} Collection
          </h1>
          <div className="flex items-center justify-center gap-3 my-2 sm:my-3 text-[#D4AF37]/60 w-36 sm:w-48 mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
            <span className="text-[10px] sm:text-xs font-serif text-[#A77C18]">❖</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
          </div>
          <p className="font-light text-[#6F4A4A] text-xs sm:text-base leading-relaxed">
            Discover handcrafted rings, earrings, pendants, and accessories priced under ₹{maxPrice.toLocaleString("en-IN")} across our entire catalog.
          </p>
        </div>

        {/* Category Pills of Available Items */}
        <div className="overflow-x-auto scrollbar-none flex items-center justify-start sm:justify-center gap-2 sm:gap-3 pb-2 mb-6 sm:mb-10">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-[#B82E44] text-[#FFF8F0] shadow-xs whitespace-nowrap">
            All {title} ({filteredProducts.length})
          </span>
          {availableCategories.map((catSlug) => {
            const count = categoryCounts[catSlug];
            const meta = STORE_CATEGORIES.find((c) => c.slug.toLowerCase() === catSlug);
            const displayName = meta ? meta.name : catSlug.charAt(0).toUpperCase() + catSlug.slice(1);
            return (
              <Link
                key={catSlug}
                href={`/products/${catSlug}`}
                className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide bg-[#FFF0EA] border border-[#E8CFC5] text-[#35191C] hover:bg-[#B82E44] hover:text-[#FFF8F0] hover:border-[#B82E44] transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>{displayName}</span>
                <span className="text-[10px] bg-[#FFE2D8] text-[#7C1B2A] px-1.5 py-0.2 rounded-full font-bold">
                  {count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-6 sm:p-16 text-center max-w-2xl mx-auto shadow-sm my-6 sm:my-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-[#FFF0EA] border border-[#D4AF37]/40 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
              🏷️
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#9B1B30] mb-2 font-bold">
              No Products Found {title}
            </h3>
            <p className="text-xs sm:text-sm text-[#6F4A4A] mb-6 leading-relaxed">
              We are adding new budget-friendly handcrafted designs daily. Connect with our artisans directly on WhatsApp for custom orders or instant catalog previews.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`https://wa.me/919827415111?text=Hello%20Keshar%20Jewellers,%20please%20share%20jewellery%20designs%20${encodeURIComponent(title)}.`}
                target="_blank"
                className="px-5 py-2.5 bg-[#B82E44] hover:bg-[#7C1B2A] text-[#FFF8F0] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs inline-block"
              >
                Enquire on WhatsApp
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
