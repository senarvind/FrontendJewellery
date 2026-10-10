import Link from "next/link";
import type { Product } from "@/frontend/types/product";
import ProductCard from "@/frontend/components/products/ProductCard";

interface ProductListingProps {
  title: string;
  intro: string;
  products: Product[];
}

/** Simple server-rendered product grid page (New Arrivals, Bestsellers…). */
export default function ProductListing({ title, intro, products }: ProductListingProps) {
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#35191C] px-2.5 sm:px-8 lg:px-12 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-4 sm:mb-6 flex items-center gap-2 text-xs text-[#6F4A4A]">
          <Link href="/" className="hover:text-[#9B1B30] hover:underline">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#9B1B30] hover:underline">Jewellery</Link>
          <span>/</span>
          <span className="text-[#9B1B30] font-bold">{title}</span>
        </nav>

        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 px-1">
          <h1 className="font-serif text-2xl sm:text-5xl text-[#9B1B30] tracking-tight mb-2 sm:mb-3">{title}</h1>
          <p className="font-light text-[#6F4A4A] text-sm sm:text-base leading-relaxed">{intro}</p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6 lg:gap-8">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-[#6F4A4A] py-12">
            New designs are coming soon.{" "}
            <Link href="/products" className="text-[#9B1B30] font-semibold underline">Browse all jewellery</Link>
          </p>
        )}
      </div>
    </div>
  );
}
