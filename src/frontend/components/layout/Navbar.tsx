"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/data/categories";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/frontend/types/product";
import { SAMPLE_PRODUCTS, searchOrdersApi } from "@/lib/api";

const CATEGORY_NAV_ITEMS = CATEGORIES.map(({ name, href, icon, slug }) => ({ name, href, icon, slug }));

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCategoryOpenMobile, setIsCategoryOpenMobile] = useState(false);
  const [isInfoOpenMobile, setIsInfoOpenMobile] = useState(false);
  const [isPolicyOpenMobile, setIsPolicyOpenMobile] = useState(false);

  // Desktop click dropdown states
  const [isDesktopCategoryOpen, setIsDesktopCategoryOpen] = useState(false);
  const [isDesktopInfoOpen, setIsDesktopInfoOpen] = useState(false);
  const [isDesktopPolicyOpen, setIsDesktopPolicyOpen] = useState(false);

  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();

  // Track Order conditional visibility: User must be logged in AND have purchased at least 1 order
  const [hasPurchasedOrders, setHasPurchasedOrders] = useState(false);

  useEffect(() => {
    if (!user) {
      setHasPurchasedOrders(false);
      return;
    }

    const checkPurchases = async () => {
      // 1. Check local saved orders
      try {
        const stored = localStorage.getItem("kj_user_orders");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHasPurchasedOrders(true);
            return;
          }
        }
      } catch (e) {}

      // 2. Check Backend API orders
      try {
        const query = user.email || user.phone;
        if (query) {
          const res = await searchOrdersApi(query);
          if (res && res.length > 0) {
            setHasPurchasedOrders(true);
            return;
          }
        }
      } catch (e) {}

      setHasPurchasedOrders(false);
    };

    checkPurchases();
  }, [user]);

  // Product Live Search Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Close desktop dropdowns on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setIsDesktopCategoryOpen(false);
      setIsDesktopInfoOpen(false);
      setIsDesktopPolicyOpen(false);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Prevent body scrolling when mobile menu drawer or mobile search modal is open
  useEffect(() => {
    if (isMobileMenuOpen || isMobileSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isMobileSearchOpen]);

  // Focus search input when mobile search overlay opens
  useEffect(() => {
    if (isMobileSearchOpen) {
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 100);
      fetchProducts();
    }
  }, [isMobileSearchOpen]);

  // Fetch all products for live search filter (deferred on-demand)
  const hasFetchedProductsRef = useRef(false);
  const fetchProducts = useCallback(async () => {
    if (hasFetchedProductsRef.current) return;
    hasFetchedProductsRef.current = true;
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

  // Close desktop search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openCategoriesDrawer = () => {
    setIsMobileSearchOpen(false);
    setIsCategoryOpenMobile(true);
    setIsInfoOpenMobile(true);
    setIsPolicyOpenMobile(true);
    setIsMobileMenuOpen(true);
  };

  return (
    <>
      <div className="w-full sticky top-0 z-50 flex flex-col shadow-sm">
        {/* 1. Top Announcement Bar */}
        <div className="bg-[#7C1B2A] text-[#E6C766] py-1.5 px-3 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] sm:text-xs font-medium tracking-wider min-h-[36px]">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">

            {/* Social Icons (Visible on Mobile & Desktop as in screenshot) */}
            <div className="flex items-center gap-3 text-white">
              <a
                href="https://www.facebook.com/100063885402562/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E6C766] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a
                href=" https://www.instagram.com/kesharjewellers2003/?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E6C766] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

            {/* Desktop Brand USPs */}
            <div className="hidden sm:flex items-center space-x-4 lg:space-x-6 text-[10px] lg:text-[11px] uppercase tracking-[0.15em] lg:tracking-[0.2em]">
              <span>✨ 100% Hallmarked Jewellery</span>
              <span>•</span>
              <span>Lifetime Exchange</span>
              <span>•</span>
              <span>Free Shipping</span>
              <span>•</span>
              <span>Secure Payments</span>
            </div>

            {/* Direct Phone Call */}
            <a
              href="tel:+919827415111"
              className="text-[11px] tracking-wider text-[#FFC7B8] hover:text-white transition-colors flex items-center gap-1 font-bold whitespace-nowrap"
            >
              <svg className="w-3 h-3 text-[#FFC7B8]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.21.49 2.53.76 3.88.76a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.27 1.11l-2.2 2.2z" />
              </svg>
              <span>+91 98274 15111</span>
            </a>
          </div>
        </div>

        {/* 2. Main Header Bar */}
        <div className="bg-[#FFF8F0] text-[#35191C] py-2.5 sm:py-3 px-3 sm:px-6 lg:px-8 border-b border-[#E8CFC5] relative">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">

            {/* Brand Logo & Name */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
                <Image
                  src="/logo-old.png"
                  alt="Keshar Jewellers Logo"
                  width={46}
                  height={46}
                  priority
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain mr-1.5 sm:mr-2 filter drop-shadow-[0_2px_4px_rgba(122,16,33,0.15)]"
                />
                <div className="flex flex-col">
                  <span className="font-serif text-base sm:text-2xl font-bold tracking-wide uppercase text-[#B82E44] leading-tight">
                    Keshar <span className="text-[#D4AF37] font-serif italic lowercase text-lg sm:text-2xl">Jewellers</span>
                  </span>
                  <span className="hidden sm:block text-[9px] uppercase tracking-[0.25em] text-[#6F4A4A] font-semibold -mt-0.5">
                    Sehore • Est. 2003
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[15px] font-medium">
              <Link href="/" className="border-b-2 border-[#D4AF37] pb-1 text-[#B82E44] font-semibold">
                Home
              </Link>

              {/* Interactive Shop By Category Dropdown */}
              <div
                className="group relative flex items-center gap-1 cursor-pointer py-2 text-[#35191C] hover:text-[#B82E44] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDesktopCategoryOpen((prev) => !prev);
                  setIsDesktopInfoOpen(false);
                  setIsDesktopPolicyOpen(false);
                }}
              >
                <span>Shop By Category</span>
                <svg className="w-3.5 h-3.5 text-[#6F4A4A] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>

                {/* Dropdown Menu Container */}
                <div className={`absolute top-full left-0 ${isDesktopCategoryOpen ? "block" : "hidden group-hover:block"} w-[480px] bg-[#FFF8F0] border border-[#E8CFC5] rounded-2xl shadow-[0_15px_40px_rgba(72,12,20,0.12)] p-5 z-50 transition-all duration-300`}>
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
                        <span className="text-[#D4AF37] group-hover/link:translate-x-1 transition-transform">{item.icon || "✦"}</span>
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/products/new-arrival" className="hover:text-[#B82E44] transition-colors text-[#35191C]">
                New Arrival
              </Link>
              <Link href="/products/bestsellers" className="hover:text-[#B82E44] transition-colors text-[#35191C]">
                Bestsellers
              </Link>

              {/* Interactive Info Dropdown */}
              <div
                className="group relative flex items-center gap-1 cursor-pointer py-2 text-[#35191C] hover:text-[#B82E44] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDesktopInfoOpen((prev) => !prev);
                  setIsDesktopCategoryOpen(false);
                  setIsDesktopPolicyOpen(false);
                }}
              >
                <div className="flex items-center gap-1">
                  <span>Info</span>
                  <svg className="w-3.5 h-3.5 text-[#6F4A4A] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>

                <div className={`absolute top-full left-0 ${isDesktopInfoOpen ? "block" : "hidden group-hover:block"} w-64 bg-[#FFF8F0] border border-[#E8CFC5] rounded-2xl shadow-[0_15px_40px_rgba(72,12,20,0.12)] p-3 z-50 transition-all duration-300`}>
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
              <div
                className="group relative flex items-center gap-1 cursor-pointer py-2 text-[#35191C] hover:text-[#B82E44] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDesktopPolicyOpen((prev) => !prev);
                  setIsDesktopCategoryOpen(false);
                  setIsDesktopInfoOpen(false);
                }}
              >
                <div className="flex items-center gap-1">
                  <span>Our Policy</span>
                  <svg className="w-3.5 h-3.5 text-[#6F4A4A] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>

                <div className={`absolute top-full left-0 ${isDesktopPolicyOpen ? "block" : "hidden group-hover:block"} w-72 bg-[#FFF8F0] border border-[#E8CFC5] rounded-2xl shadow-[0_15px_40px_rgba(72,12,20,0.12)] p-3 z-50 transition-all duration-300`}>
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

            {/* Desktop Search Bar & Right Action Icons */}
            <div className="flex items-center space-x-2.5 sm:space-x-4 xl:space-x-5">

              {/* Desktop Live Search Input */}
              <div ref={searchRef} className="hidden lg:flex relative items-center">
                <input
                  type="text"
                  placeholder="Search Gold, Silver, Rings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    fetchProducts();
                    if (searchQuery.trim()) setIsSearchOpen(true);
                  }}
                  suppressHydrationWarning
                  className="pl-4 pr-10 py-1.5 rounded-full border border-[#E8CFC5] bg-[#FFFDFC] focus:outline-none focus:border-[#B82E44] focus:ring-1 focus:ring-[#B82E44] text-xs xl:text-sm w-44 xl:w-64 text-[#35191C] placeholder-[#6F4A4A]/60 shadow-inner"
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </button>
                )}

                {/* Floating Desktop Search Results */}
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

              {/* User Account / Profile */}
              <div className="relative">
                {user ? (
                  <div className="relative group">
                    <Link
                      href="/profile"
                      className="flex items-center gap-1.5 text-[#B82E44] hover:text-[#7C1B2A] bg-[#FFE2D8] py-1.5 px-2.5 rounded-lg border border-[#E8CFC5] transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#7C1B2A] text-[#FFF8F0] text-[10px] font-bold flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline text-xs font-semibold max-w-[70px] truncate">{user.name.split(" ")[0]}</span>
                    </Link>

                    {/* User Dropdown Menu */}
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
                      <Link
                        href="/orders"
                        className="block px-3 py-1.5 text-xs text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] rounded-lg transition-colors font-medium mb-1"
                      >
                        🚚 Track My Orders
                      </Link>

                      {user.role === "admin" && (
                        <a
                          href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-3 py-1.5 text-xs text-[#35191C] hover:bg-[#FFF0EA] hover:text-[#B82E44] rounded-lg transition-colors font-medium mb-1"
                        >
                          👑 Admin Panel ↗
                        </a>
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
                    className="text-[#B82E44] hover:text-[#7C1B2A] transition-colors flex items-center gap-1 bg-[#FFE2D8] py-1.5 px-2 sm:px-3 rounded-lg border border-[#E8CFC5]"
                    aria-label="Account Login"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="hidden sm:inline text-xs font-semibold">Login</span>
                  </Link>
                )}
              </div>

              {/* Wishlist Button */}
              <Link
                href="/wishlist"
                className="text-[#B82E44] hover:text-[#7C1B2A] transition-all relative bg-[#FFE2D8] hover:bg-[#FFD6C9] p-2 sm:p-2.5 rounded-lg border border-[#E8CFC5] hover:scale-105 active:scale-95 flex items-center justify-center"
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={wishlistCount > 0 ? "#B82E44" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span className={`absolute -top-2 -right-2 bg-[#B82E44] text-[#FFF8F0] text-[9px] sm:text-[10px] font-bold h-4 sm:h-5 min-w-[16px] sm:min-w-[20px] px-1 rounded-full flex items-center justify-center border border-[#FFF8F0] shadow-sm transition-transform ${wishlistCount > 0 ? "scale-110" : ""}`}>
                  {wishlistCount}
                </span>
              </Link>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="text-[#B82E44] hover:text-[#7C1B2A] transition-all relative bg-[#FFE2D8] hover:bg-[#FFD6C9] p-2 sm:p-2.5 rounded-lg border border-[#E8CFC5] hover:scale-105 active:scale-95 flex items-center justify-center"
                aria-label={`Shopping Cart with ${totalItemsCount} items`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span className={`absolute -top-2 -right-2 bg-[#B82E44] text-[#FFF8F0] text-[9px] sm:text-[10px] font-bold h-4 sm:h-5 min-w-[16px] sm:min-w-[20px] px-1 rounded-full flex items-center justify-center border border-[#FFF8F0] shadow-sm transition-transform ${totalItemsCount > 0 ? "scale-110 animate-pulse" : ""}`}>
                  {totalItemsCount}
                </span>
              </Link>

              {/* Order Tracker Button (Moved to right side) */}
              {user && hasPurchasedOrders && (
                <Link
                  href="/orders"
                  className="hidden md:flex text-[#B82E44] hover:text-[#7C1B2A] transition-all relative bg-[#FFE2D8] hover:bg-[#FFD6C9] p-2 sm:p-2.5 sm:px-3 rounded-lg border border-[#E8CFC5] hover:scale-105 active:scale-95 items-center justify-center gap-1 animate-fadeIn"
                  aria-label="Track Order"
                >
                  <span className="text-sm sm:text-base leading-none">🚚</span>
                  <span className="hidden lg:inline text-xs font-semibold">Track</span>
                </Link>
              )}

              {/* Mobile Sidebar Menu Toggle Button (Right Side) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen((prev) => !prev);
                }}
                className="lg:hidden text-[#B82E44] hover:text-[#7C1B2A] bg-[#FFE2D8] active:bg-[#FFD6C9] p-2 rounded-lg border border-[#E8CFC5] transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Toggle Navigation Sidebar Menu"
              >
                <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

            </div>
          </div>
        </div>

        {/* 3. Horizontal Mobile Sub-Category Scroll Bar (`lg:hidden`) */}
        <div className="lg:hidden bg-[#FFF3E8] border-b border-[#E8CFC5]/80 py-2 px-3 overflow-x-auto scrollbar-none scroll-touch flex items-center gap-2 text-xs font-semibold text-[#35191C] shadow-inner">
          <Link
            href="/products/all"
            className="flex items-center gap-1 bg-[#FFE2D8] text-[#7C1B2A] hover:bg-[#B82E44] hover:text-white px-3 py-1 rounded-full border border-[#E8CFC5] whitespace-nowrap transition-colors shadow-sm"
          >
            <span>✨</span> <span>All</span>
          </Link>
          {CATEGORY_NAV_ITEMS.slice(0, 10).map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex items-center gap-1.5 bg-[#FFF8F0] text-[#35191C] hover:bg-[#B82E44] hover:text-white px-3 py-1 rounded-full border border-[#E8CFC5]/80 whitespace-nowrap transition-colors shadow-sm"
            >
              <span>{cat.icon || "✦"}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Instant Mobile Search Overlay Modal (`lg:hidden`) */}
      {isMobileSearchOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-start pt-safe pb-safe">
          <div className="bg-[#FFF8F0] border-b border-[#E8CFC5] p-4 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7C1B2A] flex items-center gap-1">
                <span>🔍</span> Search Keshar Jewellers
              </span>
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="text-[#6F4A4A] hover:text-[#B82E44] p-1 text-sm font-bold rounded-full bg-[#FFE2D8]"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search Gold, Silver, Rings, Necklaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-full border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] focus:outline-none focus:border-[#B82E44] focus:ring-2 focus:ring-[#B82E44]/20 shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-xs text-[#6F4A4A] font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Mobile Search Live Results */}
            {searchQuery.trim() && (
              <div className="max-h-80 overflow-y-auto bg-[#FFFDFC] border border-[#E8CFC5] rounded-2xl divide-y divide-[#E8CFC5]/40 shadow-inner mt-1">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/details/${p.id}`}
                      onClick={() => {
                        setIsMobileSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-[#FFF0EA] transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#FFE2D8] border border-[#E8CFC5] relative overflow-hidden flex-shrink-0">
                        <Image src={p.frontImage || "/images/categories/ring.png"} alt={p.productType} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#35191C] truncate">{p.productType}</p>
                        <p className="text-[10px] text-[#6F4A4A] capitalize">{p.material} • {p.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold text-[#9B1B30]">₹{p.sellingPrice?.toLocaleString("en-IN")}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="p-4 text-xs text-center text-[#6F4A4A]">No products matching "{searchQuery}"</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Off-Canvas Right-Side Mobile Navigation Drawer (`lg:hidden`) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex justify-end">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[101] transition-opacity duration-300 pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Right-Side Drawer Container */}
          <div className="relative w-[85%] sm:w-80 max-w-xs sm:max-w-sm bg-[#FFFBF7] h-full h-dvh max-h-dvh shadow-2xl flex flex-col z-[102] overflow-y-auto scroll-touch border-l border-[#E8CFC5] ml-auto px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] gap-4">

            {/* Drawer Brand Header with Close Button */}
            <div className="bg-[#7C1B2A] text-[#FFF8F0] p-3 rounded-2xl flex items-center justify-between shadow-sm sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <Image src="/logo-old.png" alt="Logo" width={32} height={32} className="w-7 h-7 object-contain" />
                <div>
                  <h3 className="font-serif text-sm font-bold tracking-wide text-[#E6C766]">Keshar Jewellers</h3>
                  <p className="text-[8px] uppercase tracking-widest text-[#FFC7B8]">BIS Hallmarked • Sehore</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#FFC7B8] hover:text-white p-1 rounded-lg bg-[#5C141F] transition-colors active:scale-95 cursor-pointer"
                aria-label="Close Menu"
              >
                <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 1. Search Bar at Top of Drawer (Matching Screenshot) */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Gold, Silver, Rings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-full border border-[#E8CFC5] bg-white text-xs text-[#35191C] placeholder-[#6F4A4A]/60 focus:outline-none focus:border-[#B82E44] focus:ring-1 focus:ring-[#B82E44] shadow-xs"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-[10px] font-bold text-[#6F4A4A] bg-[#FFE2D8] w-4 h-4 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              ) : (
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 pointer-events-none">🔍</span>
              )}

              {/* Drawer Live Search Results */}
              {searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#FFF8F0] border border-[#E8CFC5] rounded-2xl max-h-52 overflow-y-auto divide-y divide-[#E8CFC5]/40 shadow-xl z-30">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.slice(0, 6).map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/details/${p.id}`}
                        onClick={() => { setIsMobileMenuOpen(false); setSearchQuery(""); }}
                        className="flex items-center gap-2.5 p-2.5 hover:bg-[#FFE2D8] transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#FFE2D8] border border-[#E8CFC5] relative overflow-hidden flex-shrink-0">
                          <Image src={p.frontImage || "/images/categories/ring.png"} alt={p.productType} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#35191C] truncate">{p.productType}</p>
                          <p className="text-[10px] text-[#6F4A4A] capitalize">{p.material} • {p.category}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-bold text-[#9B1B30]">₹{p.sellingPrice?.toLocaleString("en-IN")}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="p-3 text-xs text-center text-[#6F4A4A]">No matching products found</p>
                  )}
                </div>
              )}
            </div>

            {/* 2. Menu Navigation Links List (Styled exactly as in screenshot) */}
            <div className="flex flex-col space-y-1 pt-1 flex-1">

              {/* Home (Maroon text) */}
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-1 text-base font-semibold text-[#8B1E2D] hover:text-[#B82E44] transition-colors flex items-center justify-between"
              >
                <span>Home</span>
              </Link>

              {/* Shop By Category (Dark text + Maroon '+' sign on right) */}
              <div className="border-t border-[#E8CFC5]/40 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCategoryOpenMobile((prev) => !prev);
                  }}
                  className="w-full py-2 px-1 flex items-center justify-between text-base font-semibold text-[#35191C] hover:text-[#8B1E2D] transition-colors cursor-pointer"
                >
                  <span>Shop By Category</span>
                  <span className="text-[#8B1E2D] font-bold text-lg">{isCategoryOpenMobile ? "−" : "+"}</span>
                </button>

                {/* Expanded Categories Grid */}
                {isCategoryOpenMobile && (
                  <div className="py-2 px-1 grid grid-cols-2 gap-1.5 bg-[#FFF3E8]/70 rounded-2xl border border-[#E8CFC5]/50 my-1 max-h-60 overflow-y-auto">
                    {CATEGORY_NAV_ITEMS.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#35191C] hover:bg-[#FFE2D8] hover:text-[#8B1E2D] transition-colors border border-[#E8CFC5]/40 bg-[#FFF8F0]"
                      >
                        <span className="text-[#D4AF37]">{item.icon || "✦"}</span>
                        <span className="truncate">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* New Arrival */}
              <Link
                href="/products/new-arrival"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-1 text-base font-semibold text-[#35191C] hover:text-[#8B1E2D] transition-colors border-t border-[#E8CFC5]/40 flex items-center justify-between"
              >
                <span>New Arrival</span>
              </Link>

              {/* Bestsellers */}
              <Link
                href="/products/bestsellers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-1 text-base font-semibold text-[#35191C] hover:text-[#8B1E2D] transition-colors border-t border-[#E8CFC5]/40 flex items-center justify-between"
              >
                <span>Bestsellers</span>
              </Link>

              {/* Religious & Gift Items */}
              <Link
                href="/products/religious-gift-items"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-1 text-base font-semibold text-[#35191C] hover:text-[#8B1E2D] transition-colors border-t border-[#E8CFC5]/40 flex items-center justify-between"
              >
                <span>Religious &amp; Gift Items</span>
              </Link>

              {/* Track Order (Only visible if user logged in AND has purchased products) */}
              {user && hasPurchasedOrders && (
                <Link
                  href="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 px-1 text-base font-bold text-[#8B1E2D] hover:text-[#B82E44] transition-colors border-t border-[#E8CFC5]/40 flex items-center justify-between bg-[#FFF0EA] rounded-xl px-2 my-1"
                >
                  <span className="flex items-center gap-1.5">
                    <span>🚚</span> Track Order
                  </span>
                  <span className="text-xs bg-[#7C1B2A] text-white px-2 py-0.5 rounded-full font-sans font-semibold">Live</span>
                </Link>
              )}

              {/* Info (Maroon text) */}
              <div className="border-t border-[#E8CFC5]/40 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsInfoOpenMobile((prev) => !prev);
                  }}
                  className="w-full py-2 px-1 flex items-center justify-between text-base font-semibold text-[#8B1E2D] hover:text-[#B82E44] transition-colors cursor-pointer"
                >
                  <span>Info</span>
                  <span className="text-[#8B1E2D] font-bold text-lg">{isInfoOpenMobile ? "−" : "+"}</span>
                </button>

                {/* Expanded Info Links */}
                {isInfoOpenMobile && (
                  <div className="py-2 px-2 flex flex-col gap-1 bg-[#FFF3E8]/70 rounded-2xl border border-[#E8CFC5]/50 my-1 text-xs font-medium text-[#35191C]">
                    <Link href="/info#story" onClick={() => setIsMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-xl hover:bg-[#FFE2D8] hover:text-[#8B1E2D]">
                      🏛️ About &amp; Store Heritage
                    </Link>
                    <Link href="/info#location" onClick={() => setIsMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-xl hover:bg-[#FFE2D8] hover:text-[#8B1E2D]">
                      📍 Showroom Location &amp; Hours
                    </Link>
                    <Link href="/info#purity" onClick={() => setIsMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-xl hover:bg-[#FFE2D8] hover:text-[#8B1E2D]">
                      ✨ Gold Purity &amp; Hallmark
                    </Link>
                    <Link href="/info#custom" onClick={() => setIsMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-xl hover:bg-[#FFE2D8] hover:text-[#8B1E2D]">
                      👑 Custom Jewellery Orders
                    </Link>
                    <Link href="/info#faq" onClick={() => setIsMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-xl hover:bg-[#FFE2D8] hover:text-[#8B1E2D]">
                      ❓ Store FAQs
                    </Link>
                  </div>
                )}
              </div>

              {/* Our Policy (Maroon text) */}
              <div className="border-t border-[#E8CFC5]/40 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPolicyOpenMobile((prev) => !prev);
                  }}
                  className="w-full py-2 px-1 flex items-center justify-between text-base font-semibold text-[#8B1E2D] hover:text-[#B82E44] transition-colors cursor-pointer"
                >
                  <span>Our Policy</span>
                  <span className="text-[#8B1E2D] font-bold text-lg">{isPolicyOpenMobile ? "−" : "+"}</span>
                </button>

                {/* Expanded Policy Links */}
                {isPolicyOpenMobile && (
                  <div className="py-2 px-2 flex flex-col gap-1 bg-[#FFF3E8]/70 rounded-2xl border border-[#E8CFC5]/50 my-1 text-xs font-medium text-[#35191C]">
                    <Link href="/policies#hallmark" onClick={() => setIsMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-xl hover:bg-[#FFE2D8] hover:text-[#8B1E2D]">
                      🛡️ BIS Hallmark Purity
                    </Link>
                    <Link href="/policies#exchange" onClick={() => setIsMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-xl hover:bg-[#FFE2D8] hover:text-[#8B1E2D]">
                      🔄 Lifetime Exchange
                    </Link>
                    <Link href="/policies#shipping" onClick={() => setIsMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-xl hover:bg-[#FFE2D8] hover:text-[#8B1E2D]">
                      📦 Insured Shipping
                    </Link>
                    <Link href="/policies#returns" onClick={() => setIsMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-xl hover:bg-[#FFE2D8] hover:text-[#8B1E2D]">
                      🔁 7-Day Easy Returns
                    </Link>
                    <Link href="/policies#privacy" onClick={() => setIsMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-xl hover:bg-[#FFE2D8] hover:text-[#8B1E2D]">
                      🔒 Privacy &amp; Security
                    </Link>
                    <Link href="/policies#terms" onClick={() => setIsMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-xl hover:bg-[#FFE2D8] hover:text-[#8B1E2D]">
                      📜 Terms &amp; Store Rules
                    </Link>
                  </div>
                )}
              </div>

            </div>

            {/* Quick Contact Bar at bottom of drawer */}
            <div className="pt-3 border-t border-[#E8CFC5]/50 flex items-center justify-between text-xs text-[#6F4A4A] mt-auto">
              <a
                href="tel:+919827415111"
                className="flex items-center gap-1 text-[#8B1E2D] font-bold bg-[#FFE2D8] px-3 py-1.5 rounded-full border border-[#E8CFC5]"
              >
                <span>📞 Call Us</span>
              </a>
              <a
                href="https://wa.me/919827415111"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-white font-bold bg-[#25D366] px-3 py-1.5 rounded-full shadow-xs"
              >
                <span>💬 WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
