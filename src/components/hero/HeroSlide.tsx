import Link from "next/link";
import Image from "next/image";
import { HeroSlideData } from "@/data/heroSlides";

interface HeroSlideProps {
  slide: HeroSlideData;
}

export default function HeroSlide({ slide }: HeroSlideProps) {
  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Container background soft peach */}
      <div className="absolute inset-0 bg-[#FFE2D8]" />

      {/* Decorative ambient lighting glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E8A58A]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Banner Layout */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 lg:px-16 py-6">
        
        {/* Left Side: Typography & Product Tagline */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left justify-center max-w-xl">
          <span className="inline-block text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#C77D62] font-semibold mb-2 sm:mb-3">
            {slide.category}
          </span>
          
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#B82E44] tracking-tight leading-tight mb-2 sm:mb-3">
            {slide.title}
          </h2>

          {/* Ornamental Divider */}
          <div className="flex items-center gap-3 my-2 text-[#B82E44]/60 w-36 md:w-48">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#B82E44]/50 to-transparent flex-1" />
            <span className="text-xs font-serif text-[#A77C18]">❖</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#B82E44]/50 to-transparent flex-1" />
          </div>

          <p className="font-serif italic text-base sm:text-2xl text-[#6F4A4A] font-light mb-6">
            {slide.subtitle}
          </p>

          <Link
            href={slide.href}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B82E44] text-[#FFF8F0] hover:bg-[#7C1B2A] text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
          >
            <span>Explore Collection</span>
            <span>→</span>
          </Link>
        </div>

        {/* Right Side: Visual Showcase of Jewellery */}
        <div className="flex-1 relative w-full h-full flex items-center justify-center mt-4 md:mt-0">
          <div className="relative w-44 h-44 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-[#FFF8F0]/90 via-[#FFE2D8]/80 to-[#FFF0EA]/70 border-2 border-[#E8A58A] shadow-[0_20px_50px_rgba(122,16,33,0.12)] flex items-center justify-center p-4">
            <div className="w-full h-full rounded-full border border-dashed border-[#D4AF37] flex items-center justify-center text-center relative overflow-hidden">
              {slide.image ? (
                <Image src={slide.image} alt={slide.alt} fill className="object-cover p-2 rounded-full" />
              ) : (
                <div className="relative z-10 flex flex-col items-center justify-center p-6">
                  <span className="text-4xl sm:text-6xl md:text-7xl mb-2 filter drop-shadow-[0_10px_20px_rgba(212,175,55,0.4)]">
                    ✨
                  </span>
                  <span className="font-serif text-sm sm:text-base md:text-lg text-[#B82E44] font-medium">
                    Authentic 92.5% Silver & Gold
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#A77C18] tracking-widest uppercase mt-1 font-semibold">
                    BIS Hallmarked
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <span className="absolute bottom-3 right-5 text-[9px] uppercase tracking-widest text-[#6F4A4A]/60 font-medium select-none">
        T&C APPLY
      </span>
    </div>
  );
}
