import Link from "next/link";
import Image from "next/image";
import { HeroSlideData } from "@/frontend/data/heroSlides";

interface HeroSlideProps {
  slide: HeroSlideData;
}

export default function HeroSlide({ slide }: HeroSlideProps) {
  const isFullBanner = slide.isFullBanner || slide.image?.includes("Banner.png") || slide.image?.includes("whatsapp");
  const hasText = Boolean(slide.title || slide.subtitle || slide.category);

  if (isFullBanner && slide.image) {
    return (
      <div className="relative w-full h-full overflow-hidden select-none bg-[#FFE2D8]">
        {/* Full Banner Wallpaper Image */}
        <Image
          src={slide.image}
          alt={slide.alt}
          fill
          className="object-cover object-center"
          priority
        />

        {/* Elegant Gradient Overlay - only when text is present */}
        {hasText && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C1417]/85 via-[#2C1417]/50 to-transparent" />
        )}

        {/* Banner Content Overlay */}
        {hasText && (
          <div className="relative z-10 w-full h-full flex flex-col items-start justify-center px-4 sm:px-12 lg:px-16 max-w-2xl text-white">
            {slide.category && (
              <span className="inline-block text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#E6C766] font-extrabold mb-1 sm:mb-3 drop-shadow-sm">
                {slide.category}
              </span>
            )}

            {slide.title && (
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-6xl font-extrabold text-[#FFFDFC] tracking-tight leading-tight mb-1 sm:mb-3 drop-shadow-lg">
                {slide.title}
              </h2>
            )}

            {slide.title && (
              <div className="flex items-center gap-2 sm:gap-3 my-1 sm:my-2 text-[#E6C766]/80 w-28 sm:w-48">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-[#E6C766] to-transparent flex-1" />
                <span className="text-[10px] sm:text-xs font-serif text-[#E6C766]">❖</span>
                <div className="h-[1px] bg-gradient-to-r from-transparent via-[#E6C766] to-transparent flex-1" />
              </div>
            )}

            {slide.subtitle && (
              <p className="font-serif italic text-xs sm:text-xl text-[#E8CFC5] font-light mb-3 sm:mb-6 drop-shadow-sm">
                {slide.subtitle}
              </p>
            )}

            {slide.href && (
              <Link
                href={slide.href}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#A77C18] text-[#35191C] hover:from-[#E6C766] hover:to-[#D4AF37] text-[10px] sm:text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-xl hover:scale-105"
              >
                <span>Explore Collection</span>
                <span>→</span>
              </Link>
            )}
          </div>
        )}

        <span className="absolute bottom-2 right-3 sm:bottom-3 sm:right-5 text-[8px] sm:text-[9px] uppercase tracking-widest text-white/80 font-medium select-none bg-black/30 backdrop-blur-xs px-1.5 py-0.5 rounded">
          T&C APPLY
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden select-none flex items-center">
      {/* Container background soft peach */}
      <div className="absolute inset-0 bg-[#FFE2D8]" />

      {/* Decorative ambient lighting glows */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-[#E8A58A]/30 rounded-full blur-2xl sm:blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-[#D4AF37]/20 rounded-full blur-2xl sm:blur-3xl pointer-events-none" />

      {/* Banner Layout */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-between px-4 xs:px-6 sm:px-12 lg:px-16 py-3 sm:py-6 gap-2 md:gap-4">

        {/* Left Side: Typography & Product Tagline */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left justify-center max-w-xl">
          <span className="inline-block text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C77D62] font-bold mb-1 sm:mb-2">
            {slide.category}
          </span>

          <h2 className="font-serif text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-bold text-[#B82E44] tracking-tight leading-tight mb-1 sm:mb-2">
            {slide.title}
          </h2>

          {/* Ornamental Divider */}
          <div className="flex items-center gap-2 sm:gap-3 my-1 sm:my-2 text-[#B82E44]/60 w-28 xs:w-36 md:w-48">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#B82E44]/50 to-transparent flex-1" />
            <span className="text-[10px] sm:text-xs font-serif text-[#A77C18]">❖</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#B82E44]/50 to-transparent flex-1" />
          </div>

          <p className="font-serif italic text-xs xs:text-sm sm:text-xl text-[#6F4A4A] font-light mb-2.5 sm:mb-5 line-clamp-2 md:line-clamp-none">
            {slide.subtitle}
          </p>

          <Link
            href={slide.href}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-full bg-[#B82E44] text-[#FFF8F0] hover:bg-[#7C1B2A] text-[10px] xs:text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
          >
            <span>Explore Collection</span>
            <span>→</span>
          </Link>
        </div>

        {/* Right Side: Visual Showcase of Jewellery */}
        <div className="flex-1 relative w-full flex items-center justify-center mt-1 sm:mt-2 md:mt-0">
          <div className="relative w-28 h-28 xs:w-36 xs:h-36 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-full bg-gradient-to-br from-[#FFF8F0]/90 via-[#FFE2D8]/80 to-[#FFF0EA]/70 border-2 border-[#E8A58A] shadow-[0_10px_30px_rgba(122,16,33,0.12)] flex items-center justify-center p-2 sm:p-4">
            <div className="w-full h-full rounded-full border border-dashed border-[#D4AF37] flex items-center justify-center text-center relative overflow-hidden">
              {slide.image ? (
                <Image src={slide.image} alt={slide.alt} fill className="object-cover p-1.5 sm:p-2 rounded-full" priority />
              ) : (
                <div className="relative z-10 flex flex-col items-center justify-center p-2 sm:p-6">
                  <span className="text-2xl sm:text-5xl md:text-6xl mb-1 filter drop-shadow-[0_10px_20px_rgba(212,175,55,0.4)]">
                    ✨
                  </span>
                  <span className="font-serif text-xs sm:text-base md:text-lg text-[#B82E44] font-medium">
                    Authentic 92.5% Silver & Gold
                  </span>
                  <span className="text-[9px] sm:text-xs text-[#A77C18] tracking-widest uppercase mt-0.5 font-semibold">
                    BIS Hallmarked
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <span className="absolute bottom-2 right-3 sm:bottom-3 sm:right-5 text-[8px] sm:text-[9px] uppercase tracking-widest text-[#6F4A4A]/70 font-medium select-none bg-white/40 backdrop-blur-xs px-1.5 py-0.5 rounded">
        T&C APPLY
      </span>
    </div>
  );
}
