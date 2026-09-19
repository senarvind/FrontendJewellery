"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAllOrders,
  getTrackingStatus,
  formatOrderDate,
  canCancelOrder,
  minutesLeftToCancel,
  TRACKING_STEPS,
  getStatusIndex,
  type KesharOrder,
} from "@/lib/orders";

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  confirmed:        { bg: "bg-blue-50",   text: "text-blue-700",  border: "border-blue-200",  dot: "bg-blue-500" },
  processing:       { bg: "bg-amber-50",  text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  packed:           { bg: "bg-purple-50", text: "text-purple-700",border: "border-purple-200",dot: "bg-purple-500" },
  shipped:          { bg: "bg-indigo-50", text: "text-indigo-700",border: "border-indigo-200",dot: "bg-indigo-500" },
  out_for_delivery: { bg: "bg-orange-50", text: "text-orange-700",border: "border-orange-200",dot: "bg-orange-500" },
  delivered:        { bg: "bg-green-50",  text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  cancelled:        { bg: "bg-red-50",    text: "text-red-700",   border: "border-red-200",   dot: "bg-red-500" },
};

const STATUS_LABELS: Record<string, string> = {
  confirmed:        "Order Confirmed",
  processing:       "Processing",
  packed:           "Packed",
  shipped:          "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered:        "Delivered",
  cancelled:        "Cancelled",
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.confirmed;
  const step = TRACKING_STEPS.find((s) => s.key === status);
  const icon = step?.icon ?? "📦";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {icon} {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<KesharOrder[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOrders(getAllOrders());
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] bg-[#FFF8F0] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-[#7C1B2A] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#7C1B2A]">
              📦 My Orders
            </h1>
            <p className="text-xs text-[#6F4A4A] mt-1">
              Track and manage your Keshar Jewellers orders
            </p>
          </div>
          <Link
            href="/profile"
            className="text-xs font-semibold text-[#7C1B2A] hover:underline flex items-center gap-1"
          >
            ← Back to Profile
          </Link>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="bg-white rounded-3xl border border-[#E8CFC5] shadow-sm p-12 text-center space-y-4">
            <div className="text-6xl">🛍️</div>
            <h2 className="text-xl font-serif font-bold text-[#7C1B2A]">No Orders Yet</h2>
            <p className="text-sm text-[#6F4A4A]">
              You haven&apos;t placed any orders yet. Explore our collection and find your perfect piece!
            </p>
            <Link
              href="/products"
              className="inline-block mt-2 px-6 py-3 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] text-sm font-semibold rounded-xl shadow-sm transition-all"
            >
              Browse Jewellery →
            </Link>
          </div>
        )}

        {/* Orders List */}
        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = getTrackingStatus(order);
              const canCancel = canCancelOrder(order);
              const minsLeft = minutesLeftToCancel(order);
              const statusIdx = getStatusIndex(status);
              const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-[#E8CFC5] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#E8CFC5]/60 bg-[#FFFDFC]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#7C1B2A]">{order.id}</span>
                        <StatusBadge status={status} />
                        {canCancel && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            ⏳ Cancel in {minsLeft}m
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6F4A4A]">
                        Ordered: {formatOrderDate(order.orderedAt)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-serif text-lg font-bold text-[#7C1B2A]">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11px] text-[#6F4A4A]">
                        {totalItems} {totalItems === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  {status !== "cancelled" && (
                    <div className="px-5 py-3 bg-[#FFFAF6]">
                      <div className="flex items-center gap-0">
                        {TRACKING_STEPS.map((step, idx) => (
                          <React.Fragment key={step.key}>
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center border-2 transition-all ${
                                  idx <= statusIdx
                                    ? "bg-[#7C1B2A] border-[#7C1B2A] text-white"
                                    : "bg-white border-[#D9C4BA] text-[#D9C4BA]"
                                }`}
                              >
                                {idx < statusIdx ? "✓" : step.icon}
                              </div>
                              <span className={`text-[9px] mt-0.5 font-medium hidden sm:block ${idx <= statusIdx ? "text-[#7C1B2A]" : "text-[#C4A89A]"}`}>
                                {step.label.split(" ")[0]}
                              </span>
                            </div>
                            {idx < TRACKING_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-0.5 ${idx < statusIdx ? "bg-[#7C1B2A]" : "bg-[#E8CFC5]"}`} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Items preview + Action */}
                  <div className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-[#6F4A4A] truncate flex-1">
                      {order.items.map((item, i) => (
                        <span key={i}>
                          {i > 0 && ", "}
                          {item.quantity}× {item.productName}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex-shrink-0 px-4 py-2 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] text-[11px] font-bold rounded-xl shadow-sm transition-all"
                    >
                      Track Order →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
