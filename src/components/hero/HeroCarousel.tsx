"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { HeroSlideData } from "@/data/heroSlides";
import HeroSlide from "./HeroSlide";
import HeroPagination from "./HeroPagination";

interface HeroCarouselProps {
  slides: HeroSlideData[];
  autoPlayInterval?: number;
}

export default function HeroCarousel({
  slides,
  autoPlayInterval = 5000
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, nextSlide, slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="w-full flex flex-col items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-2xl border border-[#F0E6D8] bg-[#FFE2D8]">
        <div 
          className="flex transition-transform duration-700 ease-in-out aspect-[4/3] md:aspect-[16/9] 2xl:aspect-[21/9] min-h-[400px]"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-full flex-shrink-0 relative">
              <HeroSlide slide={slide} />
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <HeroPagination
          totalSlides={slides.length}
          currentSlide={currentSlide}
          onSelectSlide={(idx) => setCurrentSlide(idx)}
        />
      )}
    </div>
  );
}
