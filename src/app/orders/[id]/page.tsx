"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import OrderTrackerCard, { OrderData } from "@/components/orders/OrderTrackerCard";
import { getOrderByIdApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function SingleOrderTrackerPage() {
  const params = useParams();
  const orderId = (params?.id as string) || "";
  const { user, isLoading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId || !user) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      try {
        // 1. Try fetching from API
        const data = await getOrderByIdApi(orderId);
        if (data) {
          setOrder(data);
        } else {
          // 2. Check local saved orders
          const stored = localStorage.getItem("kj_user_orders");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              const match = parsed.find(
                (o: OrderData) => o.id.toLowerCase() === orderId.toLowerCase()
              );
              if (match) {
                setOrder(match);
                setLoading(false);
                return;
              }
            }
          }
          setError(`Order ID "${orderId}" not found in our database.`);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);

  if (authLoading) {
    return (
      <div className="min-h-[75vh] bg-[#FFF8F0] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-[#7C1B2A] rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-serif text-[#7C1B2A]">Verifying authentication...</p>
        </div>
      </div>
    );
  }

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
              Order tracking details dekhne ke liye pehle login karna zaroori hai. Please sign in to your Keshar Jewellers account.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/login?redirect=${encodeURIComponent(`/orders/${orderId}`)}&msg=${encodeURIComponent("Please sign in to view tracking details.")}`}
              className="w-full sm:w-auto py-3 px-6 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all text-center"
            >
              Sign In to Account →
            </Link>
            <Link
              href={`/signup?redirect=${encodeURIComponent(`/orders/${orderId}`)}`}
              className="w-full sm:w-auto py-3 px-6 bg-[#FFF0EA] hover:bg-[#FFE2D8] text-[#7C1B2A] border border-[#E8CFC5] font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[75vh] bg-[#FFF8F0] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-[#7C1B2A] rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-serif text-[#7C1B2A]">Fetching order status for #{orderId.substring(0, 8)}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/orders"
            className="text-xs font-bold text-[#7C1B2A] hover:underline flex items-center gap-1 bg-[#FFF0EA] px-3.5 py-1.5 rounded-full border border-[#E8CFC5]"
          >
            <span>← Search Another Order</span>
          </Link>

          <Link
            href="/profile"
            className="text-xs font-semibold text-[#6F4A4A] hover:text-[#7C1B2A]"
          >
            👤 View My Account
          </Link>
        </div>

        {error || !order ? (
          <div className="bg-white rounded-3xl p-10 border border-[#E8CFC5] text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FDF2F2] border border-[#F8B4B4] text-[#C81E1E] flex items-center justify-center text-3xl">
              ❌
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="font-serif text-2xl font-bold text-[#7C1B2A]">
                Order Not Found
              </h2>
              <p className="text-xs text-[#6F4A4A]">
                {error || `We couldn't find order details for ID #${orderId}. Please verify your order number.`}
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/orders"
                className="px-6 py-3 bg-[#7C1B2A] text-white text-xs font-bold rounded-xl shadow-md"
              >
                Go to Order Search Hub
              </Link>
            </div>
          </div>
        ) : (
          <OrderTrackerCard order={order} />
        )}

      </div>
    </div>
  );
}
