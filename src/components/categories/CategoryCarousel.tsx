"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, CategoryItem } from "@/data/categories";

interface CategoryCarouselProps {
  categories?: CategoryItem[];
}

export default function CategoryCarousel({ categories = CATEGORIES }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-[#FFF8F0] py-6 px-3 sm:px-6 lg:px-8 relative">
      <div className="max-w-[1400px] mx-auto relative group">
        
        {/* Section Heading */}
        <div className="text-center mb-6 select-none">
          <h2 className="font-serif italic text-2xl sm:text-3xl font-semibold text-[#B82E44] tracking-tight">
            Shop by Category
          </h2>
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll Left"
          className="absolute -left-2 sm:left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFF8F0] border border-[#E8CFC5] shadow-md text-[#B82E44] hover:text-[#B82E44] hover:border-[#E8A58A] flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth px-6 sm:px-10 py-2 select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex flex-col items-center group/item flex-shrink-0 cursor-pointer"
            >
              {/* Category Card - image covers full button area */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-[#FFF0EA] shadow-sm border border-[#E8CFC5] hover:border-[#E8A58A] group-hover/item:border-[#E8A58A] flex items-center justify-center transition-all duration-300 group-hover/item:-translate-y-1 relative overflow-hidden">
                {cat.image ? (
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className={`object-cover transition-transform duration-300 ${cat.imageClassName ? cat.imageClassName : 'group-hover/item:scale-110'}`} 
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.9),_rgba(255,240,234,0.4))] flex items-center justify-center shadow-inner relative z-10 overflow-hidden">
                    <span className="text-2xl sm:text-3xl md:text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] group-hover/item:scale-110 transition-transform duration-300">
                      {cat.icon}
                    </span>
                  </div>
                )}
              </div>

              {/* Category Title in mehroon */}
              <span className="font-serif italic text-xs sm:text-sm text-[#B82E44] font-medium mt-2 group-hover/item:text-[#B82E44] transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll Right"
          className="absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFF8F0] border border-[#E8CFC5] shadow-md text-[#B82E44] hover:text-[#B82E44] hover:border-[#E8A58A] flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>
    </section>
  );
}
