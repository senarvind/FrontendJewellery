"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/frontend/types/product";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { IMAGE_PRESETS } from "@/lib/cloudinary";
import CheckoutModal, { CheckoutItem } from "@/components/checkout/CheckoutModal";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [showLoginToast, setShowLoginToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);
  const { addToCart } = useCart();

  const [ankletOption, setAnkletOption] = useState<"Single" | "Pair">("Single");

  const activePrice = product.category === "anklets"
    ? (ankletOption === "Single" ? (product.singlePrice || product.sellingPrice) : (product.pairPrice || product.sellingPrice * 2))
    : product.sellingPrice;

  const activeMrp = product.category === "anklets"
    ? (ankletOption === "Single" ? (product.mrp || product.sellingPrice) : (product.mrp ? product.mrp * 2 : product.sellingPrice * 2))
    : product.mrp;

  const checkoutItems: CheckoutItem[] = [
    {
      productId: product.id,
      productName: product.productType || product.description,
      category: product.category,
      quantity: quantity,
      price: activePrice,
    },
  ];

  const images = [
    { label: "Front View", src: product.frontImage || "/images/placeholder.jpg" },
    { label: "Back / Stamp View", src: product.backImage || product.frontImage || "/images/placeholder.jpg" },
    { label: "Model Wear View", src: product.modelImage || product.frontImage || "/images/placeholder.jpg" },
  ];

  const currentImage = images[activeImageIndex]?.src || product.frontImage;

  const discountPercent =
    activeMrp && activeMrp > activePrice
      ? Math.round(((activeMrp - activePrice) / activeMrp) * 100)
      : 0;

  const waMessage = encodeURIComponent(
    `Hello Keshar Jewellers, I want to BUY / order this item:
• Product: ${product.productType}
• Description: ${product.description}
• Material: ${product.material}
• Weight: ${product.weight}
• Dimensions: L:${product.dimensionL} x W:${product.dimensionW} x H:${product.dimensionH}
• Quantity: ${quantity}
• Total Price: ₹${(activePrice * quantity).toLocaleString("en-IN")}
• Item URL ID: ${product.id}`
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = () => {
    if (!user) {
      setToastMessage("Please login to add items to your cart.");
      setShowLoginToast(true);
      setTimeout(() => setShowLoginToast(false), 3000);
      return;
    }
    const cartProduct = { ...product };
    if (product.category === "anklets") {
      cartProduct.sellingPrice = activePrice;
      cartProduct.mrp = activeMrp;
      cartProduct.productType = `${product.productType} (${ankletOption})`;
    }
    addToCart(cartProduct, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Back & Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-3 bg-[#FFF0EA] border border-[#E8CFC5] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-xs flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFE2D8] text-[#7C1B2A] transition-all text-xs font-bold border border-[#E8CFC5] shadow-xs active:scale-95"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#9B1B30] hover:bg-[#7C1B2A] text-[#FFF8F0] transition-all text-xs font-bold shadow-xs active:scale-95"
            >
              <span>🏠</span> <span>Home</span>
            </Link>
          </div>

          <nav className="font-sans text-xs sm:text-sm text-[#5C3838] flex items-center gap-1.5 sm:gap-2 tracking-normal font-medium overflow-hidden">
            <Link href="/" className="hover:text-[#7C1B2A] transition-colors">Home</Link>
            <span className="text-[#C77D62]">/</span>
            <Link href={`/products/${product.category}`} className="capitalize hover:text-[#7C1B2A] transition-colors">
              {product.category}
            </Link>
            <span className="text-[#C77D62]">/</span>
            <span className="text-[#9B1B30] font-bold truncate max-w-[140px] sm:max-w-none">
              {product.productType}
            </span>
          </nav>
        </div>

        {/* Toast Notification for Add to Cart */}
        {mounted && addedToCart && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center sm:items-end sm:justify-end pointer-events-none sm:p-6 px-4">
            <div className="pointer-events-auto w-full max-w-[280px] sm:max-w-none sm:w-auto bg-[#7C1B2A] text-[#FFF8F0] p-5 sm:px-5 sm:py-4 rounded-3xl sm:rounded-2xl shadow-2xl border border-[#D4AF37]/50 flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 sm:gap-4 animate-bounce">
              <span className="text-4xl sm:text-2xl shrink-0">🛍️</span>
              <div className="flex-1 w-full">
                <p className="text-sm sm:text-xs font-bold text-[#E6C766]">Added to Bag!</p>
                <p className="text-[11px] sm:text-[11px] text-[#FFF8F0]/90 mt-1 sm:mt-0 line-clamp-2 sm:line-clamp-1">{product.productType} has been added to your cart.</p>
              </div>
              <Link
                href="/cart"
                className="w-full sm:w-auto sm:ml-1 px-4 py-2.5 sm:py-1.5 bg-[#E6C766] hover:bg-[#D4AF37] text-[#35191C] text-xs sm:text-[11px] font-bold rounded-xl transition-all whitespace-nowrap"
              >
                View Cart →
              </Link>
            </div>
          </div>,
          document.body
        )}

        {/* Main Product Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8CFC5] shadow-[0_15px_40px_rgba(124,27,42,0.06)] grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left Column: Gallery */}
          <div className="space-y-4">
            {/* Active Image Container */}
            <div className="relative w-full aspect-square rounded-2xl bg-[#FFF0EA] border border-[#E8CFC5] overflow-hidden group shadow-inner">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-[#7C1B2A] text-[#FFF8F0] text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-md">
                  {product.material}
                </span>
                {discountPercent > 0 && (
                  <span className="bg-[#D4AF37] text-[#35191C] text-xs font-bold px-2.5 py-0.5 rounded-md tracking-wider shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* View Label Badge */}
              <span className="absolute top-4 right-4 bg-[#35191C]/80 backdrop-blur-md text-[#E6C766] text-xs font-semibold px-3 py-1 rounded-lg border border-[#D4AF37]/40 z-10">
                {images[activeImageIndex].label}
              </span>

              {/* Displayed Image */}
              <Image
                src={IMAGE_PRESETS.productDetail(currentImage)}
                alt={`${product.productType} - ${images[activeImageIndex].label}`}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnail Images Selector (Front, Back, Model) */}
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-square rounded-xl border-2 overflow-hidden transition-all duration-300 p-1 bg-[#FFF0EA] ${
                    activeImageIndex === idx
                      ? "border-[#7C1B2A] ring-2 ring-[#7C1B2A]/20 scale-95 shadow-md"
                      : "border-[#E8CFC5] opacity-70 hover:opacity-100 hover:border-[#7C1B2A]"
                  }`}
                >
                  <Image
                    src={IMAGE_PRESETS.categoryIcon(img.src)}
                    alt={img.label}
                    fill
                    sizes="(max-width: 640px) 80px, 120px"
                    className="object-cover rounded-lg"
                  />
                  <span className="absolute bottom-1 left-1 right-1 bg-[#7C1B2A]/80 text-[#FFF8F0] text-[9px] font-bold text-center rounded py-0.5">
                    {idx === 0 ? "① Front" : idx === 1 ? "② Back" : "③ Model"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details & Purchase Actions */}
          <div className="flex flex-col justify-between space-y-6">

            <div className="space-y-4">
              {/* Product Header */}
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-block px-3 py-1 rounded-full font-sans text-xs font-bold tracking-wide uppercase bg-[#FFE2D8] text-[#9B1B30] border border-[#E8CFC5]">
                    {product.productType}
                  </span>
                  
                  {/* ❤️ Like / Wishlist Button */}
                  <button
                    onClick={() => {
                      if (!user) {
                        setToastMessage("Please login to add items to your wishlist.");
                        setShowLoginToast(true);
                        setTimeout(() => setShowLoginToast(false), 3000);
                        return;
                      }
                      setIsLiked(!isLiked);
                    }}
                    className={`p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                      isLiked
                        ? "bg-[#FDF2F2] border-[#F8B4B4] text-[#C81E1E] scale-110 shadow-sm"
                        : "bg-[#FFF0EA] border-[#E8CFC5] text-[#6F4A4A] hover:text-[#C81E1E] hover:border-[#F8B4B4]"
                    }`}
                    aria-label="Wishlist Item"
                    title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <svg
                      className="w-5 h-5 transition-transform active:scale-125"
                      fill={isLiked ? "currentColor" : "none"}
                      stroke="currentColor"
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
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-sans font-bold text-[#1F1517] leading-relaxed tracking-tight mt-2.5">
                  {product.description}
                </h1>
              </div>

              {/* Anklet Single/Pair Toggle */}
              {product.category === "anklets" && (
                <div className="flex items-center gap-3">
                  <span className="font-sans text-sm font-bold text-[#1F1517]">Select Type:</span>
                  <div className="flex p-1 bg-[#FFF0EA]/50 border border-[#E8CFC5] rounded-xl">
                    <button
                      onClick={() => setAnkletOption("Single")}
                      className={`px-4 py-1.5 rounded-lg font-sans text-sm font-bold transition-all cursor-pointer ${ankletOption === "Single" ? "bg-[#9B1B30] text-white shadow-md" : "text-[#5C3838] hover:bg-[#FFE2D8]"}`}
                    >
                      Single
                    </button>
                    <button
                      onClick={() => setAnkletOption("Pair")}
                      className={`px-4 py-1.5 rounded-lg font-sans text-sm font-bold transition-all cursor-pointer ${ankletOption === "Pair" ? "bg-[#9B1B30] text-white shadow-md" : "text-[#5C3838] hover:bg-[#FFE2D8]"}`}
                    >
                      Pair
                    </button>
                  </div>
                </div>
              )}

              {/* Price Section */}
              <div className="bg-[#FFF4EE] p-4 sm:p-5 rounded-2xl border border-[#E8CFC5] space-y-1.5 shadow-xs">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-sans font-black text-3xl sm:text-4xl text-[#9B1B30] tracking-tight">
                    ₹{activePrice.toLocaleString("en-IN")}
                  </span>
                  {activeMrp && activeMrp > activePrice && (
                    <span className="font-sans text-sm sm:text-base text-[#6F4A4A]/70 line-through font-medium">
                      ₹{activeMrp.toLocaleString("en-IN")} MRP
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="font-sans text-xs sm:text-sm font-bold text-[#1B5E20] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs text-[#5C3838] font-medium flex items-center gap-1.5">
                  <span className="text-[#C59B27]">✦</span> Inclusive of all taxes &amp; BIS Hallmarking Certification
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 py-1.5">
                <span className="font-sans text-sm font-bold text-[#1F1517]">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#E8CFC5] rounded-xl bg-white shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 font-sans text-sm font-bold text-[#9B1B30] hover:bg-[#FFE2D8] rounded-l-xl transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-sans text-sm font-bold text-[#1F1517]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 font-sans text-sm font-bold text-[#9B1B30] hover:bg-[#FFE2D8] rounded-r-xl transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="bg-[#FAF7F5] border border-[#E8CFC5] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#9B1B30] border-b border-[#E8CFC5]/80 pb-2">
                  Jewellery Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-2.5 rounded-xl border border-[#E8CFC5]/50">
                    <span className="text-xs text-[#705252] font-medium block mb-0.5">✨ Purity &amp; Material:</span>
                    <span className="font-sans font-bold text-[#1F1517]">{product.material || "92.5 Pure Silver"}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#E8CFC5]/50">
                    <span className="text-xs text-[#705252] font-medium block mb-0.5">⚖️ Approx Weight:</span>
                    <span className="font-sans font-bold text-[#1F1517]">{product.weight || "N/A"}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#E8CFC5]/50 sm:col-span-2">
                    <span className="text-xs text-[#705252] font-medium block mb-0.5">📏 Dimensions (L × W × H):</span>
                    <span className="font-sans font-bold text-[#1F1517]">
                      {product.dimensionL || "N/A"} × {product.dimensionW || "N/A"} × {product.dimensionH || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Buy Now Razorpay, Add to Cart & WhatsApp */}
            <div className="space-y-3 pt-2">
              {/* ⚡ Primary Buy Now via Razorpay */}
              <button
                onClick={() => {
                  if (!user) {
                    const redirectUrl = encodeURIComponent(`/products/details/${product.id}`);
                    const msg = encodeURIComponent("Please sign in to buy this product.");
                    router.push(`/login?redirect=${redirectUrl}&msg=${msg}`);
                    return;
                  }
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 sm:py-4 px-5 bg-[#9B1B30] hover:bg-[#7C1B2A] text-[#FFF8F0] font-sans font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="text-lg">💳</span>
                <span>Buy Now with Razorpay</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 🛒 Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 bg-[#FFF0EA] hover:bg-[#FFE2D8] text-[#9B1B30] font-sans font-bold text-sm rounded-xl border border-[#E8CFC5] active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="text-base">🛒</span>
                  <span>Add to Cart</span>
                </button>

                {/* 💬 WhatsApp Enquire Button */}
                <Link
                  href={`https://wa.me/919827415111?text=${waMessage}`}
                  target="_blank"
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-sans font-bold text-sm rounded-xl shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-base">💬</span>
                  <span>WhatsApp Enquire</span>
                </Link>
              </div>
            </div>

            {/* Hallmarking & Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E8CFC5]/80 text-center">
              <div className="p-2 space-y-1">
                <span className="text-xl block">👑</span>
                <p className="font-sans text-xs sm:text-sm font-bold text-[#7C1B2A]">100% BIS Hallmark</p>
                <p className="font-sans text-[11px] sm:text-xs text-[#5C3838]">HM/C-8290497727</p>
              </div>
              <div className="p-2 space-y-1 border-x border-[#E8CFC5]/80">
                <span className="text-xl block">🔄</span>
                <p className="font-sans text-xs sm:text-sm font-bold text-[#7C1B2A]">Lifetime Exchange</p>
                <p className="font-sans text-[11px] sm:text-xs text-[#5C3838]">Guaranteed Value</p>
              </div>
              <div className="p-2 space-y-1">
                <span className="text-xl block">🚚</span>
                <p className="font-sans text-xs sm:text-sm font-bold text-[#7C1B2A]">Free Shipping</p>
                <p className="font-sans text-[11px] sm:text-xs text-[#5C3838]">Safe &amp; Insured</p>
              </div>
            </div>

          </div>

        </div>

        {/* Razorpay Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={checkoutItems}
          totalAmount={product.sellingPrice * quantity}
        />

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
    </div>
  );
}
