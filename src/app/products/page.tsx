import Link from "next/link";
import { getAllProducts } from "@/lib/api";
import ProductCard from "@/frontend/components/products/ProductCard";
import { STORE_CATEGORIES } from "@/frontend/types/product";

export const revalidate = 60;

export default async function AllProductsPage(props: {
  searchParams?: Promise<{ maxPrice?: string }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const maxPriceNum = searchParams?.maxPrice ? parseFloat(searchParams.maxPrice) : null;
  const allProducts = await getAllProducts();
  const safeAllProducts = Array.isArray(allProducts) ? allProducts : [];

  const products =
    maxPriceNum && !isNaN(maxPriceNum)
      ? safeAllProducts.filter((p) => {
          const raw = p.sellingPrice;
          const price =
            typeof raw === "number"
              ? raw
              : parseFloat(String(raw || "").replace(/[^0-9.]/g, ""));
          return !isNaN(price) && price > 0 && price < maxPriceNum;
        })
      : safeAllProducts;

  // Extract unique category names from products
  const categoryCounts = products.reduce((acc: Record<string, number>, p) => {
    const cat = p.category ? p.category.toLowerCase().trim() : "uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#FFF8F0] text-[#35191C] px-2.5 sm:px-8 lg:px-12 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Navigation Bar */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3 bg-[#FFF0EA] border border-[#E8CFC5] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#9B1B30] hover:bg-[#7C1B2A] text-[#FFF8F0] transition-all text-xs font-bold shadow-xs active:scale-95 flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#6F4A4A] overflow-hidden">
            <Link href="/" className="hover:text-[#9B1B30] font-medium hover:underline">Home</Link>
            <span>/</span>
            <span className="text-[#9B1B30] font-bold">All Products</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 px-1">
          <span className="text-[#C77D62] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-xs font-bold block mb-1.5 sm:mb-2">
            ✦ BIS 91.6 GOLD & 92.5 STERLING SILVER CERTIFIED ✦
          </span>
          <h1 className="font-serif text-2xl sm:text-5xl lg:text-6xl text-[#9B1B30] tracking-tight mb-2 sm:mb-3">
            Entire Jewellery Catalog
          </h1>
          <div className="flex items-center justify-center gap-3 my-2 sm:my-3 text-[#D4AF37]/60 w-36 sm:w-48 mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
            <span className="text-[10px] sm:text-xs font-serif text-[#A77C18]">❖</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
          </div>
          <p className="font-light text-[#6F4A4A] text-xs sm:text-base leading-relaxed">
            Explore {products.length} handcrafted pieces crafted by Keshar Jewellers master artisans.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="overflow-x-auto scrollbar-none flex items-center justify-start sm:justify-center gap-2 sm:gap-3 pb-2 mb-6 sm:mb-10">
          <Link
            href="/products"
            className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-[#B82E44] text-[#FFF8F0] shadow-xs whitespace-nowrap"
          >
            All Products ({products.length})
          </Link>
          {STORE_CATEGORIES.slice(0, 12).map((cat) => {
            const count = categoryCounts[cat.slug] || categoryCounts[cat.name.toLowerCase()] || 0;
            return (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide bg-[#FFF0EA] border border-[#E8CFC5] text-[#35191C] hover:bg-[#B82E44] hover:text-[#FFF8F0] hover:border-[#B82E44] transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>{cat.name}</span>
                {count > 0 && (
                  <span className="text-[10px] bg-[#FFE2D8] text-[#7C1B2A] px-1.5 py-0.2 rounded-full font-bold">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

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
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-[#FFF0EA] border border-[#D4AF37]/40 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
              💎
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#9B1B30] mb-2 font-bold">
              Catalog Loading or Updating
            </h3>
            <p className="text-xs sm:text-sm text-[#6F4A4A] mb-6 leading-relaxed">
              We are currently loading fresh designs from our database. Custom orders and instant catalog previews are available directly on WhatsApp.
            </p>
            <Link
              href="https://wa.me/919827415111?text=Hello%20Keshar%20Jewellers,%20please%20share%20the%20latest%20jewellery%20catalog."
              target="_blank"
              className="px-5 py-2.5 bg-[#B82E44] hover:bg-[#7C1B2A] text-[#FFF8F0] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs inline-block"
            >
              Enquire on WhatsApp
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
