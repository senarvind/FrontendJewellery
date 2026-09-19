"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, CategoryItem, FEATURED_JEWELLERY_SLUGS } from "@/frontend/data/categories";

interface FeaturedJewelleryCarouselProps {
  categories?: CategoryItem[];
}

export default function FeaturedJewelleryCarousel({
  categories = CATEGORIES,
}: FeaturedJewelleryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Filter only the featured jewellery categories requested
  const featuredCategories = useMemo(() => {
    const featuredSlugSet = new Set(
      FEATURED_JEWELLERY_SLUGS.map((s) => s.toLowerCase().trim())
    );
    const seen = new Set<string>();
    const result: CategoryItem[] = [];

    // First collect matching categories from props or CATEGORIES
    const sourceList = categories.length > 0 ? categories : CATEGORIES;

    for (const cat of sourceList) {
      const normalizedKey = (cat.slug || cat.name || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

      if (
        normalizedKey &&
        featuredSlugSet.has(normalizedKey) &&
        !seen.has(normalizedKey)
      ) {
        seen.add(normalizedKey);
        result.push(cat);
      }
    }

    // Fallback: If some featured items weren't found in dynamic categories, pick from CATEGORIES constant
    for (const cat of CATEGORIES) {
      const normalizedKey = (cat.slug || cat.name || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

      if (
        normalizedKey &&
        featuredSlugSet.has(normalizedKey) &&
        !seen.has(normalizedKey)
      ) {
        seen.add(normalizedKey);
        result.push(cat);
      }
    }

    // Sort according to FEATURED_JEWELLERY_SLUGS preferred order
    return result.sort((a, b) => {
      const aSlug = (a.slug || a.name || "").toLowerCase().trim().replace(/\s+/g, "-");
      const bSlug = (b.slug || b.name || "").toLowerCase().trim().replace(/\s+/g, "-");
      const aIdx = FEATURED_JEWELLERY_SLUGS.indexOf(aSlug);
      const bIdx = FEATURED_JEWELLERY_SLUGS.indexOf(bSlug);
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    });
  }, [categories]);

  // Infinite seamless loop list (multiplied for continuous loop with 6 items)
  const displayList = useMemo(() => {
    if (featuredCategories.length === 0) return [];
    return [
      ...featuredCategories,
      ...featuredCategories,
      ...featuredCategories,
      ...featuredCategories,
    ];
  }, [featuredCategories]);

  // Smooth continuous 60fps auto-sliding animation
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || displayList.length === 0) return;

    let animId: number;
    const speed = 1.1; // Smooth luxury scrolling speed

    const step = () => {
      if (!isPaused && el) {
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > 0 && el.scrollLeft >= halfWidth) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += speed;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animId);
  }, [isPaused, displayList]);

  // Pause auto-sliding for 5 seconds when user hovers or taps on phone
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerFiveSecondPause = () => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  if (featuredCategories.length === 0) return null;

  return (
    <section className="w-full bg-[#FFF8F0] pt-2 sm:pt-3 pb-8 sm:pb-12 px-6 sm:px-14 md:px-20 lg:px-28 relative overflow-hidden">
      {/* Container with left and right 1-box inset length */}
      <div
        className="max-w-[1180px] mx-auto relative group"
        onMouseEnter={triggerFiveSecondPause}
        onTouchStart={triggerFiveSecondPause}
        onTouchEnd={triggerFiveSecondPause}
      >
        {/* Continuous Auto-sliding Categories Track (Part of Shop by Category) */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3.5 sm:gap-6 lg:gap-7 overflow-x-auto scrollbar-none scroll-touch px-2 sm:px-4 py-2 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {displayList.map((cat, idx) => (
            <Link
              key={`${cat.id || cat.slug}-featured-${idx}`}
              href={cat.href || `/products/${cat.slug}`}
              className="flex flex-col items-center group/item flex-shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 
                         w-24 sm:w-28 md:w-32 lg:w-36 select-none"
            >
              {/* Category Card */}
              <div className="w-full aspect-square rounded-2xl bg-[#FFF0EA] shadow-sm border border-[#E8CFC5] hover:border-[#B82E44] group-hover/item:border-[#B82E44] hover:shadow-md flex items-center justify-center transition-all duration-300 group-hover/item:-translate-y-1 relative overflow-hidden">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className={`object-cover transition-transform duration-500 ease-out ${
                      cat.imageClassName ? cat.imageClassName : "group-hover/item:scale-110"
                    }`}
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.9),_rgba(255,240,234,0.4))] flex items-center justify-center shadow-inner relative z-10 overflow-hidden">
                    <span className="text-2xl sm:text-3xl md:text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] group-hover/item:scale-110 transition-transform duration-500">
                      {cat.icon || "👑"}
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
