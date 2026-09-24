export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#FFF8F0]/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Elegant Spinning Diamond/Jewelry Loader */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-[#E8CFC5] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#B82E44] rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 border-4 border-[#D4AF37] rounded-full border-b-transparent animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
          <span className="text-xl">✨</span>
        </div>
        
        {/* Text */}
        <div className="text-center flex flex-col gap-1">
          <span className="font-serif text-[#B82E44] text-lg font-bold tracking-widest uppercase animate-pulse">
            Keshar <span className="text-[#D4AF37] italic lowercase">Jewellers</span>
          </span>
          <span className="text-[#6F4A4A] text-xs font-medium uppercase tracking-[0.2em]">
            Curating Elegance...
          </span>
        </div>
      </div>
    </div>
  );
}
