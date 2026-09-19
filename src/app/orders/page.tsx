"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import OrderTrackerCard, { OrderData } from "@/components/orders/OrderTrackerCard";
import { getOrderByIdApi, searchOrdersApi, getAllOrdersApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get("id") || searchParams.get("orderId") || "";
  const urlQuery = searchParams.get("query") || searchParams.get("q") || "";

  const { user, isLoading: authLoading } = useAuth();
  const [searchInput, setSearchInput] = useState(urlOrderId || urlQuery || "");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [foundOrders, setFoundOrders] = useState<OrderData[]>([]);
  const [savedOrders, setSavedOrders] = useState<OrderData[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Load user's local saved orders from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kj_user_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedOrders(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not parse saved orders from localStorage", e);
    }
  }, []);

  // Fetch automatically if URL parameter exists or auto-search user's own orders
  useEffect(() => {
    const initialQuery = urlOrderId || urlQuery;
    if (initialQuery) {
      setSearchInput(initialQuery);
      performSearch(initialQuery);
    } else if (user?.email || user?.phone) {
      const userTerm = user.email || user.phone;
      if (userTerm) {
        performSearch(userTerm);
      }
    }
  }, [urlOrderId, urlQuery, user]);

  if (authLoading) {
    return (
      <div className="min-h-[70vh] bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-[#7C1B2A] rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-serif text-[#7C1B2A]">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated Gate: User must be logged in
  if (!user) {
    return (
      <div className="min-h-[75vh] bg-[#FFF8F0] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border border-[#E8CFC5] shadow-xl space-y-6 animate-scaleUp">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#FFF0EA] border border-[#E8CFC5] flex items-center justify-center text-4xl shadow-inner">
            🔒
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-[#7C1B2A]">
              Authentication Required
            </h2>
            <p className="text-xs text-[#6F4A4A] leading-relaxed">
              Order track karne ke liye pehle login karna zaroori hai. Please sign in to your Keshar Jewellers account to track your orders.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/login?redirect=${encodeURIComponent("/orders")}&msg=${encodeURIComponent("Please sign in to track your order.")}`}
              className="w-full sm:w-auto py-3 px-6 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all text-center"
            >
              Sign In to Account →
            </Link>
            <Link
              href={`/signup?redirect=${encodeURIComponent("/orders")}`}
              className="w-full sm:w-auto py-3 px-6 bg-[#FFF0EA] hover:bg-[#FFE2D8] text-[#7C1B2A] border border-[#E8CFC5] font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const performSearch = async (term: string) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;

    setLoading(true);
    setErrorMsg("");
    setSearched(true);
    setFoundOrders([]);

    try {
      // 1. Try fetching by exact ID
      const singleOrder = await getOrderByIdApi(cleanTerm);
      if (singleOrder) {
        setFoundOrders([singleOrder]);
        setLoading(false);
        return;
      }

      // 2. Try searching by query (email/phone/name)
      const results = await searchOrdersApi(cleanTerm);
      if (results && results.length > 0) {
        setFoundOrders(results);
        setLoading(false);
        return;
      }

      // 3. Fallback: Search inside local saved orders or all backend orders
      const localMatches = savedOrders.filter(
        (o) =>
          o.id.toLowerCase().includes(cleanTerm.toLowerCase()) ||
          o.customerPhone.includes(cleanTerm) ||
          (o.customerEmail && o.customerEmail.toLowerCase().includes(cleanTerm.toLowerCase()))
      );

      if (localMatches.length > 0) {
        setFoundOrders(localMatches);
      } else {
        // Try fetching all orders as fallback (demo mode / backend seed test)
        const allOrders = await getAllOrdersApi();
        const matches = allOrders.filter(
          (o: any) =>
            o.id.toLowerCase().includes(cleanTerm.toLowerCase()) ||
            o.customerPhone.includes(cleanTerm) ||
            (o.customerEmail && o.customerEmail.toLowerCase().includes(cleanTerm.toLowerCase())) ||
            o.customerName.toLowerCase().includes(cleanTerm.toLowerCase())
        );
        if (matches.length > 0) {
          setFoundOrders(matches);
        } else {
          setErrorMsg(`No orders found matching "${cleanTerm}". Please check your Order ID, Phone Number, or Email.`);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to connect to order tracking service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      performSearch(searchInput);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Page Hero Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 bg-[#FFF0EA] text-[#7C1B2A] border border-[#E8CFC5] rounded-full text-xs font-bold uppercase tracking-wider">
            🚚 Live Delivery Tracking
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#7C1B2A] tracking-wide">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#6F4A4A] leading-relaxed">
            Enter your <strong>Order ID</strong>, <strong>Registered Phone Number</strong>, or <strong>Email Address</strong> below to view your real-time shipment status and delivery updates.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8CFC5] shadow-[0_20px_50px_rgba(124,27,42,0.06)] relative overflow-hidden">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  placeholder="Enter Order ID (e.g. 64f12...), Phone Number (+91...), or Email"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#FFFDFC] border border-[#E8CFC5] rounded-2xl text-xs sm:text-sm text-[#35191C] placeholder-[#6F4A4A]/60 focus:outline-none focus:border-[#7C1B2A] focus:ring-2 focus:ring-[#7C1B2A]/20 transition-all shadow-inner"
                />
                <span className="absolute left-4 top-3.5 text-lg">🔍</span>
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => { setSearchInput(""); setSearched(false); setFoundOrders([]); }}
                    className="absolute right-3.5 top-3.5 text-xs text-[#6F4A4A] hover:text-[#7C1B2A] font-bold bg-[#FFE2D8] w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="py-3.5 px-8 bg-[#7C1B2A] hover:bg-[#5C131F] disabled:opacity-50 text-[#FFF8F0] font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Searching Order...</span>
                  </>
                ) : (
                  <>
                    <span>Track Order</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Demo Search Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6F4A4A] pt-1">
              <span className="font-semibold text-[#7C1B2A]">Try searching:</span>
              <button
                type="button"
                onClick={() => { setSearchInput("priya.sharma@example.com"); performSearch("priya.sharma@example.com"); }}
                className="px-2.5 py-1 bg-[#FFF0EA] hover:bg-[#FFE2D8] text-[#7C1B2A] border border-[#E8CFC5] rounded-lg transition-colors font-medium text-[11px]"
              >
                Priya Sharma
              </button>
              <button
                type="button"
                onClick={() => { setSearchInput("Ananya Roy"); performSearch("Ananya Roy"); }}
                className="px-2.5 py-1 bg-[#FFF0EA] hover:bg-[#FFE2D8] text-[#7C1B2A] border border-[#E8CFC5] rounded-lg transition-colors font-medium text-[11px]"
              >
                Ananya Roy
              </button>
              <button
                type="button"
                onClick={() => { setSearchInput("Vikramaditya"); performSearch("Vikramaditya"); }}
                className="px-2.5 py-1 bg-[#FFF0EA] hover:bg-[#FFE2D8] text-[#7C1B2A] border border-[#E8CFC5] rounded-lg transition-colors font-medium text-[11px]"
              >
                Vikramaditya
              </button>
            </div>
          </form>
        </div>

        {/* Search Results / Orders Display */}
        {errorMsg && (
          <div className="bg-[#FDF2F2] border border-[#F8B4B4] p-6 rounded-3xl text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FDE8E8] text-[#C81E1E] flex items-center justify-center text-2xl font-bold">
              🔍
            </div>
            <h3 className="font-serif text-lg font-bold text-[#9B1C1C]">Order Not Found</h3>
            <p className="text-xs text-[#7F1D1D] max-w-md mx-auto leading-relaxed">
              {errorMsg}
            </p>
            <div className="pt-2">
              <a
                href="tel:+919827415111"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#7C1B2A] text-white text-xs font-bold rounded-xl shadow-sm"
              >
                <span>📞 Need Help? Call Keshar Support</span>
              </a>
            </div>
          </div>
        )}

        {/* Found Orders Cards List */}
        {foundOrders.length > 0 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#E8CFC5] pb-3">
              <h2 className="font-serif text-xl font-bold text-[#7C1B2A] flex items-center gap-2">
                <span>📦</span> Matching Orders ({foundOrders.length})
              </h2>
              <span className="text-xs text-[#6F4A4A]">Showing latest orders first</span>
            </div>

            {foundOrders.map((order) => (
              <OrderTrackerCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {/* Local Saved Orders Section (if user hasn't actively searched or as fallback) */}
        {!searched && savedOrders.length > 0 && foundOrders.length === 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-[#E8CFC5] pb-3">
              <h2 className="font-serif text-xl font-bold text-[#7C1B2A] flex items-center gap-2">
                <span>🕒</span> Your Saved Purchases ({savedOrders.length})
              </h2>
              <span className="text-xs text-[#6F4A4A]">Saved on this device</span>
            </div>

            <div className="space-y-6">
              {savedOrders.map((order) => (
                <OrderTrackerCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {/* Initial Empty State (Before search and no local saved orders) */}
        {!searched && savedOrders.length === 0 && (
          <div className="bg-white rounded-3xl p-10 border border-[#E8CFC5] text-center space-y-5 shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#FFF0EA] border border-[#E8CFC5] flex items-center justify-center text-4xl shadow-inner">
              💎
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="font-serif text-2xl font-bold text-[#7C1B2A]">
                No active orders selected
              </h3>
              <p className="text-xs text-[#6F4A4A] leading-relaxed">
                Enter your Order ID or phone number in the search bar above to view real-time status. Or explore our latest jewellery collection!
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-4">
              <Link
                href="/products/all"
                className="px-6 py-3 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                Browse Jewellery Collection →
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] bg-[#FFF8F0] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-[#7C1B2A] rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-serif text-[#7C1B2A]">Loading order tracker...</p>
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
