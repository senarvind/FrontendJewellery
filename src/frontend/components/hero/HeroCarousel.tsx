"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { HeroSlideData } from "@/frontend/data/heroSlides";
import HeroSlide from "./HeroSlide";
import HeroPagination from "./HeroPagination";

interface HeroCarouselProps {
  slides: HeroSlideData[];
  autoPlayInterval?: number;
}

export default function HeroCarousel({
  slides,
  autoPlayInterval = 3000
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Automatic continuous sliding timer for mobile and desktop view
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlayInterval, isPaused, nextSlide, slides.length]);

  // Pause auto-sliding for 5 seconds when user hovers or taps on phone
  const triggerFiveSecondPause = useCallback(() => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  }, []);

  // Touch Swipe Handlers for mobile & tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    triggerFiveSecondPause();
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 35;

      if (distance > minSwipeDistance) {
        nextSlide();
      } else if (distance < -minSwipeDistance) {
        prevSlide();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;

    // Pause for 5 seconds after touch/swipe
    triggerFiveSecondPause();
  };

  const handleSlideSelect = (idx: number) => {
    setCurrentSlide(idx);
    triggerFiveSecondPause();
  };

  return (
    <div
      className="w-full flex flex-col items-center relative group select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={triggerFiveSecondPause}
    >
      <div className="relative w-full overflow-hidden shadow-[0_8px_30px_rgba(122,16,33,0.12)] rounded-xl sm:rounded-2xl border border-[#E8CFC5] bg-[#FFE2D8]">

        {/* Smooth Slide Transition Track */}
        <div 
          className="flex transition-transform duration-700 ease-in-out aspect-[16/10] xs:aspect-[16/9] md:aspect-[21/9] min-h-[250px] xs:min-h-[290px] sm:min-h-[360px] md:min-h-[420px]"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-full flex-shrink-0 relative h-full">
              <HeroSlide slide={slide} />
            </div>
          ))}
        </div>

        {/* Bottom Slide Progress Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E8CFC5]/40 overflow-hidden z-20">
          <div
            key={`${currentSlide}-${isPaused}`}
            className={`h-full bg-[#D4AF37] origin-left ${
              isPaused ? "w-0 transition-none" : "w-full transition-all duration-[3000ms] ease-linear"
            }`}
          />
        </div>
      </div>

      {/* Pagination Control Dots */}
      {slides.length > 1 && (
        <HeroPagination
          totalSlides={slides.length}
          currentSlide={currentSlide}
          onSelectSlide={handleSlideSelect}
        />
      )}
    </div>
  );
}
