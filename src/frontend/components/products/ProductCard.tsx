"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/frontend/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { IMAGE_PRESETS } from "@/lib/cloudinary";
import dynamic from "next/dynamic";
import type { CheckoutItem } from "@/components/checkout/CheckoutModal";

const CheckoutModal = dynamic(() => import("@/components/checkout/CheckoutModal"), {
  ssr: false,
});

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [showLoginToast, setShowLoginToast] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();

  const isLiked = isInWishlist(product.id);

  const checkoutItems: CheckoutItem[] = [
    {
      productId: product.id,
      productName: product.productType || product.description,
      category: product.category,
      quantity: 1,
      price: product.sellingPrice,
    },
  ];

  // Collect available unique images (Front, Back, Model)
  const imageList = useMemo(() => {
    const list = [product.frontImage, product.backImage, product.modelImage].filter(
      (img): img is string => typeof img === "string" && img.trim().length > 0
    );
    const unique = Array.from(new Set(list));
    return unique.length > 0 ? unique : [product.frontImage || "/images/placeholder.jpg"];
  }, [product.frontImage, product.backImage, product.modelImage]);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Auto-slide every 1.5s on hover, stop and reset on mouse leave
  const startAutoSlide = () => {
    if (imageList.length <= 1) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % imageList.length);
    }, 1500);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveImageIndex(0);
  };

  // Mobile swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || imageList.length <= 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        setActiveImageIndex((prev) => (prev + 1) % imageList.length);
      } else {
        setActiveImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
      }
    }
    touchStartXRef.current = null;
  };

  const currentImage = imageList[activeImageIndex] || imageList[0];
  const detailUrl = `/products/details/${product.id}`;

  const discount =
    product.mrp && product.mrp > product.sellingPrice
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setToastMessage("Please login to add items to your cart.");
      setShowLoginToast(true);
      setTimeout(() => setShowLoginToast(false), 3000);
      return;
    }
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setToastMessage("Please login to add items to your wishlist.");
      setShowLoginToast(true);
      setTimeout(() => setShowLoginToast(false), 3000);
      return;
    }
    toggleWishlist(product);
  };

  return (
    <div
      onMouseEnter={startAutoSlide}
      onMouseLeave={stopAutoSlide}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="bg-[#FFFDFC] rounded-2xl border border-[#E8CFC5] p-2 sm:p-3 shadow-[0_4px_20px_rgba(72,12,20,0.05)] hover:shadow-[0_12px_32px_rgba(72,12,20,0.12)] hover:border-[#E8A58A] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-full"
    >
      <div>
        {/* Visual Container (Clickable -> Detail Page) */}
        <div className="relative w-full aspect-[4/5] rounded-xl bg-[#FFF0EA] flex items-center justify-center border border-[#E8CFC5]/60 overflow-hidden mb-2">

          {/* ❤️ Wishlist Button Top-Right (No Background) */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            suppressHydrationWarning
            className={`absolute top-2 right-2 z-20 p-1 transition-transform duration-200 cursor-pointer active:scale-125 ${
              isLiked ? "scale-110" : "hover:scale-110"
            }`}
            aria-label="Wishlist Item"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
              fill={isLiked ? "#B82E44" : "rgba(0,0,0,0.15)"}
              stroke={isLiked ? "#B82E44" : "#FFFFFF"}
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Product Image Link */}
          <Link href={detailUrl} className="block w-full h-full relative">
            <Image
              src={IMAGE_PRESETS.productCard(currentImage)}
              alt={`${product.productType}`}
              fill
              className="object-cover transition-opacity duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
              loading="lazy"
            />
          </Link>

          {/* ● ○ ○ Dot Indicators (Bottom Center) */}
          {imageList.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-[#1E0508]/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/20 shadow-xs pointer-events-auto">
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  onMouseEnter={() => {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setActiveImageIndex(idx);
                  }}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeImageIndex === idx
                      ? "w-4 h-1.5 bg-[#E6C766] shadow-xs"
                      : "w-1.5 h-1.5 bg-white/60 hover:bg-white"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Material & Weight Specs (Inline Badges) */}
        <div className="flex items-center justify-between gap-1 text-[10px] sm:text-xs text-[#6F4A4A] font-medium mb-1">
          <span className="truncate font-semibold text-[#B82E44] bg-[#FFE2D8] px-1.5 py-0.5 rounded">
            {product.material}
          </span>
          {product.weight && (
            <span className="bg-[#FFF0EA] px-1.5 py-0.5 rounded border border-[#E8CFC5]/60 font-semibold text-[#35191C] whitespace-nowrap">
              ⚖️ {product.weight}
            </span>
          )}
        </div>

        {/* Product Type & Title (Link to Details Page) */}
        <Link href={detailUrl} className="block group-hover:text-[#B82E44] transition-colors mb-1">
          <h3 className="font-sans font-bold text-xs sm:text-sm text-[#35191C] leading-snug line-clamp-1 truncate">
            {product.productType || product.description}
          </h3>
          <p className="text-[10px] sm:text-xs text-[#6F4A4A]/80 font-normal line-clamp-1 truncate">
            {product.description}
          </p>
        </Link>
      </div>

      {/* Pricing & Actions Section */}
      <div className="pt-1.5 border-t border-[#E8CFC5]/50 mt-1">
        {/* Price Row: Simple, Bold, Visible Font */}
        <div className="flex items-baseline justify-between gap-1 my-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-sans font-extrabold text-base sm:text-lg text-[#9B1B30]">
              ₹{product.sellingPrice.toLocaleString("en-IN")}
            </span>
            {product.mrp && product.mrp > product.sellingPrice && (
              <span className="text-[10px] sm:text-xs text-[#6F4A4A]/50 line-through font-normal">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="text-[9px] sm:text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] px-1.5 py-0.5 rounded whitespace-nowrap">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-2 px-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wide border transition-all flex items-center justify-center gap-1 cursor-pointer ${
              justAdded
                ? "bg-[#2E7D32] text-white border-[#2E7D32]"
                : "bg-[#FFF0EA] hover:bg-[#FFE2D8] text-[#B82E44] border-[#E8CFC5]"
            }`}
          >
            <span>{justAdded ? "✓ Added" : "🛒 Cart"}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!user) {
                const redirectUrl = encodeURIComponent(detailUrl);
                const msg = encodeURIComponent("Please sign in to buy this product.");
                router.push(`/login?redirect=${redirectUrl}&msg=${msg}`);
                return;
              }
              setIsCheckoutOpen(true);
            }}
            className="w-full py-2 px-1.5 bg-[#B82E44] hover:bg-[#7C1B2A] text-[#FFF8F0] text-[10px] sm:text-xs font-bold uppercase tracking-wide rounded-lg shadow-xs active:scale-95 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>💳 Buy</span>
          </button>
        </div>
      </div>

      {/* Razorpay Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={checkoutItems}
          totalAmount={product.sellingPrice}
        />
      )}

      {/* Toast Notification for Login Required */}
      {mounted && showLoginToast && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center sm:items-end sm:justify-end pointer-events-none sm:p-6 px-4">
          <div className="pointer-events-auto w-full max-w-[280px] sm:max-w-none sm:w-auto bg-[#7C1B2A] text-[#FFF8F0] p-5 sm:px-5 sm:py-4 rounded-3xl sm:rounded-2xl shadow-2xl border border-[#D4AF37]/50 flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 sm:gap-4 animate-bounce">
            <span className="text-4xl sm:text-2xl shrink-0">⚠️</span>
            <div className="flex-1 w-full">
              <p className="text-sm sm:text-xs font-bold text-[#E6C766]">Login Required</p>
              <p className="text-[11px] sm:text-[11px] text-[#FFF8F0]/90 mt-1 sm:mt-0 line-clamp-2 sm:line-clamp-1">{toastMessage}</p>
            </div>
            <Link
              href="/login"
              className="w-full sm:w-auto sm:ml-1 px-4 py-2.5 sm:py-1.5 bg-[#E6C766] hover:bg-[#D4AF37] text-[#35191C] text-xs sm:text-[11px] font-bold rounded-xl transition-all whitespace-nowrap"
            >
              Login →
            </Link>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
