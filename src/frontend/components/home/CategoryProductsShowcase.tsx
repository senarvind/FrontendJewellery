"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Product } from "@/frontend/types/product";
import ProductCard from "@/frontend/components/products/ProductCard";
import { getAllProducts } from "@/lib/api";

interface CategoryProductsShowcaseProps {
  initialProducts?: Product[];
}

export default function CategoryProductsShowcase({ initialProducts }: CategoryProductsShowcaseProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialProducts || initialProducts.length === 0);
  const [itemsPerView, setItemsPerView] = useState<number>(6);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Fetch products if not provided
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
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load products for showcase:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [initialProducts]);

  // Show 4 product cards on mobile, 6 on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(4); // 4 cards on mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerView(5); // 5 cards on tablet/small laptop
      } else {
        setItemsPerView(6); // 6 cards on desktop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const numProducts = products.length;

  // Tripled array for seamless infinite looping
  const displayProducts = React.useMemo(() => {
    if (numProducts === 0) return [];
    if (numProducts <= 3) {
      return [...products, ...products, ...products, ...products, ...products, ...products];
    }
    return [...products, ...products, ...products];
  }, [products, numProducts]);

  // Start at middle chunk
  useEffect(() => {
    if (numProducts > 0) {
      setIsTransitioning(false);
      setCurrentIndex(numProducts);
    }
  }, [numProducts]);

  // Pause for 5 seconds on touch or interaction
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

  // Slide controls
  const nextSlide = useCallback(() => {
    if (numProducts === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [numProducts]);

  const prevSlide = useCallback(() => {
    if (numProducts === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [numProducts]);

  // Seamless jump without backward rewinding
  const handleTransitionEnd = () => {
    if (numProducts === 0) return;

    if (currentIndex >= numProducts * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - numProducts);
    } else if (currentIndex < numProducts) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + numProducts);
    }
  };

  // Re-enable transition smoothly after seamless jump
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  const goToSlide = (dotIndex: number) => {
    triggerFiveSecondPause();
    setIsTransitioning(true);
    setCurrentIndex(numProducts + dotIndex);
  };

  const handleManualNext = () => {
    triggerFiveSecondPause();
    nextSlide();
  };

  const handleManualPrev = () => {
    triggerFiveSecondPause();
    prevSlide();
  };

  // Auto-slide interval: 3.8s medium-slow
  useEffect(() => {
    if (isPaused || numProducts <= itemsPerView) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide, numProducts, itemsPerView]);

  // Touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    triggerFiveSecondPause();
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    triggerFiveSecondPause();
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 35) {
      nextSlide();
    } else if (diff < -35) {
      prevSlide();
    }
    touchStartXRef.current = null;
  };

  // Current active dot indicator
  const activeDot = numProducts > 0 ? (currentIndex % numProducts) : 0;
  const totalDots = Math.min(numProducts, 8);

  return (
    <section className="w-full py-10 sm:py-16 bg-[#FFF8F0] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FFE2D8]/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FFF0EA]/70 rounded-full blur-3xl" />
      </div>

      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto px-4 text-center mb-6 sm:mb-10 relative z-10 select-none">
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
        <p className="font-light text-[#6F4A4A] text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
          Discover our newest handcrafted 916 BIS Hallmarked gold and pure silver creations.
        </p>
      </div>

      {/* Full-width Edge-to-Edge Slider Container */}
      <div className="w-full px-2 sm:px-4 relative z-10">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-10 h-10 border-4 border-[#B82E44] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-[#6F4A4A] font-medium tracking-wide">
              Loading latest jewellery collection...
            </p>
          </div>
        ) : numProducts > 0 ? (
          <div
            className="relative group/slider w-full"
            onMouseEnter={triggerFiveSecondPause}
          >
            {/* Desktop Left Nav Button */}
            <button
              onClick={handleManualPrev}
              aria-label="Previous Products"
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 text-[#9B1B30] border border-[#E8CFC5] shadow-lg items-center justify-center hover:bg-[#9B1B30] hover:text-white hover:border-[#9B1B30] transition-all duration-300 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Desktop Right Nav Button */}
            <button
              onClick={handleManualNext}
              aria-label="Next Products"
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 text-[#9B1B30] border border-[#E8CFC5] shadow-lg items-center justify-center hover:bg-[#9B1B30] hover:text-white hover:border-[#9B1B30] transition-all duration-300 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* ANIMATED FULL-WIDTH SLIDER VIEWPORT & TRACK */}
            <div
              className="overflow-hidden w-full py-4 -my-4 touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                onTransitionEnd={handleTransitionEnd}
                className="flex will-change-transform"
                style={{
                  transform: `translate3d(-${currentIndex * (100 / itemsPerView)}%, 0, 0)`,
                  transition: isTransitioning
                    ? "transform 800ms cubic-bezier(0.16, 1, 0.3, 1)"
                    : "none",
                }}
              >
                {displayProducts.map((product, idx) => (
                  <div
                    key={`${product.id}-${idx}`}
                    className="flex-shrink-0 px-1.5 sm:px-2 md:px-2.5 box-border"
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
