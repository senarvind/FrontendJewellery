interface HeroPaginationProps {
  totalSlides: number;
  currentSlide: number;
  onSelectSlide: (index: number) => void;
}

export default function HeroPagination({
  totalSlides,
  currentSlide,
  onSelectSlide
}: HeroPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-2.5 select-none">
      {Array.from({ length: totalSlides }).map((_, idx) => {
        const isActive = idx === currentSlide;
        return (
          <button
            key={idx}
            suppressHydrationWarning
            onClick={() => onSelectSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              isActive
                ? "w-7 h-2 bg-[#4a1024] shadow-sm"
                : "w-2 h-2 bg-[#b8a2a8] hover:bg-[#855e69]"
            }`}
          />
        );
      })}
    </div>
  );
}
