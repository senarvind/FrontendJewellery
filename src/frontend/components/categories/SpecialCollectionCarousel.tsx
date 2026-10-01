"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { SPECIAL_COLLECTIONS, CategoryItem } from "@/frontend/data/categories";

interface SpecialCollectionCarouselProps {
  items?: CategoryItem[];
}

export default function SpecialCollectionCarousel({
  items = SPECIAL_COLLECTIONS,
}: SpecialCollectionCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Touch drag state
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number>(0);
  const touchStartScrollRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  // Duplicate for infinite seamless marquee loop
  const displayList = useMemo(() => {
    if (items.length === 0) return [];
    return [...items, ...items, ...items];
  }, [items]);

  // Resume auto-slide after 5s of inactivity
  const scheduleResume = useCallback(() => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
      isDraggingRef.current = false;
    }, 5000);
  }, []);

  // ── Touch handlers ──────────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsPaused(true);
    isDraggingRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartScrollRef.current = scrollContainerRef.current?.scrollLeft ?? 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    const deltaX = touchStartXRef.current - e.touches[0].clientX;
    scrollContainerRef.current.scrollLeft = touchStartScrollRef.current + deltaX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    scheduleResume();
  }, [scheduleResume]);

  // Desktop: pause on hover, resume on leave
  const handleMouseEnter = useCallback(() => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  return (
    <section className="w-full bg-[#FFF8F0] py-8 sm:py-12 border-y border-[#E8CFC5]/50 relative overflow-hidden">
      <style jsx>{`
        @keyframes marqueeSpecial {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        .marquee-special-track {
          display: flex;
          width: max-content;
          animation: marqueeSpecial 40s linear infinite;
          will-change: transform;
        }
        /* Hide scrollbar but keep scrollable on touch */
        .special-scroll-container {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          scrollbar-width: none;
        }
        .special-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-4 text-center mb-6 sm:mb-8 select-none">
        <span className="text-[#C77D62] uppercase tracking-[0.25em] text-[10px] sm:text-xs font-bold block mb-1.5">
          ✦ Silver Articles, Gifts &amp; Lifestyle ✦
        </span>
        <h2 className="font-serif italic text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#9B1B30] tracking-tight">
          Divine Articles &amp; Special Collections
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

      {/* Full-width Edge-to-Edge Continuous Auto-sliding Track */}
      <div
        className="w-full relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Scrollable wrapper — becomes draggable on touch */}
        <div
          ref={scrollContainerRef}
          className={`w-full special-scroll-container ${
            isPaused ? "overflow-x-scroll" : "overflow-hidden"
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="marquee-special-track gap-3.5 sm:gap-6 lg:gap-7 py-2 select-none"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {displayList.map((item, idx) => (
              <Link
                key={`${item.slug}-${idx}`}
                href={item.href || `/products/${item.slug}`}
                draggable={false}
                className="flex flex-col items-center group/card flex-shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 w-24 sm:w-28 md:w-32 lg:w-36 select-none"
              >
                {/* Category Card */}
                <div className="w-full aspect-square rounded-2xl bg-[#FFF0EA] shadow-sm border border-[#E8CFC5] hover:border-[#B82E44] group-hover/card:border-[#B82E44] hover:shadow-md flex items-center justify-center transition-all duration-300 group-hover/card:-translate-y-1 relative overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 144px"
                      draggable={false}
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
      </div>
    </section>
  );
}
