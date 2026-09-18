"use client";

import React, { useState, useEffect } from "react";
import OrderTimeline, { TrackingData } from "./OrderTimeline";
import { getOrderTrackingApi } from "@/lib/api";

export interface OrderItem {
  productId?: string;
  productName: string;
  category?: string;
  quantity: number;
  price: number;
}

export interface OrderData {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  paymentStatus?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  notes?: string;
  createdAt: string;
}

interface OrderTrackerCardProps {
  order: OrderData;
}

export default function OrderTrackerCard({ order }: OrderTrackerCardProps) {
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loadingTracking, setLoadingTracking] = useState(false);

  useEffect(() => {
    if (order?.id) {
      const fetchTracking = async () => {
        setLoadingTracking(true);
        try {
          const res = await getOrderTrackingApi(order.id);
          if (res) {
            setTracking(res);
          }
        } catch (e) {
          console.warn("Could not load backend tracking details for order", order.id);
        } finally {
          setLoadingTracking(false);
        }
      };

      fetchTracking();
    }
  }, [order?.id]);

  const createdDate = new Date(order.createdAt || Date.now());
  const formattedDate = createdDate.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate estimated delivery date (5 days after creation)
  const estDeliveryDate = new Date(createdDate.getTime() + 5 * 24 * 60 * 60 * 1000);
  const formattedEstDelivery = tracking?.estimatedDelivery || estDeliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "delivered") {
      return (
        <span className="bg-[#E8F5E9] text-[#2E7D32] border border-[#A7F3D0] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <span>📦</span> <span>Delivered</span>
        </span>
      );
    }
    if (s === "shipped" || s === "out_for_delivery") {
      return (
        <span className="bg-[#EBF5FF] text-[#1E40AF] border border-[#BFDBFE] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <span>🚚</span> <span>In Transit / Shipped</span>
        </span>
      );
    }
    if (s === "confirmed" || s === "quality_checked") {
      return (
        <span className="bg-[#FFF8E1] text-[#B45309] border border-[#FDE68A] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <span>💎</span> <span>Confirmed & Quality Check</span>
        </span>
      );
    }
    if (s === "cancelled") {
      return (
        <span className="bg-[#FDF2F2] text-[#9B1C1C] border border-[#F8B4B4] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <span>❌</span> <span>Cancelled</span>
        </span>
      );
    }
    return (
      <span className="bg-[#FFF0EA] text-[#7C1B2A] border border-[#E8CFC5] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
        <span>⏳</span> <span>Pending Approval</span>
      </span>
    );
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8CFC5] shadow-[0_15px_40px_rgba(124,27,42,0.08)] overflow-hidden transition-all duration-300">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#7C1B2A] via-[#8B1E2D] to-[#5C131F] text-[#FFF8F0] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">✨</span>
            <span className="text-xs uppercase tracking-[0.2em] text-[#E6C766] font-bold">
              Official Order &amp; Courier Tracker
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide flex items-center gap-2">
            <span>Order #{order.id.substring(0, 10)}</span>
          </h2>
          <p className="text-xs text-[#FFC7B8] mt-1">
            Placed on {formattedDate}
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2">
          {getStatusBadge(tracking?.currentStatus || order.status)}
          <span className="text-[11px] text-[#FFC7B8] font-medium">
            Estimated Delivery: <strong className="text-white font-bold">{formattedEstDelivery}</strong>
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 space-y-8">

        {/* Live Courier Details Chip */}
        <div className="bg-[#FFF0EA] border border-[#E8CFC5] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#7C1B2A] text-white font-bold flex items-center justify-center text-base">
              🚚
            </div>
            <div>
              <p className="font-bold text-[#7C1B2A]">
                Courier Partner: <span className="text-[#35191C]">{tracking?.courierPartner || "BlueDart Express Insured"}</span>
              </p>
              <p className="text-[11px] text-[#6F4A4A]">
                AWB Tracking Number: <strong className="font-mono text-[#7C1B2A]">{tracking?.trackingNumber || `KJ-BD-${order.id.slice(-6).toUpperCase()}`}</strong>
              </p>
            </div>
          </div>

          {tracking?.currentLocation && (
            <div className="text-left sm:text-right bg-white/80 px-3 py-1.5 rounded-xl border border-[#E8CFC5]/60">
              <span className="text-[10px] text-[#6F4A4A] block">Current Location</span>
              <span className="font-bold text-[#35191C]">{tracking.currentLocation}</span>
            </div>
          )}
        </div>

        {/* Live Admin Message / Checkpoint Note */}
        {tracking?.history && tracking.history.length > 0 && tracking.history[tracking.history.length - 1].description && (
          <div className="bg-[#FFF8F0] border-l-4 border-[#7C1B2A] rounded-r-2xl p-4 shadow-sm flex items-start gap-3">
            <div className="text-xl mt-0.5">💬</div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C1B2A] block mb-1">
                Message from Keshar Jewellers
              </span>
              <p className="text-sm text-[#35191C] font-medium leading-relaxed">
                {tracking.history[tracking.history.length - 1].description}
              </p>
            </div>
          </div>
        )}

        {/* 1. Visual Status Stepper Timeline */}
        <div className="bg-[#FFFBF7] p-6 rounded-2xl border border-[#E8CFC5]">
          <OrderTimeline status={order.status} createdAt={order.createdAt} trackingData={tracking} />
        </div>

        {/* 2. Customer & Delivery Address Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address Box */}
          <div className="bg-[#FFF0EA]/60 p-5 rounded-2xl border border-[#E8CFC5] space-y-2">
            <div className="flex items-center gap-2 text-[#7C1B2A] font-bold text-xs uppercase tracking-wider">
              <span>📍</span> Shipping Address
            </div>
            <p className="font-serif text-base font-bold text-[#35191C]">
              {order.customerName}
            </p>
            <p className="text-xs text-[#6F4A4A] leading-relaxed">
              {order.customerAddress}
            </p>
            <div className="pt-2 text-xs text-[#35191C] space-y-1">
              <p>📞 Phone: <strong>{order.customerPhone}</strong></p>
              {order.customerEmail && <p>✉️ Email: <strong>{order.customerEmail}</strong></p>}
            </div>
          </div>

          {/* Payment & Order Summary Box */}
          <div className="bg-[#FFF0EA]/60 p-5 rounded-2xl border border-[#E8CFC5] space-y-3">
            <div className="flex items-center gap-2 text-[#7C1B2A] font-bold text-xs uppercase tracking-wider">
              <span>💳</span> Payment Information
            </div>
            <div className="space-y-2 text-xs text-[#35191C]">
              <div className="flex justify-between border-b border-[#E8CFC5]/60 pb-1.5">
                <span className="text-[#6F4A4A]">Payment Method:</span>
                <span className="font-semibold capitalize">{order.paymentMethod || "Razorpay Gateway"}</span>
              </div>
              <div className="flex justify-between border-b border-[#E8CFC5]/60 pb-1.5">
                <span className="text-[#6F4A4A]">Payment Status:</span>
                <span className="font-semibold text-[#2E7D32] capitalize">
                  {order.paymentStatus || "Paid Online"}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex justify-between border-b border-[#E8CFC5]/60 pb-1.5 font-mono text-[11px]">
                  <span className="text-[#6F4A4A]">Razorpay Txn ID:</span>
                  <span className="font-bold text-[#7C1B2A]">{order.razorpayPaymentId}</span>
                </div>
              )}
              {order.notes && (
                <div className="pt-1">
                  <span className="text-[#6F4A4A] block mb-0.5 font-semibold">Order Instructions:</span>
                  <span className="italic text-[11px] text-[#6F4A4A] block bg-white/70 p-2 rounded-lg border border-[#E8CFC5]/40">
                    "{order.notes}"
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Items Purchased Table */}
        <div className="space-y-3">
          <h3 className="font-serif text-lg font-bold text-[#7C1B2A] flex items-center gap-2">
            <span>💍</span> Purchased Items ({order.items?.length || 0})
          </h3>

          <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-2xl overflow-hidden divide-y divide-[#E8CFC5]/50">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FFF0EA]/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FFE2D8] border border-[#E8CFC5] flex items-center justify-center text-xl flex-shrink-0">
                      💎
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#35191C]">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-[#6F4A4A] capitalize">
                        {item.category ? `Category: ${item.category}` : "Authentic BIS Hallmarked Gold/Silver"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-[#35191C]">
                    <span className="text-[#6F4A4A]">
                      Qty: <strong>{item.quantity}</strong>
                    </span>
                    <span className="text-[#6F4A4A]">
                      Price: <strong>₹{item.price?.toLocaleString("en-IN")}</strong>
                    </span>
                    <span className="font-serif text-sm font-bold text-[#7C1B2A]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-xs text-[#6F4A4A] italic text-center">No items listed in order</p>
            )}

            {/* Total Calculation Row */}
            <div className="p-4 bg-[#FFF0EA] flex items-center justify-between font-serif text-base font-bold text-[#7C1B2A]">
              <span>Total Amount Paid:</span>
              <span className="text-xl text-[#2E7D32]">₹{order.totalAmount?.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* 4. Support & Action Bar */}
        <div className="pt-4 border-t border-[#E8CFC5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="tel:+919827415111"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#FFF0EA] hover:bg-[#FFE2D8] text-[#7C1B2A] border border-[#E8CFC5] rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>📞</span> Call Support
            </a>
            <a
              href={`https://wa.me/919827415111?text=${encodeURIComponent(`Hello Keshar Jewellers, I am tracking Order ID #${order.id} (Tracking AWB: ${tracking?.trackingNumber || "N/A"}). Please update me on delivery status.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#25D366] hover:bg-[#20BE5C] text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>💬</span> WhatsApp Query
            </a>
          </div>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <span>🖨️</span> Print Order Invoice
          </button>
        </div>

      </div>
    </div>
  );
}
