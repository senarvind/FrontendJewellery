"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/data/categories";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/frontend/types/product";
import { SAMPLE_PRODUCTS } from "@/lib/api";

const CATEGORY_NAV_ITEMS = CATEGORIES.map(({ name, href }) => ({ name, href }));

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpenMobile, setIsCategoryOpenMobile] = useState(false);
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();

  // Product Live Search Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch all products for live search filter
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (data.products && Array.isArray(data.products)) {
            setAllProducts(data.products);
            return;
          }
        }
      } catch (e) {
        console.warn("Live search product fetch note:", e);
      }
      setAllProducts(SAMPLE_PRODUCTS);
    };

    fetchProducts();
  }, []);

  // Filter products when user types in search input
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredProducts([]);
      setIsSearchOpen(false);
      return;
    }

    const pool = allProducts.length > 0 ? allProducts : SAMPLE_PRODUCTS;
    const matches = pool.filter((p) => {
      const pType = (p.productType || "").toLowerCase();
      const pCat = (p.category || "").toLowerCase();
      const pMat = (p.material || "").toLowerCase();
      const pDesc = (p.description || "").toLowerCase();
      return (
        pType.includes(q) ||
        pCat.includes(q) ||
        pMat.includes(q) ||
        pDesc.includes(q)
      );
    });

    setFilteredProducts(matches);
    setIsSearchOpen(true);
  }, [searchQuery, allProducts]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full sticky top-0 z-50 flex flex-col shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-[#7C1B2A] text-[#E6C766] py-1.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-medium tracking-wider h-[36px]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/100063885402562/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            <a href="https://www.instagram.com/keshar_jewellers/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>

          {/* Core Brand USPs */}
          <div className="hidden sm:flex items-center space-x-6 text-[11px] uppercase tracking-[0.2em]">
            <span>✨ 100% Hallmarked Jewellery</span>
            <span>•</span>
            <span>Lifetime Exchange</span>
            <span>•</span>
            <span>Free Shipping</span>
            <span>•</span>
            <span>Secure Payments</span>
          </div>

          {/* Direct Phone / Contact */}
          <a href="tel:+919827415111" className="text-[11px] tracking-wider text-[#FFC7B8] hover:text-white transition-colors">
            📞 +91 98274 15111
          </a>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-[#FFF8F0] text-[#35191C] py-3 px-4 sm:px-6 lg:px-8 border-b border-[#E8CFC5] relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Area */}
          <div className="flex items-center gap-1">
            <Link href="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
              <Image
                src="/logo-old.png"
                alt="Keshar Jewellers Logo"
                width={50}
                height={50}
                priority
                className="w-10 h-10 object-contain mr-2 filter drop-shadow-[0_2px_4px_rgba(122,16,33,0.15)]"
              />
              <span className="font-serif text-xl sm:text-2xl font-medium tracking-wider uppercase text-[#B82E44]">
                Keshar <span className="text-[#D4AF37] font-serif italic">Jewellers</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[15px] font-medium">
            <Link href="/" className="border-b-2 border-[#D4AF37] pb-1 text-[#B82E44]">Home</Link>
            
            {/* Interactive Shop By Category Dropdown */}
            <div className="group relative flex items-center gap-1 cursor-pointer py-2 text-[#35191C] hover:text-[#B82E44] transition-colors">
              <span>Shop By Category</span>
              <svg className="w-3.5 h-3.5 text-[#6F4A4A] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>

              {/* Dropdown Menu Container */}
              <div className="absolute top-full left-0 hidden group-hover:block w-[480px] bg-[#FFF8F0] border border-[#E8CFC5] rounded-2xl shadow-[0_15px_40px_rgba(72,12,20,0.12)] p-5 z-50 transition-all duration-300">
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#C77D62] font-bold mb-3 pb-2 border-b border-[#E8CFC5]/60 flex items-center justify-between">
                  <span>Explore All Categories</span>
                  <span className="text-[#D4AF37]">✦ Fine Jewellery ✦</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {CATEGORY_NAV_ITEMS.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] transition-all group/link"
                    >
                      <span className="text-[#D4AF37] group-hover/link:translate-x-1 transition-transform">✦</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/products/new-arrival" className="hover:text-[#B82E44] transition-colors text-[#35191C]">New Arrival</Link>
            <Link href="/products/bestsellers" className="hover:text-[#B82E44] transition-colors text-[#35191C]">Bestsellers</Link>
            {/* Interactive Info Dropdown */}
            <div className="group relative flex items-center gap-1 cursor-pointer py-2 text-[#35191C] hover:text-[#B82E44] transition-colors">
              <Link href="/info" className="flex items-center gap-1">
                <span>Info</span>
                <svg className="w-3.5 h-3.5 text-[#6F4A4A] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </Link>

              {/* Info Dropdown Menu Container */}
              <div className="absolute top-full left-0 hidden group-hover:block w-64 bg-[#FFF8F0] border border-[#E8CFC5] rounded-2xl shadow-[0_15px_40px_rgba(72,12,20,0.12)] p-3 z-50 transition-all duration-300">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#C77D62] font-bold mb-2 pb-1.5 border-b border-[#E8CFC5]/60 flex items-center justify-between">
                  <span>Store Information</span>
                  <span className="text-[#D4AF37]">✦ Est. 2003 ✦</span>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <Link href="/info#story" className="px-3 py-2 rounded-xl text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] transition-all flex items-center gap-2">
                    <span>🏛️</span> <span>About &amp; Store Heritage</span>
                  </Link>
                  <Link href="/info#location" className="px-3 py-2 rounded-xl text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] transition-all flex items-center gap-2">
                    <span>📍</span> <span>Showroom Location &amp; Hours</span>
                  </Link>
                  <Link href="/info#purity" className="px-3 py-2 rounded-xl text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] transition-all flex items-center gap-2">
                    <span>✨</span> <span>Gold Purity &amp; Hallmark</span>
                  </Link>
                  <Link href="/info#custom" className="px-3 py-2 rounded-xl text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] transition-all flex items-center gap-2">
                    <span>👑</span> <span>Custom Jewellery Orders</span>
                  </Link>
                  <Link href="/info#faq" className="px-3 py-2 rounded-xl text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] transition-all flex items-center gap-2 border-t border-[#E8CFC5]/60 pt-2 mt-1">
                    <span>❓</span> <span>Store FAQs</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Interactive Our Policy Dropdown */}
            <div className="group relative flex items-center gap-1 cursor-pointer py-2 text-[#35191C] hover:text-[#B82E44] transition-colors">
              <Link href="/policies" className="flex items-center gap-1">
                <span>Our Policy</span>
                <svg className="w-3.5 h-3.5 text-[#6F4A4A] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </Link>

              {/* Policy Dropdown Menu Container */}
              <div className="absolute top-full left-0 hidden group-hover:block w-72 bg-[#FFF8F0] border border-[#E8CFC5] rounded-2xl shadow-[0_15px_40px_rgba(72,12,20,0.12)] p-3 z-50 transition-all duration-300">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#C77D62] font-bold mb-2 pb-1.5 border-b border-[#E8CFC5]/60 flex items-center justify-between">
                  <span>Store Guidelines</span>
                  <span className="text-[#D4AF37]">✦ BIS Certified ✦</span>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <Link href="/policies#hallmark" className="px-3 py-2 rounded-xl text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] transition-all flex items-center gap-2">
                    <span>🛡️</span> <span>BIS Hallmark Purity</span>
                  </Link>
                  <Link href="/policies#exchange" className="px-3 py-2 rounded-xl text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] transition-all flex items-center gap-2">
                    <span>🔄</span> <span>Lifetime Exchange</span>
                  </Link>
                  <Link href="/policies#shipping" className="px-3 py-2 rounded-xl text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] transition-all flex items-center gap-2">
                    <span>📦</span> <span>Insured Shipping</span>
                  </Link>
                  <Link href="/policies#returns" className="px-3 py-2 rounded-xl text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] transition-all flex items-center gap-2">
                    <span>🔁</span> <span>7-Day Easy Returns</span>
                  </Link>
                  <Link href="/policies#privacy" className="px-3 py-2 rounded-xl text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] transition-all flex items-center gap-2">
                    <span>🔒</span> <span>Privacy &amp; Security</span>
                  </Link>
                  <Link href="/policies#terms" className="px-3 py-2 rounded-xl text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] transition-all flex items-center gap-2 border-t border-[#E8CFC5]/60 pt-2 mt-1">
                    <span>📜</span> <span>Terms &amp; Store Rules</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Search & Icons */}
          <div className="flex items-center space-x-4 xl:space-x-5">
            
            {/* Search Bar with Live Product Filter Dropdown */}
            <div ref={searchRef} className="hidden md:flex relative items-center">
              <input 
                type="text" 
                placeholder="Search Gold, Silver, Rings..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
                suppressHydrationWarning
                className="pl-4 pr-10 py-1.5 rounded-full border border-[#E8CFC5] bg-[#FFFDFC] focus:outline-none focus:border-[#B82E44] focus:ring-1 focus:ring-[#B82E44] text-sm w-48 xl:w-64 text-[#35191C] placeholder-[#6F4A4A]/60 shadow-inner"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); setIsSearchOpen(false); }}
                  className="absolute right-3 text-[#6F4A4A] hover:text-[#B82E44] text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full bg-[#FFE2D8]"
                >
                  ✕
                </button>
              ) : (
                <button type="button" suppressHydrationWarning className="absolute right-3 text-[#B82E44] hover:text-[#7C1B2A]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
              )}

              {/* Floating Filtered Product Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full mt-2 right-0 w-80 sm:w-96 bg-[#FFF8F0] border border-[#E8CFC5] rounded-2xl shadow-[0_20px_50px_rgba(72,12,20,0.18)] z-50 overflow-hidden max-h-96 overflow-y-auto">
                  <div className="px-4 py-2.5 bg-[#FFF0EA] border-b border-[#E8CFC5] text-xs font-bold text-[#7C1B2A] flex justify-between items-center">
                    <span>Matching Products ({filteredProducts.length})</span>
                    <button onClick={() => setIsSearchOpen(false)} className="text-[#6F4A4A] hover:text-[#B82E44] text-xs font-bold">✕</button>
                  </div>

                  {filteredProducts.length > 0 ? (
                    <div className="divide-y divide-[#E8CFC5]/40">
                      {filteredProducts.slice(0, 8).map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/details/${product.id}`}
                          onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                          className="flex items-center gap-3 p-3 hover:bg-[#FFF0EA] transition-colors group/item"
                        >
                          <div className="w-12 h-12 rounded-lg bg-[#FFE2D8] border border-[#E8CFC5] overflow-hidden flex-shrink-0 relative">
                            <Image
                              src={product.frontImage || "/images/categories/ring.png"}
                              alt={product.productType}
                              fill
                              className="object-cover group-hover/item:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#35191C] truncate group-hover/item:text-[#B82E44]">
                              {product.productType}
                            </p>
                            <p className="text-[10px] text-[#6F4A4A] capitalize truncate">
                              {product.material} • {product.category}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-bold text-[#9B1B30]">
                              ₹{product.sellingPrice?.toLocaleString("en-IN")}
                            </p>
                            {product.mrp > product.sellingPrice && (
                              <p className="text-[10px] text-[#6F4A4A] line-through">
                                ₹{product.mrp?.toLocaleString("en-IN")}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-[#6F4A4A]">
                      <p className="font-semibold mb-1 text-[#9B1B30]">No matching products found</p>
                      <p className="text-[11px] text-[#6F4A4A]/80">Try searching for "ring", "gold", "silver", "jhumka"...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* User Account / Profile Dropdown */}
              <div className="relative">
                {user ? (
                  <div className="relative group">
                    <Link
                      href="/profile"
                      className="flex items-center gap-1.5 text-[#B82E44] hover:text-[#7C1B2A] bg-[#FFE2D8] py-1 px-2.5 rounded-lg border border-[#E8CFC5] transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#7C1B2A] text-[#FFF8F0] text-[10px] font-bold flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                    </Link>

                    {/* User Menu Dropdown */}
                    <div className="absolute right-0 top-full hidden group-hover:block w-48 bg-[#FFF8F0] border border-[#E8CFC5] rounded-xl shadow-lg p-2 z-50 mt-1">
                      <div className="px-3 py-2 border-b border-[#E8CFC5]/60 mb-1">
                        <p className="text-xs font-bold text-[#7C1B2A] truncate">{user.name}</p>
                        <p className="text-[10px] text-[#6F4A4A] truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-3 py-1.5 text-xs text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] rounded-lg transition-colors font-medium mb-1"
                      >
                        👤 My Profile
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="block px-3 py-1.5 text-xs text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] rounded-lg transition-colors font-medium mb-1"
                        >
                          👑 Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-1.5 text-xs text-[#9B1C1C] hover:bg-[#FDF2F2] rounded-lg transition-colors font-medium"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-[#B82E44] hover:text-[#7C1B2A] transition-colors flex items-center gap-1 bg-[#FFE2D8] py-1.5 px-3 rounded-lg border border-[#E8CFC5]"
                    aria-label="Account Login"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="text-xs font-semibold">Login</span>
                  </Link>
                )}
              </div>
              <Link
                href="/wishlist"
                className="text-[#B82E44] hover:text-[#7C1B2A] transition-all relative bg-[#FFE2D8] hover:bg-[#FFD6C9] p-2.5 rounded-lg border border-[#E8CFC5] hover:scale-105 active:scale-95 flex items-center justify-center"
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <svg className="w-5 h-5" fill={wishlistCount > 0 ? "#B82E44" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span className={`absolute -top-2 -right-2 bg-[#B82E44] text-[#FFF8F0] text-[10px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center border border-[#FFF8F0] shadow-sm transition-transform ${wishlistCount > 0 ? "scale-110" : ""}`}>
                  {wishlistCount}
                </span>
              </Link>
              <Link
                href="/cart"
                className="text-[#B82E44] hover:text-[#7C1B2A] transition-all relative bg-[#FFE2D8] hover:bg-[#FFD6C9] p-2.5 rounded-lg border border-[#E8CFC5] hover:scale-105 active:scale-95 flex items-center justify-center"
                aria-label={`Shopping Cart with ${totalItemsCount} items`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span className={`absolute -top-2 -right-2 bg-[#B82E44] text-[#FFF8F0] text-[10px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center border border-[#FFF8F0] shadow-sm transition-transform ${totalItemsCount > 0 ? "scale-110 animate-pulse" : ""}`}>
                  {totalItemsCount}
                </span>
              </Link>
            </div>
            
            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-[#B82E44] p-1"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#FFF8F0] border-t border-[#E8CFC5] px-4 py-6 mt-3 space-y-4 rounded-b-2xl shadow-xl">
            {/* Mobile Search Input */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search Gold, Silver, Rings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                suppressHydrationWarning
                className="w-full pl-4 pr-10 py-2 rounded-full border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] focus:outline-none focus:border-[#B82E44]"
              />
              {searchQuery && (
                <div className="mt-2 bg-[#FFF8F0] border border-[#E8CFC5] rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-[#E8CFC5]/40">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.slice(0, 5).map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/details/${p.id}`}
                        onClick={() => { setIsMobileMenuOpen(false); setSearchQuery(""); }}
                        className="flex items-center gap-2 p-2 hover:bg-[#FFF0EA]"
                      >
                        <div className="w-10 h-10 rounded bg-[#FFE2D8] relative overflow-hidden flex-shrink-0">
                          <Image src={p.frontImage || "/images/categories/ring.png"} alt={p.productType} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#35191C] truncate">{p.productType}</p>
                          <p className="text-[10px] text-[#6F4A4A]">₹{p.sellingPrice?.toLocaleString("en-IN")}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="p-3 text-xs text-center text-[#6F4A4A]">No products found</p>
                  )}
                </div>
              )}
            </div>

            <Link href="/" className="block text-base font-semibold text-[#B82E44]">Home</Link>
            
            {/* Mobile Categories Accordion */}
            <div>
              <button 
                onClick={() => setIsCategoryOpenMobile(!isCategoryOpenMobile)}
                className="w-full flex items-center justify-between text-base font-semibold text-[#35191C] py-1"
              >
                <span>Shop By Category</span>
                <span className="text-[#B82E44] font-mono">{isCategoryOpenMobile ? "-" : "+"}</span>
              </button>
              {isCategoryOpenMobile && (
                <div className="grid grid-cols-2 gap-2 pl-3 pt-3 mt-2 border-l-2 border-[#D4AF37]/50">
                  {CATEGORY_NAV_ITEMS.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xs text-[#35191C]/90 hover:text-[#B82E44] py-1 flex items-center gap-1"
                    >
                      <span className="text-[#D4AF37]">✦</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/products/new-arrival" className="block text-base font-semibold text-[#35191C]">New Arrival</Link>
            <Link href="/products/bestsellers" className="block text-base font-semibold text-[#35191C]">Bestsellers</Link>
            <Link href="/products/religious-gift-items" className="block text-base font-semibold text-[#35191C]">Religious &amp; Gift Items</Link>
            <Link href="/info" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-semibold text-[#B82E44]">Info</Link>
            <Link href="/policies" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-semibold text-[#B82E44]">Our Policy</Link>
          </div>
        )}

      </div>
    </div>
  );
}
