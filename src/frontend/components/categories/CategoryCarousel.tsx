"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, CategoryItem } from "@/frontend/data/categories";

interface CategoryCarouselProps {
  categories?: CategoryItem[];
}

export default function CategoryCarousel({ categories = CATEGORIES }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Strictly deduplicate categories and ONLY include categories with real images
  const uniqueCategories = useMemo(() => {
    const seen = new Set<string>();
    const result: CategoryItem[] = [];

    // Filter categories that have images
    const imageOnlyCategories = categories.filter((cat) => Boolean(cat.image));

    for (const cat of imageOnlyCategories) {
      const normalizedKey = (cat.name || cat.slug || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, "")
        .replace(/s$/, ""); // normalize plural

      if (!seen.has(normalizedKey)) {
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

  // Smooth continuous 60fps auto-sliding animation
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || displayList.length === 0) return;

    let animId: number;
    const speed = 1.2; // Smooth scrolling speed in pixels per frame

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

  return (
    <section className="w-full bg-[#FFF8F0] py-8 sm:py-12 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        className="max-w-[1400px] mx-auto relative group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
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
          className="flex items-center gap-4 sm:gap-6 lg:gap-7 overflow-x-auto scrollbar-none px-2 sm:px-4 py-2 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
                    src={cat.image}
                    alt={cat.name}
                    fill
                    priority={idx < 4}
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


