"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, CategoryItem } from "@/frontend/data/categories";

interface CategoryCarouselProps {
  categories?: CategoryItem[];
}

export default function CategoryCarousel({ categories = CATEGORIES }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Automatic smooth side-sliding transition effect for mobile and desktop view
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 220, behavior: "smooth" });
      }
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-[#FFF8F0] py-6 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative group">
        
        {/* Section Heading */}
        <div className="text-center mb-6 select-none">
          <h2 className="font-serif italic text-2xl sm:text-3xl font-semibold text-[#B82E44] tracking-tight">
            Shop by Category
          </h2>
        </div>

        {/* Scrollable Container with Smooth Slide Transition */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth px-2 sm:px-4 py-3 select-none transition-all duration-700 ease-in-out"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex flex-col items-center group/item flex-shrink-0 cursor-pointer transition-transform duration-500 ease-out hover:scale-105"
            >
              {/* Category Card */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-[#FFF0EA] shadow-sm border border-[#E8CFC5] hover:border-[#E8A58A] group-hover/item:border-[#E8A58A] flex items-center justify-center transition-all duration-500 group-hover/item:-translate-y-1 relative overflow-hidden">
                {cat.image ? (
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className={`object-cover transition-transform duration-500 ease-out ${cat.imageClassName ? cat.imageClassName : 'group-hover/item:scale-110'}`} 
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.9),_rgba(255,240,234,0.4))] flex items-center justify-center shadow-inner relative z-10 overflow-hidden">
                    <span className="text-2xl sm:text-3xl md:text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] group-hover/item:scale-110 transition-transform duration-500">
                      {cat.icon}
                    </span>
                  </div>
                )}
              </div>

              {/* Category Title */}
              <span className="font-serif italic text-xs sm:text-sm text-[#B82E44] font-medium mt-2 group-hover/item:text-[#B82E44] transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
