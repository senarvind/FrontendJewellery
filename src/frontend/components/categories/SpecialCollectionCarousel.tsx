"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SPECIAL_COLLECTIONS, CategoryItem } from "@/frontend/data/categories";

interface SpecialCollectionCarouselProps {
  items?: CategoryItem[];
}

export default function SpecialCollectionCarousel({
  items = SPECIAL_COLLECTIONS,
}: SpecialCollectionCarouselProps) {
  // Each item is rendered once; visitors swipe the row (no duplicated marquee copies).
  return (
    <section className="w-full bg-[#FFF8F0] py-8 sm:py-12 border-y border-[#E8CFC5]/50 relative overflow-hidden">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-4 text-center mb-6 sm:mb-8 select-none">
        <span className="text-[#965238] uppercase tracking-[0.25em] text-xs font-bold block mb-1.5">
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
          Explore 92.5 sterling silver utensils, divine idols, hallmark coins, kids jewellery &amp; luxury silver pens.
        </p>
      </div>

      {/* Full-width Edge-to-Edge Continuous Auto-sliding Track */}
      <div className="w-full relative group">
        <div className="w-full overflow-x-auto scrollbar-none snap-x snap-mandatory overscroll-x-contain">
          <div className="flex w-max mx-auto gap-3.5 sm:gap-6 lg:gap-7 py-2 px-4 select-none">
            {items.map((item) => (
              <Link
                key={item.slug}
                href={item.href || `/products/${item.slug}`}
                draggable={false}
                className="snap-start flex flex-col items-center group/card flex-shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 w-24 sm:w-28 md:w-32 lg:w-36 select-none"
              >
                {/* Category Card */}
                <div className="w-full aspect-square rounded-2xl bg-[#FFF0EA] shadow-sm border border-[#E8CFC5] hover:border-[#B82E44] group-hover/card:border-[#B82E44] hover:shadow-md flex items-center justify-center transition-all duration-300 group-hover/card:-translate-y-1 relative overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt=""
                      width={144}
                      height={144}
                      draggable={false}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out ${
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
