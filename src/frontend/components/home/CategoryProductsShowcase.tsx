"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product, STORE_CATEGORIES } from "@/frontend/types/product";
import ProductCard from "@/frontend/components/products/ProductCard";
import { getAllProducts } from "@/lib/api";

export default function CategoryProductsShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const data = await getAllProducts();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load products for home page showcase:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Filter products based on selected tab
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "all") return true;
    const cat = (p.category || "").toLowerCase().trim();
    const target = selectedCategory.toLowerCase().trim();
    const normalizedCat = cat.replace(/[^a-z0-9]/g, "");
    const normalizedTarget = target.replace(/[^a-z0-9]/g, "");
    return (
      cat === target ||
      normalizedCat.includes(normalizedTarget) ||
      normalizedTarget.includes(normalizedCat)
    );
  });

  // Calculate product counts per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const p of products) {
      const cat = (p.category || "").toLowerCase().trim();
      const slug = cat.replace(/\s+/g, "-");
      counts[slug] = (counts[slug] || 0) + 1;
    }
    return counts;
  }, [products]);

  // Featured top categories for tabs
  const topTabs = [
    { slug: "all", name: "All Products" },
    { slug: "rings", name: "Rings" },
    { slug: "necklaces", name: "Necklaces" },
    { slug: "earrings", name: "Earrings" },
    { slug: "bangles", name: "Bangles" },
    { slug: "nose-pins", name: "Nose Pins" },
    { slug: "pendants", name: "Pendants" },
    { slug: "mangalsutra", name: "Mangalsutra" },
    { slug: "bracelets", name: "Bracelets" },
    { slug: "chains", name: "Chains" },
  ];

  return (
    <section className="py-10 sm:py-16 px-3 sm:px-8 lg:px-12 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <span className="text-[#C77D62] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-xs font-bold block mb-1.5 sm:mb-2">
            ✦ Authentic Hallmark Jewellery ✦
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#9B1B30] tracking-tight mb-2 sm:mb-3">
            Shop By Category
          </h2>
          <div className="flex items-center justify-center gap-3 my-2 text-[#D4AF37]/60 w-36 sm:w-48 mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
            <span className="text-[10px] sm:text-xs font-serif text-[#A77C18]">❖</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
          </div>
          <p className="font-light text-[#6F4A4A] text-xs sm:text-base leading-relaxed">
            Browse our latest handcrafted gold and sterling silver collections directly from our workshop.
          </p>
        </div>

        {/* Category Tabs Scrollbar */}
        <div className="overflow-x-auto scrollbar-none flex items-center justify-start sm:justify-center gap-2 pb-3 mb-8 sm:mb-12">
          {topTabs.map((tab) => {
            const count = categoryCounts[tab.slug] ?? 0;
            const isSelected = selectedCategory === tab.slug;
            return (
              <button
                key={tab.slug}
                onClick={() => setSelectedCategory(tab.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? "bg-[#B82E44] text-[#FFF8F0] border-[#B82E44] shadow-md scale-105"
                    : "bg-[#FFF0EA] text-[#35191C] border-[#E8CFC5] hover:border-[#B82E44] hover:bg-[#FFE2D8]"
                }`}
              >
                <span>{tab.name}</span>
                {count > 0 && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? "bg-[#7C1B2A] text-white"
                        : "bg-[#E8CFC5] text-[#7C1B2A]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#B82E44] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-[#6F4A4A] font-medium">Loading Keshar Jewellers catalog...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div>
            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {filteredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* View Full Collection Button */}
            <div className="text-center mt-8 sm:mt-12">
              <Link
                href={selectedCategory === "all" ? "/products/all" : `/products/${selectedCategory}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#7C1B2A] hover:bg-[#B82E44] text-[#FFF8F0] rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:scale-105"
              >
                <span>
                  Explore All {selectedCategory === "all" ? "Products" : selectedCategory.replace(/-/g, " ")} ({filteredProducts.length})
                </span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Empty Category State */
          <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF0EA] border border-[#D4AF37]/40 flex items-center justify-center text-xl mb-3">
              💎
            </div>
            <h3 className="font-serif text-lg sm:text-xl text-[#9B1B30] mb-2 font-bold">
              No products found in this category yet
            </h3>
            <p className="text-xs text-[#6F4A4A] mb-6">
              New handcrafted items are created regularly by our master artisans. Custom designs are available on order.
            </p>
            <Link
              href="https://wa.me/919827415111?text=Hello%20Keshar%20Jewellers,%20I%20am%20looking%20for%20custom%20jewellery%20designs."
              target="_blank"
              className="inline-block px-5 py-2.5 bg-[#B82E44] text-[#FFF8F0] rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#7C1B2A] transition-colors"
            >
              Enquire on WhatsApp
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
