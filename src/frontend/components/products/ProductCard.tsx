"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/frontend/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
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
    { label: "Back / Stamp", src: product.backImage || product.frontImage || "/images/placeholder.jpg" },
    { label: "Model Wear", src: product.modelImage || product.frontImage || "/images/placeholder.jpg" },
  ];

  const currentImage = images[activeImageIndex]?.src || product.frontImage;

  const detailUrl = `/products/details/${product.id}`;

  const waMessage = encodeURIComponent(
    `Hello Keshar Jewellers, I want to order/enquire about:
• Type: ${product.productType}
• Description: ${product.description}
• Material: ${product.material}
• Weight: ${product.weight}
• Dimensions: L:${product.dimensionL} x W:${product.dimensionW} x H:${product.dimensionH}
• Selling Price: ₹${product.sellingPrice}`
  );

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
    <div className="bg-[#FFFDFC] rounded-2xl border border-[#E8CFC5] p-2.5 sm:p-5 shadow-[0_8px_30px_rgba(72,12,20,0.06)] hover:shadow-[0_12px_40px_rgba(72,12,20,0.12)] hover:border-[#E8A58A] transition-all duration-300 flex flex-col justify-between group relative">
      <div>
        {/* Visual Container (Clickable -> Detail Page) */}
        <div className="relative w-full aspect-square rounded-xl bg-[#FFF0EA] flex items-center justify-center border border-[#E8CFC5] overflow-hidden mb-2 sm:mb-3">
          {/* Material Badge */}
          <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 bg-[#B82E44] text-[#FFF8F0] text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md uppercase tracking-wider shadow-xs z-10">
            {product.material}
          </span>

          {/* ❤️ Like / Wishlist Icon Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            suppressHydrationWarning
            className={`absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-20 p-1 sm:p-1.5 rounded-full border backdrop-blur-md transition-all ${
              isLiked
                ? "bg-white border-[#F8B4B4] text-[#B82E44] shadow-md scale-110"
                : "bg-[#35191C]/60 border-[#E8CFC5]/50 text-white hover:text-[#B82E44] hover:bg-white"
            }`}
            aria-label="Wishlist Item"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill={isLiked ? "#B82E44" : "none"}
              stroke={isLiked ? "#B82E44" : "currentColor"}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Active View Label */}
          <span className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 bg-[#480C14]/80 backdrop-blur-md text-[#E6C766] text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded border border-[#D4AF37]/40 z-10">
            {images[activeImageIndex].label}
          </span>

          {/* Current Displayed Image (Link to Details Page) */}
          <Link href={detailUrl} className="block w-full h-full relative">
            <Image
              src={currentImage}
              alt={`${product.productType} - ${images[activeImageIndex].label} View`}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </Link>
        </div>

        {/* 3-Image Selector Tabs (Front, Back, Model) */}
        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 mb-2 sm:mb-3.5">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              onMouseEnter={() => setActiveImageIndex(idx)}
              className={`py-0.5 sm:py-1 px-0.5 rounded-md text-[8px] sm:text-[10px] font-medium tracking-wider uppercase transition-all duration-200 border text-center truncate ${
                activeImageIndex === idx
                  ? "bg-[#B82E44] text-[#FFF8F0] border-[#B82E44] font-bold shadow-xs"
                  : "bg-[#FFF0EA] text-[#6F4A4A] border-[#E8CFC5] hover:border-[#B82E44] hover:text-[#B82E44]"
              }`}
            >
              {idx === 0 ? "① Front" : idx === 1 ? "② Back" : "③ Model"}
            </button>
          ))}
        </div>

        {/* Product Type & Description (Link to Details Page) */}
        <div className="mb-2 sm:mb-3">
          <span className="text-[9px] sm:text-[11px] font-bold tracking-wider uppercase text-[#C77D62] block">
            {product.productType}
          </span>
          <Link href={detailUrl} className="hover:text-[#B82E44] transition-colors">
            <p className="font-serif text-xs sm:text-base text-[#35191C] font-medium leading-snug mt-0.5 sm:mt-1 line-clamp-2">
              {product.description}
            </p>
          </Link>
        </div>

        {/* Specifications Box: Material, Dimensions, Weight */}
        <div className="bg-[#FFF0EA]/60 border border-[#E8CFC5]/70 rounded-xl p-2 sm:p-3 text-[10px] sm:text-xs text-[#35191C]/85 space-y-1 sm:space-y-1.5 mb-3 sm:mb-4">
          <div className="flex justify-between items-center">
            <span className="text-[#6F4A4A]">Material:</span>
            <span className="font-semibold text-[#35191C] truncate max-w-[80px] sm:max-w-none">{product.material}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6F4A4A]">Weight:</span>
            <span className="font-semibold text-[#35191C]">{product.weight}</span>
          </div>
        </div>
      </div>

      {/* Pricing & Detail / Add to Cart / Buy Buttons */}
      <div>
        <div className="flex items-baseline justify-between gap-1 mb-2 sm:mb-3">
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="font-serif text-lg sm:text-2xl font-bold text-[#B82E44]">
              ₹{product.sellingPrice.toLocaleString("en-IN")}
            </span>
            {product.mrp && product.mrp > product.sellingPrice && (
              <span className="text-[9px] sm:text-xs text-[#6F4A4A]/60 line-through">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 py-1.5 sm:py-2.5 px-1.5 sm:px-3 rounded-xl text-[9px] sm:text-[11px] font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-0.5 ${
              justAdded
                ? "bg-[#2E7D32] text-white border-[#2E7D32] scale-95"
                : "bg-[#FFF0EA] hover:bg-[#FFE2D8] text-[#B82E44] border-[#E8CFC5] hover:border-[#B82E44]"
            }`}
          >
            <span>{justAdded ? "✓ Added" : "🛒 Cart"}</span>
          </button>

          {/* Buy Now Button (Triggers Razorpay Gateway Modal) */}
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
            className="flex-1 py-1.5 sm:py-2.5 px-1.5 sm:px-3 bg-[#B82E44] hover:bg-[#7C1B2A] text-[#FFF8F0] text-[9px] sm:text-[11px] font-bold uppercase tracking-wider rounded-xl shadow-xs active:scale-[0.98] transition-all text-center flex items-center justify-center gap-1"
          >
            <span>💳 Buy Now</span>
          </button>
        </div>
      </div>

      {/* Razorpay Checkout Modal (loaded on demand) */}
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
