"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, CategoryItem } from "@/data/categories";

interface CategoryCarouselProps {
  categories?: CategoryItem[];
}

export default function CategoryCarousel({ categories = CATEGORIES }: CategoryCarouselProps) {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Only include categories that have images (remove cards showing icons)
  const imageCategories = categories.filter((cat) => Boolean(cat.image));

  // Split categories into 2 balanced rows and duplicate for infinite continuous scroll
  const row1Original = imageCategories.filter((_, i) => i % 2 === 0);
  const row2Original = imageCategories.filter((_, i) => i % 2 !== 0);
  const row1 = [...row1Original, ...row1Original, ...row1Original];
  const row2 = [...row2Original, ...row2Original, ...row2Original];

  // Fast continuous 60fps infinite scroll logic
  useEffect(() => {
    if (isPaused) return;

    let animId: number;
    const speed = 1.3; // Fast scroll speed (pixels per frame)

    const scrollStep = () => {
      const el1 = row1Ref.current;
      const el2 = row2Ref.current;

      if (el1) {
        const halfWidth1 = el1.scrollWidth / 3;
        if (el1.scrollLeft >= halfWidth1 * 2) {
          el1.scrollLeft -= halfWidth1;
        } else {
          el1.scrollLeft += speed;
        }
      }

      if (el2) {
        const halfWidth2 = el2.scrollWidth / 3;
        if (el2.scrollLeft >= halfWidth2 * 2) {
          el2.scrollLeft -= halfWidth2;
        } else {
          el2.scrollLeft += speed;
        }
      }

      animId = requestAnimationFrame(scrollStep);
    };

    animId = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  const renderCategoryCard = (cat: CategoryItem, index: number) => (
    <Link
      key={`${cat.id}-${index}`}
      href={cat.href}
      className="flex flex-col items-center group/item flex-shrink-0 cursor-pointer transition-transform duration-500 ease-out hover:scale-105 
                 w-24 sm:w-28 md:w-32 lg:w-[calc((100%-6*1.25rem)/7)] select-none"
    >
      {/* Category Card */}
      <div className="w-full aspect-square rounded-2xl bg-[#FFF0EA] shadow-sm border border-[#E8CFC5] hover:border-[#B82E44] group-hover/item:border-[#B82E44] hover:shadow-md flex items-center justify-center transition-all duration-500 group-hover/item:-translate-y-1 relative overflow-hidden">
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
              {cat.icon}
            </span>
          </div>
        )}
      </div>

      {/* Category Title */}
      <span className="font-serif italic text-xs sm:text-sm text-[#B82E44] font-semibold mt-2 group-hover/item:text-[#801B2C] transition-colors text-center line-clamp-1">
        {cat.name}
      </span>
    </Link>
  );

  return (
    <section className="w-full bg-[#FFF8F0] py-8 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        className="max-w-[1400px] mx-auto relative group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Section Heading */}
        <div className="text-center mb-6 select-none">
          <h2 className="font-serif italic text-2xl sm:text-3xl font-semibold text-[#B82E44] tracking-tight">
            Shop by Category
          </h2>
          <div className="w-16 h-0.5 bg-[#B82E44] mx-auto mt-1 rounded-full opacity-60"></div>
        </div>

        {/* Categories Container - 2 Fast Auto-scrolling Rows */}
        <div className="flex flex-col gap-5 sm:gap-6 py-2">
          {/* Row 1 */}
          <div
            ref={row1Ref}
            className="flex items-center gap-4 sm:gap-5 overflow-x-auto scrollbar-none px-2 sm:px-4 py-1 select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {row1.map((cat, idx) => renderCategoryCard(cat, idx))}
          </div>

          {/* Row 2 */}
          <div
            ref={row2Ref}
            className="flex items-center gap-4 sm:gap-5 overflow-x-auto scrollbar-none px-2 sm:px-4 py-1 select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {row2.map((cat, idx) => renderCategoryCard(cat, idx))}
          </div>
        </div>
      </div>
    </section>
  );
}
