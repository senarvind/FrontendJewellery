"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  getOrderById,
  cancelOrder,
  getTrackingStatus,
  getStatusIndex,
  canCancelOrder,
  minutesLeftToCancel,
  formatOrderDate,
  TRACKING_STEPS,
  type KesharOrder,
  type TrackingStatus,
} from "@/lib/orders";

/* ─── helpers ──────────────────────────────────────── */

const STATUS_LABELS: Record<string, string> = {
  confirmed:        "Order Confirmed",
  processing:       "Processing",
  packed:           "Packed",
  shipped:          "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered:        "Delivered",
  cancelled:        "Cancelled",
};

const STATUS_COLORS: Record<string, { badge: string; ring: string }> = {
  confirmed:        { badge: "bg-blue-100 text-blue-700 border-blue-200",   ring: "border-blue-500 text-blue-600" },
  processing:       { badge: "bg-amber-100 text-amber-700 border-amber-200", ring: "border-amber-500 text-amber-600" },
  packed:           { badge: "bg-purple-100 text-purple-700 border-purple-200", ring: "border-purple-500 text-purple-600" },
  shipped:          { badge: "bg-indigo-100 text-indigo-700 border-indigo-200", ring: "border-indigo-500 text-indigo-600" },
  out_for_delivery: { badge: "bg-orange-100 text-orange-700 border-orange-200", ring: "border-orange-500 text-orange-600" },
  delivered:        { badge: "bg-green-100 text-green-700 border-green-200",   ring: "border-green-500 text-green-600" },
  cancelled:        { badge: "bg-red-100 text-red-700 border-red-200",         ring: "border-red-500 text-red-600" },
};

/* ─── main component ──────────────────────────────── */

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<KesharOrder | null>(null);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<TrackingStatus>("confirmed");
  const [canCancel, setCanCancel] = useState(false);
  const [minsLeft, setMinsLeft] = useState(0);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelDone, setCancelDone] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const refreshOrder = useCallback(() => {
    const found = getOrderById(orderId);
    if (!found) { setNotFound(true); return; }
    setOrder(found);
    const s = getTrackingStatus(found);
    setStatus(s);
    setCanCancel(canCancelOrder(found));
    setMinsLeft(minutesLeftToCancel(found));
  }, [orderId]);

  useEffect(() => {
    setMounted(true);
    refreshOrder();
  }, [refreshOrder]);

  // Live countdown for cancellation window
  useEffect(() => {
    if (!mounted || !order) return;
    const interval = setInterval(() => {
      const s = getTrackingStatus(order);
      setStatus(s);
      setCanCancel(canCancelOrder(order));
      setMinsLeft(minutesLeftToCancel(order));
    }, 30_000); // refresh every 30s
    return () => clearInterval(interval);
  }, [mounted, order]);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] bg-[#FFF8F0] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-[#7C1B2A] rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-[70vh] bg-[#FFF8F0] flex items-center justify-center p-6">
        <div className="text-center space-y-4 bg-white rounded-3xl border border-[#E8CFC5] p-10 shadow-md max-w-sm">
          <div className="text-5xl">🔍</div>
          <h2 className="text-xl font-serif font-bold text-[#7C1B2A]">Order Not Found</h2>
          <p className="text-sm text-[#6F4A4A]">We couldn&apos;t find order <strong>{orderId}</strong>.</p>
          <Link href="/orders" className="inline-block px-5 py-2.5 bg-[#7C1B2A] text-[#FFF8F0] text-xs font-bold rounded-xl">
            ← Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusIdx = getStatusIndex(status);
  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const statusColor = STATUS_COLORS[status] ?? STATUS_COLORS.confirmed;
  const currentStep = TRACKING_STEPS.find((s) => s.key === status);

  const handleCancel = async () => {
    setCancelling(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate async
    const success = cancelOrder(order.id);
    setCancelling(false);
    if (success) {
      setCancelDone(true);
      setShowCancelConfirm(false);
      refreshOrder();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Back link ── */}
        <Link href="/orders" className="text-xs font-semibold text-[#7C1B2A] hover:underline flex items-center gap-1">
          ← My Orders
        </Link>

        {/* ── Order Header Card ── */}
        <div className="bg-white rounded-3xl border border-[#E8CFC5] shadow-sm overflow-hidden">
          <div className="bg-[#7C1B2A] px-6 py-5 text-[#FFF8F0]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[#E8CFC5] font-medium uppercase tracking-wider">Order ID</p>
                <h1 className="font-mono text-lg font-bold mt-0.5">{order.id}</h1>
                <p className="text-xs text-[#E8CFC5] mt-1">{formatOrderDate(order.orderedAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#E8CFC5] font-medium">Total Paid</p>
                <p className="font-serif text-2xl font-bold">₹{order.totalAmount.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          {/* Current status highlight */}
          <div className={`px-6 py-4 flex items-center gap-3 border-b border-[#E8CFC5]/60 ${status === "cancelled" ? "bg-red-50" : "bg-[#FFFAF6]"}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 ${statusColor.ring} bg-white shadow-sm`}>
              {status === "cancelled" ? "❌" : (currentStep?.icon ?? "📦")}
            </div>
            <div>
              <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusColor.badge} mb-0.5`}>
                {status === "cancelled" ? "Cancelled" : "Current Status"}
              </span>
              <p className="font-serif text-base font-bold text-[#35191C]">
                {STATUS_LABELS[status]}
              </p>
              {status !== "cancelled" && currentStep && (
                <p className="text-[11px] text-[#6F4A4A]">{currentStep.description}</p>
              )}
              {status === "cancelled" && order.cancelledAt && (
                <p className="text-[11px] text-red-600">Cancelled on {formatOrderDate(order.cancelledAt)}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Cancellation Banner ── */}
        {!order.isCancelled && status !== "delivered" && (
          <div className={`rounded-2xl border px-5 py-4 ${canCancel ? "bg-amber-50 border-amber-200" : "bg-[#F3F3F3] border-[#DEDEDE]"}`}>
            {canCancel ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-amber-800">⏳ Cancellation Window Open</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    You can cancel this order within the next <strong>{minsLeft} minute{minsLeft !== 1 ? "s" : ""}</strong>.
                    After that, cancellation will not be possible.
                  </p>
                </div>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex-shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Cancel Order
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <span className="text-base mt-0.5">🔒</span>
                <div>
                  <p className="text-sm font-bold text-[#555]">Cancellation Window Closed</p>
                  <p className="text-xs text-[#777] mt-0.5">
                    Orders can only be cancelled within 3 hours of placement. This order&apos;s cancellation window has expired.
                    For assistance, please contact us on WhatsApp.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Cancel Confirm Modal ── */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl border border-[#E8CFC5] shadow-xl max-w-sm w-full p-7 space-y-5 text-center">
              <div className="text-5xl">⚠️</div>
              <h3 className="font-serif text-xl font-bold text-[#7C1B2A]">Cancel this Order?</h3>
              <p className="text-sm text-[#6F4A4A]">
                Are you sure you want to cancel order <strong>{order.id}</strong>?
                This action cannot be undone. Refund will be processed in 5–7 business days.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-2.5 bg-[#F3F3F3] hover:bg-[#E8E8E8] text-[#555] text-xs font-bold rounded-xl transition-all"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                  ) : "Yes, Cancel Order"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Cancel Success ── */}
        {cancelDone && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-800 font-medium flex items-center gap-2">
            ✅ Your order has been successfully cancelled. Refund will be processed within 5–7 business days.
          </div>
        )}

        {/* ── Tracking Timeline ── */}
        {status !== "cancelled" && (
          <div className="bg-white rounded-3xl border border-[#E8CFC5] shadow-sm p-6">
            <h2 className="font-serif text-lg font-bold text-[#7C1B2A] mb-6 pb-3 border-b border-[#E8CFC5]/60">
              📍 Order Journey
            </h2>
            <div className="relative">
              {TRACKING_STEPS.map((step, idx) => {
                const isCompleted = idx < statusIdx;
                const isCurrent = idx === statusIdx;
                const isFuture = idx > statusIdx;
                return (
                  <div key={step.key} className="flex gap-4 relative">
                    {/* Line */}
                    {idx < TRACKING_STEPS.length - 1 && (
                      <div
                        className={`absolute left-[18px] top-10 w-0.5 h-full -z-0 ${isCompleted ? "bg-[#7C1B2A]" : "bg-[#E8CFC5]"}`}
                        style={{ height: "calc(100% - 8px)" }}
                      />
                    )}

                    {/* Icon bubble */}
                    <div className="flex-shrink-0 z-10">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 shadow-sm transition-all ${
                          isCompleted
                            ? "bg-[#7C1B2A] border-[#7C1B2A] text-white"
                            : isCurrent
                            ? "bg-[#FFF8F0] border-[#7C1B2A] text-[#7C1B2A] ring-4 ring-[#7C1B2A]/10"
                            : "bg-white border-[#E8CFC5] text-[#C4A89A]"
                        }`}
                      >
                        {isCompleted ? "✓" : step.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 pb-8 ${isFuture ? "opacity-40" : ""}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-bold ${isCurrent ? "text-[#7C1B2A]" : isCompleted ? "text-[#35191C]" : "text-[#888]"}`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-[#7C1B2A] text-[#FFF8F0] text-[10px] font-bold rounded-full animate-pulse">
                            Current
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${isCurrent ? "text-[#6F4A4A]" : "text-[#999]"}`}>
                        {isFuture ? `Expected: ${step.estimatedTime}` : step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Order Summary ── */}
        <div className="bg-white rounded-3xl border border-[#E8CFC5] shadow-sm p-6 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#7C1B2A] pb-3 border-b border-[#E8CFC5]/60">
            🛍️ Order Summary
          </h2>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-[#35191C]">{item.productName}</p>
                  {item.category && <p className="text-[11px] text-[#888] capitalize">{item.category}</p>}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#35191C]">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  <p className="text-[11px] text-[#888]">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#E8CFC5]/60 pt-3 flex justify-between items-center">
            <span className="text-sm font-bold text-[#35191C]">Total Paid</span>
            <span className="font-serif text-xl font-bold text-[#7C1B2A]">₹{order.totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* ── Delivery Details ── */}
        <div className="bg-white rounded-3xl border border-[#E8CFC5] shadow-sm p-6 space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#7C1B2A] pb-3 border-b border-[#E8CFC5]/60">
            📬 Delivery Details
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-[#6F4A4A] w-24 flex-shrink-0 font-medium text-xs uppercase tracking-wide">Name</span>
              <span className="text-[#35191C] font-semibold">{order.customerName}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#6F4A4A] w-24 flex-shrink-0 font-medium text-xs uppercase tracking-wide">Phone</span>
              <span className="text-[#35191C]">{order.customerPhone}</span>
            </div>
            {order.customerEmail && (
              <div className="flex gap-2">
                <span className="text-[#6F4A4A] w-24 flex-shrink-0 font-medium text-xs uppercase tracking-wide">Email</span>
                <span className="text-[#35191C]">{order.customerEmail}</span>
              </div>
            )}
            <div className="flex gap-2">
              <span className="text-[#6F4A4A] w-24 flex-shrink-0 font-medium text-xs uppercase tracking-wide">Address</span>
              <span className="text-[#35191C]">{order.customerAddress}</span>
            </div>
            {order.notes && (
              <div className="flex gap-2">
                <span className="text-[#6F4A4A] w-24 flex-shrink-0 font-medium text-xs uppercase tracking-wide">Notes</span>
                <span className="text-[#35191C] italic">{order.notes}</span>
              </div>
            )}
            {order.razorpayPaymentId && (
              <div className="flex gap-2">
                <span className="text-[#6F4A4A] w-24 flex-shrink-0 font-medium text-xs uppercase tracking-wide">Payment ID</span>
                <span className="font-mono text-xs text-[#35191C]">{order.razorpayPaymentId}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Help Footer ── */}
        <div className="bg-white rounded-2xl border border-[#E8CFC5] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6F4A4A]">
          <p>Need help? Contact Keshar Jewellers support.</p>
          <a
            href="https://wa.me/917987654321?text=Hi%2C%20I%20need%20help%20with%20my%20order%20${order.id}"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-sm transition-all"
          >
            <span>📲</span> WhatsApp Support
          </a>
        </div>

      </div>
    </div>
  );
}
