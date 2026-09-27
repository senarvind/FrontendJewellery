"use client";

import { useState } from "react";
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
  // 0 = Front Image, 1 = Back Image, 2 = Model Image
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
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

  const images = [
    { label: "Front", src: product.frontImage || "/images/placeholder.jpg" },
    { label: "Back", src: product.backImage || product.frontImage || "/images/placeholder.jpg" },
    { label: "Model", src: product.modelImage || product.frontImage || "/images/placeholder.jpg" },
  ];

  const currentImage = images[activeImageIndex]?.src || product.frontImage;
  const detailUrl = `/products/details/${product.id}`;

  const discount =
    product.mrp && product.mrp > product.sellingPrice
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="bg-[#FFFDFC] rounded-2xl border border-[#E8CFC5] p-2 sm:p-3 shadow-[0_4px_20px_rgba(72,12,20,0.05)] hover:shadow-[0_12px_32px_rgba(72,12,20,0.12)] hover:border-[#E8A58A] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-full">
      <div>
        {/* Visual Container (Clickable -> Detail Page) */}
        <div className="relative w-full aspect-square rounded-xl bg-[#FFF0EA] flex items-center justify-center border border-[#E8CFC5]/60 overflow-hidden mb-2">
          {/* Subtle Hallmark/Material Badge Top-Left */}
          <span className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded-md bg-[#5E121F]/80 backdrop-blur-md text-[8px] sm:text-[9px] font-bold text-[#E6C766] border border-[#D4AF37]/30 uppercase tracking-wider shadow-xs">
            ✨ {product.material ? product.material.replace(/Sterling Silver/i, "Silver") : "BIS 916"}
          </span>

          {/* ❤️ Wishlist Button Top-Right */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            suppressHydrationWarning
            className={`absolute top-1.5 right-1.5 z-20 p-1 sm:p-1.5 rounded-full border backdrop-blur-md transition-all cursor-pointer ${
              isLiked
                ? "bg-white border-[#F8B4B4] text-[#B82E44] shadow-md scale-110"
                : "bg-[#35191C]/50 border-[#E8CFC5]/40 text-white hover:text-[#B82E44] hover:bg-white"
            }`}
            aria-label="Wishlist Item"
          >
            <svg
              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
              fill={isLiked ? "#B82E44" : "none"}
              stroke={isLiked ? "#B82E44" : "currentColor"}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Sleek Floating Photo Switcher (Front, Back, Model) */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-[#1E0508]/75 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-[#D4AF37]/30 shadow-sm">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                onMouseEnter={() => setActiveImageIndex(idx)}
                className={`px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-semibold transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? "bg-[#B82E44] text-white font-bold shadow-xs scale-105"
                    : "text-[#FFE2D8]/80 hover:text-white"
                }`}
              >
                {img.label}
              </button>
            ))}
          </div>

          {/* Product Image Link */}
          <Link href={detailUrl} className="block w-full h-full relative">
            <Image
              src={IMAGE_PRESETS.productCard(currentImage)}
              alt={`${product.productType} - ${images[activeImageIndex].label} View`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 16vw"
              loading="lazy"
            />
          </Link>
        </div>

        {/* Material & Weight Specs (Inline Badges) */}
        <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[10px] text-[#6F4A4A] font-medium mb-1">
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
      <div className="pt-1 border-t border-[#E8CFC5]/50 mt-1">
        {/* Price Row: Simple, Bold, Visible Font */}
        <div className="flex items-baseline justify-between gap-1 my-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-sans font-extrabold text-sm sm:text-base md:text-lg text-[#9B1B30]">
              ₹{product.sellingPrice.toLocaleString("en-IN")}
            </span>
            {product.mrp && product.mrp > product.sellingPrice && (
              <span className="text-[9px] sm:text-[11px] text-[#6F4A4A]/50 line-through font-normal">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="text-[8px] sm:text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-1 py-0.5 rounded whitespace-nowrap">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-1 sm:gap-1.5 mt-1.5">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-1.5 sm:py-2 px-1 rounded-lg text-[9px] sm:text-xs font-bold uppercase tracking-wide border transition-all flex items-center justify-center gap-1 cursor-pointer ${
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
            className="w-full py-1.5 sm:py-2 px-1 bg-[#B82E44] hover:bg-[#7C1B2A] text-[#FFF8F0] text-[9px] sm:text-xs font-bold uppercase tracking-wide rounded-lg shadow-xs active:scale-95 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
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
    </div>
  );
}
