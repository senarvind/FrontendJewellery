"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, CategoryItem, FEATURED_JEWELLERY_SLUGS } from "@/frontend/data/categories";
import { IMAGE_PRESETS } from "@/lib/cloudinary";

interface FeaturedJewelleryCarouselProps {
  categories?: CategoryItem[];
}

export default function FeaturedJewelleryCarousel({
  categories = CATEGORIES,
}: FeaturedJewelleryCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Infinite seamless loop list
  const displayList = useMemo(() => {
    if (featuredCategories.length === 0) return [];
    return [
      ...featuredCategories,
      ...featuredCategories,
      ...featuredCategories,
      ...featuredCategories,
    ];
  }, [featuredCategories]);

  // Pause for 5 seconds on touch or interaction
  const trigger5SecondPause = () => {
    setIsPaused(true);
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  if (featuredCategories.length === 0) return null;

  return (
    <section className="w-full bg-[#FFF8F0] pt-2 sm:pt-3 pb-8 sm:pb-12 relative overflow-hidden">
      <style jsx>{`
        @keyframes marqueeFeatured {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .marquee-featured-track {
          display: flex;
          width: max-content;
          animation: marqueeFeatured 40s linear infinite;
          will-change: transform;
        }
      `}</style>

      {/* Stepped 1-Box Inset Continuous Auto-sliding Track */}
      <div className="w-full px-6 sm:px-16 md:px-24 lg:px-[172px]">
        <div
          className="w-full relative group overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
            setIsPaused(false);
          }}
          onTouchStart={trigger5SecondPause}
          onTouchMove={trigger5SecondPause}
          onTouchEnd={trigger5SecondPause}
        >
          {/* Subtle elegant fade edges at the 1-box boundary */}
          <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-r from-[#FFF8F0] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-l from-[#FFF8F0] to-transparent z-10 pointer-events-none" />

          <div
            className="marquee-featured-track gap-3.5 sm:gap-6 lg:gap-7 py-2 select-none"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
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
    </div>
  </section>
  );
}
