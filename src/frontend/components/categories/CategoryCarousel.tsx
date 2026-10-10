"use client";

import React, { useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, CategoryItem, FEATURED_JEWELLERY_SLUGS } from "@/frontend/data/categories";
import { IMAGE_PRESETS } from "@/lib/cloudinary";

interface CategoryCarouselProps {
  categories?: CategoryItem[];
}

export default function CategoryCarousel({ categories = CATEGORIES }: CategoryCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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

  // Each category is rendered once; visitors swipe (mobile) or use the arrows (desktop).
  // (The old marquee copied every item 3x, which tripled the page size and slowed it down.)
  const handleManualScroll = (direction: "left" | "right") => {
    scrollContainerRef.current?.scrollBy({ left: direction === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-[#FFF8F0] pt-2 sm:pt-3 pb-3 sm:pb-4 relative overflow-hidden">
      {/* Section Heading */}
      <div className="max-w-[1400px] mx-auto px-4 text-center mb-4 sm:mb-6 select-none">
        <h2 className="font-serif italic text-2xl sm:text-4xl font-semibold text-[#9B1B30] tracking-tight">
          Shop by Category
        </h2>
        <div className="flex items-center justify-center gap-3 my-2 text-[#D4AF37]/60 w-32 sm:w-40 mx-auto">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
          <span className="text-[10px] sm:text-xs font-serif text-[#A77C18]">❖</span>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
        </div>
      </div>

      {/* Full-width Edge-to-Edge Continuous Auto-sliding Track */}
      <div className="w-full relative group/carousel overflow-hidden">
        {/* Desktop Left Navigation Button */}
        <button
          onClick={() => handleManualScroll("left")}
          aria-label="Previous categories"
          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 text-[#9B1B30] border border-[#E8CFC5] shadow-md items-center justify-center hover:bg-[#9B1B30] hover:text-white hover:border-[#9B1B30] transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Desktop Right Navigation Button */}
        <button
          onClick={() => handleManualScroll("right")}
          aria-label="Next categories"
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 text-[#9B1B30] border border-[#E8CFC5] shadow-md items-center justify-center hover:bg-[#9B1B30] hover:text-white hover:border-[#9B1B30] transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Interactive Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="w-full py-2 select-none overflow-x-auto scrollbar-none scroll-touch snap-x snap-mandatory"
        >
          <div className="flex w-max mx-auto gap-3.5 sm:gap-6 lg:gap-7 px-4">
            {uniqueCategories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                href={cat.href || `/products/${cat.slug}`}
                className="snap-start flex flex-col items-center group/item flex-shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 
                           w-24 sm:w-28 md:w-32 lg:w-36 select-none"
              >
                {/* Category Card */}
                <div className="w-full aspect-square rounded-2xl bg-[#FFF0EA] shadow-sm border border-[#E8CFC5] hover:border-[#B82E44] group-hover/item:border-[#B82E44] hover:shadow-md flex items-center justify-center transition-all duration-300 group-hover/item:-translate-y-1 relative overflow-hidden">
                  {cat.image ? (
                    <Image
                      src={IMAGE_PRESETS.categoryIcon(cat.image)}
                      alt=""
                      width={144}
                      height={144}
                      loading="lazy"
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out ${
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
      </div>
    </section>
  );
}
