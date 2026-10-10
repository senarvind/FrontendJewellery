"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Product } from "@/frontend/types/product";
import ProductCard from "@/frontend/components/products/ProductCard";
import { getAllProducts } from "@/lib/api";

interface CategoryProductsShowcaseProps {
  initialProducts?: Product[];
}

/**
 * "Our Latest Products" row. Each product is rendered exactly once in a native
 * swipe/scroll-snap row (the old auto-slider copied the list 3–6 times, which made
 * the home page HTML huge and blocked the main thread).
 */
export default function CategoryProductsShowcase({ initialProducts }: CategoryProductsShowcaseProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialProducts || initialProducts.length === 0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Fetch products in the browser only if the server did not provide any
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setIsLoading(false);
      return;
    }
    async function loadProducts() {
      try {
        setIsLoading(true);
        const data = await getAllProducts();
        setProducts((data || []).slice(0, 12));
      } catch (err) {
        console.error("Failed to load products for showcase:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [initialProducts]);

  const scrollByCards = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: (direction === "left" ? -1 : 1) * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="w-full py-10 sm:py-16 bg-[#FFF8F0] relative overflow-hidden">
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto px-4 text-center mb-6 sm:mb-10 relative z-10 select-none">
        <span className="text-[#965238] uppercase tracking-[0.25em] text-xs font-bold block mb-2">
          ✦ Authentic Hallmark Jewellery ✦
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#9B1B30] tracking-tight mb-2 sm:mb-3">
          Our Latest Products
        </h2>
        <div className="flex items-center justify-center gap-3 my-2 text-[#D4AF37]/60 w-36 sm:w-48 mx-auto">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
          <span className="text-xs font-serif text-[#A77C18]">❖</span>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
        </div>
        <p className="font-light text-[#6F4A4A] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Our newest handcrafted 92.5 sterling silver and BIS hallmarked gold designs.
        </p>
      </div>

      <div className="w-full px-2 sm:px-4 relative z-10">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-10 h-10 border-4 border-[#B82E44] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-[#6F4A4A] font-medium tracking-wide">Loading latest jewellery collection...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="relative group/slider w-full max-w-[1400px] mx-auto">
            {/* Desktop arrows */}
            <button
              type="button"
              onClick={() => scrollByCards("left")}
              aria-label="Previous products"
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 text-[#9B1B30] border border-[#E8CFC5] shadow-lg items-center justify-center hover:bg-[#9B1B30] hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByCards("right")}
              aria-label="Next products"
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 text-[#9B1B30] border border-[#E8CFC5] shadow-lg items-center justify-center hover:bg-[#9B1B30] hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Swipeable row: 2 cards on mobile, 4 on tablet, 6 on desktop */}
            <div ref={scrollRef} className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory overscroll-x-contain py-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="snap-start shrink-0 w-1/2 sm:w-1/4 lg:w-1/6 px-1.5 sm:px-2 md:px-2.5 box-border"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* View Full Collection Button */}
            <div className="text-center mt-6 sm:mt-10">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-[#7C1B2A] to-[#9B1B30] hover:from-[#9B1B30] hover:to-[#B82E44] text-[#FFF8F0] rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(124,27,42,0.25)] hover:scale-105 active:scale-95"
              >
                <span>Explore All Products</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF0EA] border border-[#D4AF37]/40 flex items-center justify-center text-xl mb-3">
              💎
            </div>
            <h3 className="font-serif text-lg sm:text-xl text-[#9B1B30] mb-2 font-bold">No products found yet</h3>
            <p className="text-xs text-[#6F4A4A] mb-6">
              New handcrafted items are created regularly by our master artisans. Custom designs are available on order.
            </p>
            <Link
              href="https://wa.me/919827415111?text=Hello%20Keshar%20Jewellers,%20I%20am%20looking%20for%20custom%20jewellery%20designs."
              target="_blank"
              className="inline-block px-5 py-2.5 bg-[#B82E44] text-[#FFF8F0] rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#7C1B2A] transition-colors shadow-sm"
            >
              Enquire on WhatsApp
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
