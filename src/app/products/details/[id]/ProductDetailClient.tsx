"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/frontend/types/product";
import { useCart } from "@/context/CartContext";
import CheckoutModal, { CheckoutItem } from "@/components/checkout/CheckoutModal";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const { addToCart } = useCart();

  const checkoutItems: CheckoutItem[] = [
    {
      productId: product.id,
      productName: product.productType || product.description,
      category: product.category,
      quantity: quantity,
      price: product.sellingPrice,
    },
  ];

  const images = [
    { label: "Front View", src: product.frontImage || "/images/placeholder.jpg" },
    { label: "Back / Stamp View", src: product.backImage || product.frontImage || "/images/placeholder.jpg" },
    { label: "Model Wear View", src: product.modelImage || product.frontImage || "/images/placeholder.jpg" },
  ];

  const currentImage = images[activeImageIndex]?.src || product.frontImage;

  const discountPercent =
    product.mrp && product.mrp > product.sellingPrice
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0;

  const waMessage = encodeURIComponent(
    `Hello Keshar Jewellers, I want to BUY / order this item:
• Product: ${product.productType}
• Description: ${product.description}
• Material: ${product.material}
• Weight: ${product.weight}
• Dimensions: L:${product.dimensionL} x W:${product.dimensionW} x H:${product.dimensionH}
• Quantity: ${quantity}
• Total Price: ₹${(product.sellingPrice * quantity).toLocaleString("en-IN")}
• Item URL ID: ${product.id}`
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-[#6F4A4A] flex items-center gap-2 tracking-wide font-medium">
          <Link href="/" className="hover:text-[#7C1B2A] transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/products/${product.category}`} className="capitalize hover:text-[#7C1B2A] transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#7C1B2A] font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.productType}
          </span>
        </nav>

        {/* Toast Notification for Add to Cart */}
        {addedToCart && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#7C1B2A] text-[#FFF8F0] px-5 py-4 rounded-2xl shadow-2xl border border-[#D4AF37]/50 flex items-center gap-4 animate-bounce">
            <span className="text-2xl">🛍️</span>
            <div>
              <p className="text-xs font-bold text-[#E6C766]">Added to Bag!</p>
              <p className="text-[11px] text-[#FFF8F0]/90">{product.productType} has been added to your cart.</p>
            </div>
            <Link
              href="/cart"
              className="ml-2 px-3 py-1.5 bg-[#E6C766] hover:bg-[#D4AF37] text-[#35191C] text-[11px] font-bold rounded-xl transition-all"
            >
              View Cart →
            </Link>
          </div>
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
                src={currentImage}
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
                    src={img.src}
                    alt={img.label}
                    fill
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
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C77D62]">
                    {product.productType}
                  </span>
                  
                  {/* ❤️ Like / Wishlist Button */}
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
                      isLiked
                        ? "bg-[#FDF2F2] border-[#F8B4B4] text-[#C81E1E] scale-110 shadow-sm"
                        : "bg-[#FFF0EA] border-[#E8CFC5] text-[#6F4A4A] hover:text-[#C81E1E] hover:border-[#F8B4B4]"
                    }`}
                    aria-label="Wishlist Item"
                    title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <svg
                      className="w-6 h-6 transition-transform active:scale-125"
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

                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#35191C] leading-snug mt-1">
                  {product.description}
                </h1>
              </div>

              {/* Price Section */}
              <div className="bg-[#FFF0EA]/70 p-4 sm:p-5 rounded-2xl border border-[#E8CFC5] space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#7C1B2A]">
                    ₹{product.sellingPrice.toLocaleString("en-IN")}
                  </span>
                  {product.mrp && product.mrp > product.sellingPrice && (
                    <span className="text-base text-[#6F4A4A]/60 line-through">
                      ₹{product.mrp.toLocaleString("en-IN")} MRP
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6F4A4A] font-light">
                  ✦ Inclusive of all taxes & BIS Hallmarking Certification
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#35191C]">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#E8CFC5] rounded-xl bg-[#FFF0EA]/40">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-sm font-bold text-[#7C1B2A] hover:bg-[#FFE2D8] rounded-l-xl transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold text-[#35191C]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-sm font-bold text-[#7C1B2A] hover:bg-[#FFE2D8] rounded-r-xl transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="bg-white border border-[#E8CFC5] rounded-2xl p-4 space-y-2 text-xs">
                <h3 className="font-bold text-[#7C1B2A] uppercase tracking-wider border-b border-[#E8CFC5]/60 pb-1.5">
                  Jewellery Specifications
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[#35191C]">
                  <div>
                    <span className="text-[#6F4A4A] block">Purity & Material:</span>
                    <span className="font-semibold">{product.material}</span>
                  </div>
                  <div>
                    <span className="text-[#6F4A4A] block">Approx Weight:</span>
                    <span className="font-semibold">{product.weight}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#6F4A4A] block">Dimensions (L x W x H):</span>
                    <span className="font-semibold">
                      {product.dimensionL || "N/A"} x {product.dimensionW || "N/A"} x {product.dimensionH || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Buy Now Razorpay, Add to Cart & WhatsApp */}
            <div className="space-y-3 pt-2">
              {/* ⚡ Primary Buy Now via Razorpay */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-4 px-5 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="text-base">💳</span>
                <span>Buy Now with Razorpay (Online Payment)</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 🛒 Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 bg-[#FFF0EA] hover:bg-[#FFE2D8] text-[#7C1B2A] font-bold text-xs uppercase tracking-wider rounded-xl border border-[#E8CFC5] active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <span className="text-base">🛒</span>
                  <span>Add to Cart</span>
                </button>

                {/* 💬 WhatsApp Enquire Button */}
                <Link
                  href={`https://wa.me/919827415111?text=${waMessage}`}
                  target="_blank"
                  className="w-full py-3 px-4 bg-[#FFF0EA] hover:bg-[#FFE2D8] text-[#7C1B2A] font-bold text-xs uppercase tracking-wider rounded-xl border border-[#E8CFC5] active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <span className="text-base">💬</span>
                  <span>WhatsApp Enquire</span>
                </Link>
              </div>
            </div>

            {/* Hallmarking & Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E8CFC5]/60 text-center">
              <div className="p-2 space-y-1">
                <span className="text-lg block">👑</span>
                <p className="text-[10px] font-bold text-[#7C1B2A] uppercase tracking-wider">100% BIS Hallmark</p>
                <p className="text-[9px] text-[#6F4A4A]">HM/C-8290497727</p>
              </div>
              <div className="p-2 space-y-1 border-x border-[#E8CFC5]/60">
                <span className="text-lg block">🔄</span>
                <p className="text-[10px] font-bold text-[#7C1B2A] uppercase tracking-wider">Lifetime Exchange</p>
                <p className="text-[9px] text-[#6F4A4A]">Guaranteed Value</p>
              </div>
              <div className="p-2 space-y-1">
                <span className="text-lg block">🚚</span>
                <p className="text-[10px] font-bold text-[#7C1B2A] uppercase tracking-wider">Free Shipping</p>
                <p className="text-[9px] text-[#6F4A4A]">Safe & Insured</p>
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

      </div>
    </div>
  );
}
