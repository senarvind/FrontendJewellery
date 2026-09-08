"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal, totalItemsCount } = useCart();

  // Create WhatsApp checkout message with all items in cart
  const waCartMessage = encodeURIComponent(
    `Hello Keshar Jewellers, I would like to place an order for the following items in my cart:\n\n` +
      cartItems
        .map(
          (item, idx) =>
            `${idx + 1}. *${item.product.productType}* (${item.product.material})\n` +
            `   • Description: ${item.product.description}\n` +
            `   • Weight: ${item.product.weight}\n` +
            `   • Quantity: ${item.quantity}\n` +
            `   • Unit Price: ₹${(item.product.sellingPrice || 0).toLocaleString("en-IN")}\n` +
            `   • Item Total: ₹${((item.product.sellingPrice || 0) * item.quantity).toLocaleString("en-IN")}\n`
        )
        .join("\n") +
      `--------------------------------\n` +
      `*Total Items:* ${totalItemsCount}\n` +
      `*Grand Total Amount:* ₹${subtotal.toLocaleString("en-IN")}\n\n` +
      `Please confirm availability and billing/delivery details.`
  );

  return (
    <main className="min-h-screen bg-[#FFF8F0] text-[#35191C] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-[#6F4A4A] flex items-center gap-2 tracking-wide font-medium">
          <Link href="/" className="hover:text-[#7C1B2A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#7C1B2A] font-semibold">Shopping Bag ({totalItemsCount})</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-[#E8CFC5] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C77D62] block mb-1">
              ✦ BIS Hallmarked Fine Jewellery ✦
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#7C1B2A] font-bold">
              Your Shopping Bag
            </h1>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-[#B82E44] hover:text-[#7C1B2A] underline underline-offset-4 transition-colors self-start sm:self-auto"
            >
              Clear Entire Cart
            </button>
          )}
        </div>

        {/* Cart Contents */}
        {cartItems.length === 0 ? (
          /* Empty Cart View */
          <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto shadow-sm my-8 space-y-5">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#FFF0EA] border border-[#D4AF37]/40 flex items-center justify-center text-3xl shadow-inner">
              🛍️
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#7C1B2A] font-bold">
                Your Bag is Currently Empty
              </h2>
              <p className="text-sm text-[#6F4A4A] leading-relaxed max-w-md mx-auto">
                Explore our exquisite 22K Gold, 92.5 Sterling Silver, and Natural Gemstone collections handcrafted with hallmarked perfection.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 py-3 px-8 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                <span>Explore Collections</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Items & Summary Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const product = item.product;
                const unitPrice = product.sellingPrice || 0;
                const itemTotal = unitPrice * item.quantity;
                const frontImage = product.frontImage || "/images/placeholder.jpg";

                return (
                  <div
                    key={product.id}
                    className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center relative"
                  >
                    {/* Item Image */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#FFF0EA] border border-[#E8CFC5] overflow-hidden flex-shrink-0">
                      <Image
                        src={frontImage}
                        alt={product.productType || "Product Image"}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-[#7C1B2A] text-[#FFF8F0] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                        {product.material}
                      </span>
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 space-y-1.5 w-full">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C77D62]">
                            {product.productType}
                          </span>
                          <Link
                            href={`/products/details/${product.id}`}
                            className="font-serif text-base sm:text-lg font-bold text-[#35191C] hover:text-[#7C1B2A] transition-colors block line-clamp-1"
                          >
                            {product.description}
                          </Link>
                        </div>

                        {/* Remove Button (Mobile & Desktop) */}
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-[#6F4A4A] hover:text-[#B82E44] p-1 transition-colors"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Specs */}
                      <div className="text-xs text-[#6F4A4A] flex flex-wrap gap-x-4 gap-y-1">
                        <span>Weight: <strong className="text-[#35191C]">{product.weight || "N/A"}</strong></span>
                        {product.dimensionL && (
                          <span>Dim: <strong className="text-[#35191C]">{product.dimensionL}x{product.dimensionW}x{product.dimensionH}</strong></span>
                        )}
                      </div>

                      {/* Pricing & Quantity Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#E8CFC5]/50 mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#6F4A4A] uppercase">Qty:</span>
                          <div className="flex items-center border border-[#E8CFC5] rounded-lg bg-[#FFF0EA]/60">
                            <button
                              onClick={() => updateQuantity(product.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-xs font-bold text-[#7C1B2A] hover:bg-[#FFE2D8] rounded-l-lg transition-colors"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-semibold text-[#35191C]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-xs font-bold text-[#7C1B2A] hover:bg-[#FFE2D8] rounded-r-lg transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="font-serif text-lg font-bold text-[#7C1B2A]">
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[10px] text-[#6F4A4A]">
                              (₹{unitPrice.toLocaleString("en-IN")} each)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Order Summary Box */}
            <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-6 shadow-md space-y-6 lg:sticky lg:top-24">
              <h2 className="font-serif text-xl font-bold text-[#7C1B2A] border-b border-[#E8CFC5] pb-3 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-sans font-normal text-[#6F4A4A]">({totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"})</span>
              </h2>

              {/* Price Details */}
              <div className="space-y-3 text-xs text-[#35191C]">
                <div className="flex justify-between">
                  <span className="text-[#6F4A4A]">Subtotal</span>
                  <span className="font-semibold text-sm">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F4A4A]">BIS Hallmarking & Insurance</span>
                  <span className="font-bold text-[#2E7D32]">FREE / Included</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F4A4A]">Insured Express Shipping</span>
                  <span className="font-bold text-[#2E7D32]">FREE</span>
                </div>

                <div className="border-t border-[#E8CFC5] pt-3 flex justify-between items-baseline">
                  <span className="font-serif text-base font-bold text-[#7C1B2A]">Total Amount</span>
                  <span className="font-serif text-2xl font-bold text-[#7C1B2A]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[10px] text-[#6F4A4A] italic text-right">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  href={`https://wa.me/919827415111?text=${waCartMessage}`}
                  target="_blank"
                  className="w-full py-3.5 px-5 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-center"
                >
                  <span className="text-base">💬</span>
                  <span>Proceed to WhatsApp Checkout</span>
                </Link>

                <Link
                  href="/"
                  className="w-full py-2.5 px-4 bg-[#FFF0EA] hover:bg-[#FFE2D8] text-[#7C1B2A] font-bold text-xs uppercase tracking-wider rounded-xl border border-[#E8CFC5] transition-all flex items-center justify-center gap-1.5 text-center"
                >
                  <span>← Continue Shopping</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="border-t border-[#E8CFC5]/70 pt-4 space-y-2 text-[11px] text-[#6F4A4A]">
                <div className="flex items-center gap-2">
                  <span>👑</span>
                  <span>100% BIS Hallmarked Certified Jewellery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔄</span>
                  <span>Lifetime Exchange & Transparency Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🚚</span>
                  <span>Free Insured Delivery Across India</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}
