"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/frontend/components/products/ProductCard";

export default function WishlistPage() {
  const { wishlistItems, clearWishlist, wishlistCount } = useWishlist();

  return (
    <main className="min-h-screen bg-[#FFF8F0] text-[#35191C] p-4 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-[#B82E44]">
          <Link href="/" className="hover:underline transition-all">Home</Link>
          <span className="text-[#6F4A4A]/40">/</span>
          <span className="text-[#35191C] font-bold">Wishlist</span>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[#C77D62] uppercase tracking-[0.25em] text-xs font-bold block mb-2">
            ✦ BIS 91.6 GOLD & 92.5 STERLING HALLMARK CERTIFIED ✦
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#9B1B30] tracking-tight mb-3">
            My Saved Wishlist 💖
          </h1>
          <div className="flex items-center justify-center gap-3 my-3 text-[#D4AF37]/60 w-48 mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
            <span className="text-xs font-serif text-[#A77C18]">❖</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
          </div>
          <p className="font-light text-[#6F4A4A] text-sm sm:text-base leading-relaxed">
            Your personalized selection of handcrafted 22K Gold, 92.5 Sterling Silver, and Natural Gemstone jewellery saved for easy access.
          </p>
        </div>

        {/* Header Action Bar */}
        {wishlistCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FFFDFC] border border-[#E8CFC5] rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#FFE2D8] border border-[#E8CFC5] flex items-center justify-center text-xl">
                💖
              </span>
              <div>
                <h3 className="font-bold text-[#35191C] text-sm sm:text-base">
                  {wishlistCount} Saved {wishlistCount === 1 ? "Item" : "Items"}
                </h3>
                <p className="text-xs text-[#6F4A4A]">Saved to your account &amp; database</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearWishlist}
                className="px-4 py-2 text-xs font-semibold text-[#9B1C1C] hover:text-white bg-[#FDF2F2] hover:bg-[#9B1C1C] border border-[#F8B4B4] rounded-xl transition-all"
              >
                Clear All Wishlist
              </button>
              <Link
                href="/"
                className="px-5 py-2 text-xs font-semibold text-[#FFF8F0] bg-[#B82E44] hover:bg-[#7C1B2A] rounded-xl transition-all uppercase tracking-wider"
              >
                + Add More Items
              </Link>
            </div>
          </div>
        )}

        {/* Wishlist Grid */}
        {wishlistCount > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto shadow-sm my-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#FFE2D8] border border-[#D4AF37]/40 flex items-center justify-center text-3xl mb-4 animate-bounce">
              💖
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#9B1B30] mb-2">
              Your Wishlist is Empty
            </h3>
            <p className="text-sm text-[#6F4A4A] mb-8 leading-relaxed max-w-md mx-auto">
              Explore our exquisite collection of Hallmark Gold, Sterling Silver, and Natural Gemstones. Click the heart icon on any jewellery piece to save it here!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="px-8 py-3 bg-[#B82E44] hover:bg-[#7C1B2A] text-[#FFF8F0] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:scale-105"
              >
                Explore Catalogue
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
