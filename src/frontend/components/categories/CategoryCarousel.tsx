"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, CategoryItem, FEATURED_JEWELLERY_SLUGS } from "@/frontend/data/categories";
import { IMAGE_PRESETS } from "@/lib/cloudinary";

interface CategoryCarouselProps {
  categories?: CategoryItem[];
}

export default function CategoryCarousel({ categories = CATEGORIES }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Strictly deduplicate categories and exclude featured jewellery categories
  const uniqueCategories = useMemo(() => {
    const seen = new Set<string>();
    const excludedSlugs = new Set(FEATURED_JEWELLERY_SLUGS.map((s) => s.toLowerCase().trim()));
    const result: CategoryItem[] = [];

    for (const cat of categories) {
      const normalizedKey = (cat.slug || cat.name || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

      if (normalizedKey && !seen.has(normalizedKey) && !excludedSlugs.has(normalizedKey)) {
        seen.add(normalizedKey);
        result.push(cat);
      }
    }

    return result;
  }, [categories]);

  // Infinite seamless loop list
  const displayList = useMemo(() => {
    if (uniqueCategories.length === 0) return [];
    return [...uniqueCategories, ...uniqueCategories];
  }, [uniqueCategories]);

  // Zero-layout-thrashing 60fps auto-scroll with IntersectionObserver
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || displayList.length === 0) return;

    let animId: number;
    let isVisible = true;
    let isUserInteracting = false;
    const speed = 1.0;

    // Cache halfWidth to eliminate forced synchronous reflow (layout thrashing)
    let cachedHalfWidth = el.scrollWidth / 2;
    const updateDimensions = () => {
      if (el) {
        cachedHalfWidth = el.scrollWidth / 2;
      }
    };

    window.addEventListener("resize", updateDimensions);

    // Pause animation completely when offscreen to save 100% CPU/battery
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    // Pause immediately on touch so auto-scroll never fights user's finger
    let resumeTimeout: NodeJS.Timeout | null = null;
    const onTouchStart = () => {
      isUserInteracting = true;
      if (resumeTimeout) clearTimeout(resumeTimeout);
    };
    const onTouchEnd = () => {
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        isUserInteracting = false;
      }, 3000);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    const step = () => {
      if (isVisible && !isPaused && !isUserInteracting && el) {
        if (cachedHalfWidth > 0 && el.scrollLeft >= cachedHalfWidth) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += speed;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", updateDimensions);
      if (resumeTimeout) clearTimeout(resumeTimeout);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [isPaused, displayList]);

  return (
    <section className="w-full bg-[#FFF8F0] pt-8 sm:pt-12 pb-3 sm:pb-4 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        className="max-w-[1400px] mx-auto relative group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Section Heading */}
        <div className="text-center mb-6 sm:mb-8 select-none">
          <span className="text-[#C77D62] uppercase tracking-[0.25em] text-[10px] sm:text-xs font-bold block mb-1.5">
            ✦ Explore By Category ✦
          </span>
          <h2 className="font-serif italic text-2xl sm:text-4xl font-semibold text-[#9B1B30] tracking-tight">
            Shop by Category
          </h2>
          <div className="flex items-center justify-center gap-3 my-2 text-[#D4AF37]/60 w-32 sm:w-40 mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
            <span className="text-[10px] sm:text-xs font-serif text-[#A77C18]">❖</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
          </div>
        </div>

        {/* Continuous Auto-sliding Categories Track */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3.5 sm:gap-6 lg:gap-7 overflow-x-auto scrollbar-none scroll-touch px-2 sm:px-4 py-2 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {displayList.map((cat, idx) => (
            <Link
              key={`${cat.id || cat.slug}-${idx}`}
              href={cat.href || `/products/${cat.slug}`}
              className="flex flex-col items-center group/item flex-shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 
                         w-24 sm:w-28 md:w-32 lg:w-36 select-none"
            >
              {/* Category Card */}
              <div className="w-full aspect-square rounded-2xl bg-[#FFF0EA] shadow-sm border border-[#E8CFC5] hover:border-[#B82E44] group-hover/item:border-[#B82E44] hover:shadow-md flex items-center justify-center transition-all duration-300 group-hover/item:-translate-y-1 relative overflow-hidden">
                {cat.image ? (
                  <Image
                    src={IMAGE_PRESETS.categoryIcon(cat.image)}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 144px"
                    loading="lazy"
                    className={`object-cover transition-transform duration-500 ease-out ${
                      cat.imageClassName ? cat.imageClassName : "group-hover/item:scale-110"
                    }`}
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.9),_rgba(255,240,234,0.4))] flex items-center justify-center shadow-inner relative z-10 overflow-hidden">
                    <span className="text-2xl sm:text-3xl md:text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] group-hover/item:scale-110 transition-transform duration-500">
                      {cat.icon || "💎"}
                    </span>
                  </div>
                )}
              </div>

              {/* Category Title */}
              <span className="font-serif italic text-xs sm:text-sm text-[#9B1B30] font-semibold mt-2 group-hover/item:text-[#7C1B2A] transition-colors text-center line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


