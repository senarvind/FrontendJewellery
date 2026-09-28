"use client";

export default function ProductCardSkeleton() {
  return (
    <div className="product-card group relative flex flex-col justify-between overflow-hidden bg-[var(--warm-white)] border border-[var(--border-light)] rounded-xl shadow-sm animate-pulse transition-all duration-300">
      {/* Top Image Container Skeleton */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-t-xl overflow-hidden">
        {/* Wishlist Button Skeleton */}
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-300/80" />
        
        {/* Hallmark Badge Skeleton */}
        <div className="absolute top-2 left-2 w-14 h-5 rounded-full bg-gray-300/80" />

        {/* View Switcher Pills Skeleton */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
          <div className="w-9 h-4 bg-gray-300/70 rounded-full" />
          <div className="w-9 h-4 bg-gray-300/70 rounded-full" />
          <div className="w-9 h-4 bg-gray-300/70 rounded-full" />
        </div>
      </div>

      {/* Card Body Skeleton */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Title / Description Skeleton */}
          <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2" />

          {/* Specs Pill Skeleton (Gold, Weight) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="h-4 w-16 bg-gray-100 rounded-full border border-gray-200" />
            <div className="h-4 w-14 bg-gray-100 rounded-full border border-gray-200" />
          </div>
        </div>

        {/* Pricing Skeleton */}
        <div className="space-y-1 pt-1 border-t border-gray-100">
          <div className="flex items-baseline justify-between">
            <div className="h-5 w-24 bg-gray-200 rounded-md" />
            <div className="h-3 w-12 bg-gray-200 rounded-md" />
          </div>
          <div className="h-3 w-16 bg-gray-100 rounded-md" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="h-9 bg-gray-200 rounded-lg" />
          <div className="h-9 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
