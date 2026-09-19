"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { SPECIAL_COLLECTIONS, CategoryItem } from "@/frontend/data/categories";

interface SpecialCollectionCarouselProps {
  items?: CategoryItem[];
}

const COLLECTION_TAGS: Record<string, string> = {
  "evil-eye": "Nazar Suraksha",
  kids: "Baby & Children",
  pens: "Luxury Silver Gifts",
  utensils: "999 Pure Silver",
  artifacts: "Sacred Idols & Decor",
  "coins-bars": "24K & 999 Silver",
  "pooja-articles": "Devotional & Mandir",
};

export default function SpecialCollectionCarousel({
  items = SPECIAL_COLLECTIONS,
}: SpecialCollectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate for infinite seamless auto-scrolling loop
  const displayList = useMemo(() => {
    if (items.length === 0) return [];
    return [...items, ...items, ...items];
  }, [items]);

  // Zero-layout-thrashing 60fps auto-scroll with IntersectionObserver
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || displayList.length === 0) return;

    let animId: number;
    let isVisible = true;
    let isUserInteracting = false;
    const speed = 0.9;

    // Cache thirdWidth to eliminate forced synchronous reflow (layout thrashing)
    let cachedThirdWidth = el.scrollWidth / 3;
    const updateDimensions = () => {
      if (el) {
        cachedThirdWidth = el.scrollWidth / 3;
      }
    };

    window.addEventListener("resize", updateDimensions);

    // Pause animation completely when offscreen
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
        if (cachedThirdWidth > 0 && el.scrollLeft >= cachedThirdWidth) {
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
    <section className="w-full bg-[#FFF8F0] py-8 sm:py-12 px-3 sm:px-6 lg:px-8 border-y border-[#E8CFC5]/50 relative overflow-hidden">
      <div
        className="max-w-[1400px] mx-auto relative group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 select-none">
          <span className="text-[#C77D62] uppercase tracking-[0.25em] text-[10px] sm:text-xs font-bold block mb-1.5">
            ✦ Silver Articles, Gifts & Lifestyle ✦
          </span>
          <h2 className="font-serif italic text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#9B1B30] tracking-tight">
            Divine Articles & Special Collections
          </h2>
          <div className="flex items-center justify-center gap-3 my-2 text-[#A77C18]/60 w-36 sm:w-44 mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent flex-1" />
            <span className="text-[10px] sm:text-xs font-serif text-[#A77C18]">❖</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent flex-1" />
          </div>
          <p className="text-xs text-[#6F4A4A] max-w-lg mx-auto font-sans">
            Explore authentic 999 pure silver utensils, divine idols, hallmark coins, kids jewellery &amp; luxury silver pens.
          </p>
        </div>

        {/* Continuous Auto-sliding Track */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3.5 sm:gap-6 lg:gap-7 overflow-x-auto scrollbar-none scroll-touch px-2 sm:px-4 py-2 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {displayList.map((item, idx) => (
            <Link
              key={`${item.slug}-${idx}`}
              href={item.href || `/products/${item.slug}`}
              className="flex flex-col items-center group/card flex-shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 
                         w-24 sm:w-28 md:w-32 lg:w-36 select-none"
            >
              {/* Category Card */}
              <div className="w-full aspect-square rounded-2xl bg-[#FFF0EA] shadow-sm border border-[#E8CFC5] hover:border-[#B82E44] group-hover/card:border-[#B82E44] hover:shadow-md flex items-center justify-center transition-all duration-300 group-hover/card:-translate-y-1 relative overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className={`object-cover transition-transform duration-500 ease-out ${
                      item.imageClassName ? item.imageClassName : "group-hover/card:scale-110"
                    }`}
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.9),_rgba(255,240,234,0.4))] flex items-center justify-center shadow-inner relative z-10 overflow-hidden">
                    <span className="text-2xl sm:text-3xl md:text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] group-hover/card:scale-110 transition-transform duration-500">
                      {item.icon || "🪔"}
                    </span>
                  </div>
                )}
              </div>

              {/* Category Title */}
              <span className="font-serif italic text-xs sm:text-sm text-[#9B1B30] font-semibold mt-2 group-hover/card:text-[#7C1B2A] transition-colors text-center line-clamp-1">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
