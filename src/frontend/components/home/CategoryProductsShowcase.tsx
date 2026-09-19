"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Product } from "@/frontend/types/product";
import ProductCard from "@/frontend/components/products/ProductCard";
import { getAllProducts } from "@/lib/api";

export default function CategoryProductsShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [itemsPerView, setItemsPerView] = useState<number>(4);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const touchStartXRef = useRef<number | null>(null);

  // Fetch products
  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const data = await getAllProducts();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load products for home page showcase:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Update visible items count on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Build an extended product array so carousel ALWAYS has enough items to slide infinitely
  const displayProducts = React.useMemo(() => {
    if (products.length === 0) return [];
    if (products.length <= 4) {
      return [...products, ...products, ...products, ...products];
    }
    if (products.length <= 8) {
      return [...products, ...products];
    }
    return [...products, ...products];
  }, [products]);

  const totalItems = displayProducts.length;
  const maxSlide = Math.max(0, totalItems - itemsPerView);

  // Slide controls
  const nextSlide = useCallback(() => {
    if (totalItems <= itemsPerView) return;

    setCurrentIndex((prev) => {
      if (prev >= maxSlide) {
        // Reset smoothly to beginning
        return 0;
      }
      return prev + 1;
    });
  }, [totalItems, itemsPerView, maxSlide]);

  const prevSlide = useCallback(() => {
    if (totalItems <= itemsPerView) return;

    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return maxSlide;
      }
      return prev - 1;
    });
  }, [totalItems, itemsPerView, maxSlide]);

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(Math.max(0, index), maxSlide));
  };

  // Auto-slide animation interval (every 1.6 seconds, pauses on hover/touch)
  useEffect(() => {
    if (isPaused || totalItems <= itemsPerView) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 1600);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalItems, itemsPerView]);

  // Pause auto-sliding for 5 seconds when user hovers or taps on phone
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerFiveSecondPause = useCallback(() => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  }, []);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  // Touch handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    triggerFiveSecondPause();
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    triggerFiveSecondPause();
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    touchStartXRef.current = null;
  };

  // Original product dots
  const activeDot = products.length > 0 ? currentIndex % products.length : 0;
  const totalDots = Math.min(products.length, 8);

  return (
    <section className="py-12 sm:py-18 px-3 sm:px-8 lg:px-12 bg-[#FFF8F0] relative overflow-hidden">
      {/* Decorative subtle background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FFE2D8]/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FFF0EA]/70 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <span className="text-[#C77D62] uppercase tracking-[0.25em] text-[10px] sm:text-xs font-bold block mb-2">
            ✦ Authentic Hallmark Jewellery ✦
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#9B1B30] tracking-tight mb-2 sm:mb-3">
            Our Latest Products
          </h2>
          <div className="flex items-center justify-center gap-3 my-2 text-[#D4AF37]/60 w-36 sm:w-48 mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
            <span className="text-[10px] sm:text-xs font-serif text-[#A77C18]">❖</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
          </div>
          <p className="font-light text-[#6F4A4A] text-xs sm:text-base leading-relaxed">
            Discover our newest handcrafted 916 BIS Hallmarked gold and pure silver creations.
          </p>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-10 h-10 border-4 border-[#B82E44] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-[#6F4A4A] font-medium tracking-wide">
              Loading latest jewellery collection...
            </p>
          </div>
        ) : products.length > 0 ? (
          <div
            className="relative group/slider"
            onMouseEnter={triggerFiveSecondPause}
          >
            {/* ANIMATED SLIDER VIEWPORT & TRACK */}
            <div
              className="overflow-hidden w-full py-4 -my-4"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                }}
              >
                {displayProducts.map((product, idx) => (
                  <div
                    key={`${product.id}-${idx}`}
                    className="flex-shrink-0 px-2 sm:px-3 box-border"
                    style={{
                      width: `${100 / itemsPerView}%`,
                    }}
                  >
                    <div className="h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl rounded-2xl">
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Pagination Indicator Dots */}
            {totalDots > 1 && (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
                {Array.from({ length: totalDots }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to product ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                      activeDot === idx
                        ? "w-8 sm:w-10 bg-gradient-to-r from-[#9B1B30] to-[#B82E44] shadow-md"
                        : "w-2 bg-[#E8CFC5] hover:bg-[#C77D62]"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* View Full Collection Button */}
            <div className="text-center mt-6 sm:mt-10">
              <Link
                href="/products/all"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-[#7C1B2A] to-[#9B1B30] hover:from-[#9B1B30] hover:to-[#B82E44] text-[#FFF8F0] rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(124,27,42,0.25)] hover:shadow-[0_6px_24px_rgba(124,27,42,0.35)] hover:scale-105 active:scale-95"
              >
                <span>Explore All Products ({products.length})</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF0EA] border border-[#D4AF37]/40 flex items-center justify-center text-xl mb-3">
              💎
            </div>
            <h3 className="font-serif text-lg sm:text-xl text-[#9B1B30] mb-2 font-bold">
              No products found yet
            </h3>
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
