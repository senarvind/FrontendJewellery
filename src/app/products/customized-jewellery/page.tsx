import Link from "next/link";
import { getCustomizedProducts } from "@/lib/api";
import ProductCard from "@/frontend/components/products/ProductCard";

export const revalidate = 60;

export default async function CustomizedJewelleryPage() {
  const products = await getCustomizedProducts();

  // Extract unique sub-categories if any
  const categoryCounts = products.reduce((acc: Record<string, number>, p) => {
    const cat = p.category ? p.category.toLowerCase().trim() : "uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const availableCategories = Object.keys(categoryCounts).filter(
    (c) =>
      c !== "customized-jewellery" &&
      c !== "customer-on-demand" &&
      c !== "uncategorized"
  );

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
            <Link href="/products" className="hover:text-[#9B1B30] font-medium hover:underline">Products</Link>
            <span>/</span>
            <span className="text-[#9B1B30] font-bold truncate max-w-[140px] sm:max-w-none">Customer On Demand</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 px-1">
          <span className="text-[#C77D62] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-xs font-bold block mb-1.5 sm:mb-2">
            ✦ BESPOKE CRAFTSMANSHIP • CUSTOM ORDERS • BIS 91.6 &amp; 92.5 CERTIFIED ✦
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#9B1B30] tracking-tight mb-2 sm:mb-3">
            Customer On Demand
          </h1>
          <div className="flex items-center justify-center gap-3 my-2 sm:my-3 text-[#D4AF37]/60 w-36 sm:w-48 mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
            <span className="text-sm font-serif text-[#A77C18]">👑</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
          </div>
          <p className="font-light text-[#6F4A4A] text-xs sm:text-base leading-relaxed">
            Personalized jewellery handcrafted exclusively on your demand. Share your design, reference photo, or idea — our master artisans will bring it to life in pure gold &amp; sterling silver.
          </p>
        </div>

        {/* Bespoke Request WhatsApp Banner */}
        <div className="mb-8 sm:mb-12 bg-gradient-to-r from-[#FFF0EA] via-[#FFE8DE] to-[#FFF0EA] border border-[#E8CFC5] rounded-3xl p-5 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/90 border border-[#E8CFC5] flex items-center justify-center text-2xl sm:text-3xl shadow-sm shrink-0">
              💎
            </div>
            <div>
              <h3 className="font-serif italic font-bold text-lg sm:text-2xl text-[#9B1B30]">
                Have a Custom Design in Mind?
              </h3>
              <p className="text-xs sm:text-sm text-[#6F4A4A] mt-1">
                Send us your sketch, reference image, or requirements on WhatsApp for instant quote &amp; custom hallmark crafting.
              </p>
            </div>
          </div>
          <Link
            href="https://wa.me/919827415111?text=Hello%20Keshar%20Jewellers,%20I%20want%20to%20place%20a%20Customized%20/%20Customer%20On%20Demand%20order.%20Here%20are%20my%20details:"
            target="_blank"
            className="shrink-0 px-6 py-3 bg-[#B82E44] hover:bg-[#7C1B2A] text-[#FFF8F0] rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
          >
            <span>Order Custom Design on WhatsApp</span>
            <span className="text-sm">→</span>
          </Link>
        </div>

        {/* Category Filter Pills (if multiple categories present) */}
        {availableCategories.length > 0 && (
          <div className="overflow-x-auto scrollbar-none flex items-center justify-start sm:justify-center gap-2 sm:gap-3 pb-2 mb-6 sm:mb-10">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-[#B82E44] text-[#FFF8F0] shadow-xs whitespace-nowrap">
              All Custom Pieces ({products.length})
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
              👑
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#9B1B30] mb-2 font-bold">
              Customized Orders Showcase Loading
            </h3>
            <p className="text-xs sm:text-sm text-[#6F4A4A] mb-6 leading-relaxed">
              Every custom order is uniquely handcrafted to customer specifications. Upload custom pieces directly from your admin panel or enquire on WhatsApp with your desired design.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="https://wa.me/919827415111?text=Hello%20Keshar%20Jewellers,%20I%20want%20to%20enquire%20about%20a%20customized%20jewellery%20design."
                target="_blank"
                className="px-5 py-2.5 bg-[#B82E44] hover:bg-[#7C1B2A] text-[#FFF8F0] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs inline-block"
              >
                Custom Order on WhatsApp
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
