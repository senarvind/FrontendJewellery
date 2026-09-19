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
    <div className="flex items-center justify-center gap-1.5 py-2.5 select-none">
      {Array.from({ length: totalSlides }).map((_, idx) => {
        const isActive = idx === currentSlide;
        return (
          <button
            key={idx}
            suppressHydrationWarning
            type="button"
            onClick={() => onSelectSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className="p-2 -m-1 flex items-center justify-center focus:outline-none"
          >
            <span
              className={`transition-all duration-300 rounded-full block ${
                isActive
                  ? "w-7 h-2 bg-[#7C1B2A] shadow-xs"
                  : "w-2.5 h-2.5 bg-[#B82E44]/30 hover:bg-[#B82E44]/60"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
