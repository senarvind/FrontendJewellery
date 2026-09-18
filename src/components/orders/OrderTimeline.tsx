"use client";

import React from "react";

export interface CheckpointLog {
  status: string;
  location?: string;
  description?: string;
  timestamp?: string | Date;
}

export interface TrackingData {
  trackingNumber?: string;
  courierPartner?: string;
  currentStatus?: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  history?: CheckpointLog[];
}

interface OrderTimelineProps {
  status: string; // 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt?: string;
  trackingData?: TrackingData | null;
}

export interface StatusStep {
  key: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
}

const TRACKING_STEPS: StatusStep[] = [
  {
    key: "placed",
    title: "Order Placed",
    subtitle: "Order Received",
    icon: "📝",
    description: "Your order details have been received & registered in our system.",
  },
  {
    key: "confirmed",
    title: "Payment Confirmed",
    subtitle: "Verified & Approved",
    icon: "💳",
    description: "Payment verified successfully via Razorpay / Bank confirmation.",
  },
  {
    key: "processing",
    title: "Hallmark & Quality Check",
    subtitle: "In Workshop",
    icon: "💎",
    description: "Jewellery team inspecting 22K/925 Hallmark certification & luxury gift packaging.",
  },
  {
    key: "shipped",
    title: "Shipped / In Transit",
    subtitle: "Handed to Courier",
    icon: "🚚",
    description: "Package dispatched via Insured Express Courier (BlueDart/SpeedPost).",
  },
  {
    key: "delivered",
    title: "Delivered",
    subtitle: "Handed to Customer",
    icon: "📦",
    description: "Jewellery safely delivered with authenticity certificate & seal.",
  },
];

export default function OrderTimeline({ status = "pending", createdAt, trackingData }: OrderTimelineProps) {
  const normStatus = (trackingData?.currentStatus || status).toLowerCase().trim();

  if (normStatus === "cancelled") {
    return (
      <div className="bg-[#FFF2F2] border border-[#F8B4B4] rounded-2xl p-5 text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#FDE8E8] text-[#C81E1E] flex items-center justify-center text-2xl font-bold">
          🚫
        </div>
        <h3 className="font-serif text-lg font-bold text-[#9B1C1C]">Order Cancelled</h3>
        <p className="text-xs text-[#7F1D1D] max-w-md mx-auto">
          This order has been cancelled. If you believe this is an error or need assistance with a refund, please contact our support team.
        </p>
      </div>
    );
  }

  // Determine current active step index (0 to 4)
  let activeIndex = 0;
  if (normStatus === "pending" || normStatus === "order_placed") activeIndex = 0;
  else if (normStatus === "confirmed" || normStatus === "payment_verified" || normStatus === "quality_checked") activeIndex = 2;
  else if (normStatus === "shipped" || normStatus === "out_for_delivery") activeIndex = 3;
  else if (normStatus === "delivered") activeIndex = 4;

  const createdDateObj = createdAt ? new Date(createdAt) : new Date();
  const formattedDate = createdDateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FFF0EA] p-4 rounded-2xl border border-[#E8CFC5]">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#7C1B2A] font-bold block mb-0.5">
            Live Shipment Tracker & Courier Checkpoints
          </span>
          <h4 className="font-serif text-base font-bold text-[#35191C] capitalize flex items-center gap-2">
            <span>Status:</span>
            <span className="text-[#7C1B2A]">
              {normStatus === "confirmed" || normStatus === "quality_checked"
                ? "Processing & Quality Check 💎"
                : normStatus === "shipped"
                ? "In Transit (BlueDart Courier) 🚚"
                : normStatus}
            </span>
          </h4>
          {trackingData?.currentLocation && (
            <p className="text-xs text-[#6F4A4A] mt-1 font-medium">
              📍 Current Location: <strong className="text-[#35191C]">{trackingData.currentLocation}</strong>
            </p>
          )}
        </div>
        <div className="text-right sm:text-right">
          <span className="text-[11px] text-[#6F4A4A] block">Placed On</span>
          <span className="text-xs font-bold text-[#35191C]">{formattedDate}</span>
          {trackingData?.trackingNumber && (
            <span className="text-[10px] font-mono block text-[#7C1B2A] font-bold mt-1">
              AWB: {trackingData.trackingNumber}
            </span>
          )}
        </div>
      </div>

      {/* Stepper Timeline for Desktop & Mobile */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E8CFC5] space-y-8 my-4 ml-2">
        {TRACKING_STEPS.map((step, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          // Map frontend step keys to backend status strings
          const statusMap: Record<string, string[]> = {
            placed: ["order_placed", "pending"],
            confirmed: ["payment_verified", "confirmed"],
            processing: ["quality_checked", "processing"],
            shipped: ["shipped", "out_for_delivery"],
            delivered: ["delivered"],
          };
          
          // Find the LATEST matching checkpoint in history (so newer updates overwrite old ones for the same step)
          const matchingCheckpoints = trackingData?.history?.filter(
            (h) => statusMap[step.key]?.some(s => h.status.toLowerCase().includes(s))
          ) || [];
          const matchingCheckpoint = matchingCheckpoints.length > 0 ? matchingCheckpoints[matchingCheckpoints.length - 1] : undefined;

          return (
            <div key={step.key} className="relative group">
              {/* Node Icon on Timeline */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all duration-300 ${
                  isDone
                    ? "bg-[#2E7D32] text-white ring-4 ring-[#E8F5E9]"
                    : isCurrent
                    ? "bg-[#7C1B2A] text-[#FFF8F0] ring-4 ring-[#FFE2D8] animate-pulse"
                    : "bg-[#F5EBE6] text-[#A08080] border border-[#E8CFC5]"
                }`}
              >
                {isDone ? "✓" : step.icon}
              </div>

              {/* Step Content Box */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? "bg-white border-[#7C1B2A]/40 shadow-md ring-1 ring-[#7C1B2A]/20"
                    : isDone
                    ? "bg-[#F8FAF8] border-[#A7F3D0]/60"
                    : "bg-[#FFFDFC]/50 border-[#E8CFC5]/40 opacity-70"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <h5
                      className={`font-serif text-sm font-bold ${
                        isCurrent
                          ? "text-[#7C1B2A]"
                          : isDone
                          ? "text-[#1E4620]"
                          : "text-[#6F4A4A]"
                      }`}
                    >
                      {step.title}
                    </h5>
                    {isCurrent && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#7C1B2A] text-white">
                        In Progress
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                        Completed
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-[#6F4A4A]">
                    {matchingCheckpoint?.location || step.subtitle}
                  </span>
                </div>

                <p className="text-xs text-[#6F4A4A] leading-relaxed">
                  {matchingCheckpoint?.description || step.description}
                </p>

                {matchingCheckpoint?.timestamp && (
                  <p className="text-[10px] text-[#A08080] mt-1 font-mono">
                    Updated: {new Date(matchingCheckpoint.timestamp).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Checkpoint History Logs */}
      {trackingData?.history && trackingData.history.length > 0 && (
        <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-2xl p-4 space-y-3 mt-6">
          <h5 className="font-serif text-xs font-bold text-[#7C1B2A] uppercase tracking-wider flex items-center gap-1.5">
            <span>📋</span> Detailed Checkpoint Activity Logs ({trackingData.history.length})
          </h5>
          <div className="divide-y divide-[#E8CFC5]/50 max-h-48 overflow-y-auto pr-1">
            {trackingData.history.map((log, i) => (
              <div key={i} className="py-2 text-xs flex justify-between items-start gap-3">
                <div>
                  <span className="font-semibold text-[#35191C] capitalize block">
                    {log.status.replace("_", " ")} – {log.location || "Hub"}
                  </span>
                  <span className="text-[11px] text-[#6F4A4A] block">
                    {log.description}
                  </span>
                </div>
                <span className="text-[10px] text-[#7C1B2A] font-mono whitespace-nowrap pt-0.5">
                  {new Date(log.timestamp || Date.now()).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
