"use client";

import React, { useState } from "react";
import { createRazorpayOrderApi, verifyRazorpayPaymentApi } from "@/lib/api";

export interface CheckoutItem {
  productId?: string;
  productName: string;
  category?: string;
  quantity: number;
  price: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CheckoutItem[];
  totalAmount: number;
  onSuccess?: () => void;
}

// Dynamically load Razorpay SDK script
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  totalAmount,
  onSuccess,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  if (!isOpen) return null;

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setErrorMsg("Please fill in your Name, Phone Number, and Shipping Address.");
      return;
    }

    setLoading(true);

    try {
      // 1. Ensure Razorpay script loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setErrorMsg("Failed to load Razorpay payment gateway. Please check your network connection.");
        setLoading(false);
        return;
      }

      // 2. Call backend to create Razorpay Order
      const res = await createRazorpayOrderApi(totalAmount);
      if (!res || !res.success || !res.orderId) {
        setErrorMsg(res?.error || "Failed to initiate Razorpay order. Please try again.");
        setLoading(false);
        return;
      }

      const razorpayKey =
        res.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1234567890abcdef";

      // 3. Open Razorpay Payment Window
      const options = {
        key: razorpayKey,
        amount: res.amount,
        currency: res.currency || "INR",
        name: "Keshar Jewellers 💎",
        description: `Purchase of ${items.length} ${items.length === 1 ? "Jewellery item" : "items"}`,
        image: "https://my-jewellery-backend.onrender.com/uploads/logo.png",
        order_id: res.orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: "#7C1B2A",
        },
        handler: async function (response: any) {
          try {
            setLoading(true);
            const verifyRes = await verifyRazorpayPaymentApi({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerName,
              customerPhone,
              customerEmail,
              customerAddress,
              items,
              totalAmount,
              notes,
            });

            if (verifyRes && verifyRes.success) {
              setPaymentSuccess(true);
              setConfirmedOrder(verifyRes.order);
              if (onSuccess) onSuccess();
            } else {
              setErrorMsg(verifyRes?.error || "Payment signature verification failed.");
            }
          } catch (err: any) {
            setErrorMsg(err.message || "Error verifying payment signature.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFF8F0] border border-[#E8CFC5] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#7C1B2A] text-[#FFF8F0] px-6 py-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <h2 className="font-serif text-xl font-bold tracking-wide">
              {paymentSuccess ? "Payment Successful! 🎉" : "Razorpay Checkout"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#FFF8F0]/80 hover:text-white text-2xl font-bold transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {paymentSuccess ? (
            /* Success Screen */
            <div className="text-center space-y-4 py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#E8F5E9] border-2 border-[#2E7D32] flex items-center justify-center text-4xl shadow-inner animate-bounce">
                ✅
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-[#7C1B2A]">
                  Payment Confirmed!
                </h3>
                <p className="text-xs text-[#6F4A4A]">
                  Thank you, <strong>{customerName}</strong>! Your order has been placed successfully.
                </p>
              </div>

              {/* Order Details Receipt Box */}
              <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-2xl p-4 text-left text-xs space-y-2 text-[#35191C]">
                <div className="flex justify-between border-b border-[#E8CFC5]/60 pb-2">
                  <span className="text-[#6F4A4A]">Order ID:</span>
                  <span className="font-mono font-bold text-[#7C1B2A]">{confirmedOrder?.id || "Saved"}</span>
                </div>
                <div className="flex justify-between border-b border-[#E8CFC5]/60 pb-2">
                  <span className="text-[#6F4A4A]">Razorpay Payment ID:</span>
                  <span className="font-mono font-semibold">{confirmedOrder?.razorpayPaymentId || "Verified"}</span>
                </div>
                <div className="flex justify-between border-b border-[#E8CFC5]/60 pb-2">
                  <span className="text-[#6F4A4A]">Total Paid:</span>
                  <span className="font-serif text-base font-bold text-[#2E7D32]">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-[#6F4A4A] block mb-1">Delivering to:</span>
                  <span className="font-medium text-[11px] block text-[#35191C]">
                    {customerAddress}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                Close & Continue Shopping
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handlePayNow} className="space-y-4">
              
              {/* Order Items Summary */}
              <div className="bg-[#FFF0EA] border border-[#E8CFC5] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs border-b border-[#E8CFC5]/60 pb-2 font-bold text-[#7C1B2A]">
                  <span>Order Summary ({items.length} {items.length === 1 ? "Item" : "Items"})</span>
                  <span className="font-serif text-base">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] text-[#35191C]">
                      <span className="truncate max-w-[200px]">
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error Notification */}
              {errorMsg && (
                <div className="bg-[#FDF2F2] border border-[#F8B4B4] text-[#C81E1E] px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Customer Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#35191C] mb-1">
                    Full Name <span className="text-[#C81E1E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8CFC5] rounded-xl text-xs text-[#35191C] focus:outline-none focus:ring-2 focus:ring-[#7C1B2A]/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#35191C] mb-1">
                      Phone Number <span className="text-[#C81E1E]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8CFC5] rounded-xl text-xs text-[#35191C] focus:outline-none focus:ring-2 focus:ring-[#7C1B2A]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#35191C] mb-1">
                      Email Address <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8CFC5] rounded-xl text-xs text-[#35191C] focus:outline-none focus:ring-2 focus:ring-[#7C1B2A]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#35191C] mb-1">
                    Shipping Address <span className="text-[#C81E1E]">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="House/Flat No., Street, Landmark, City, State, Pincode"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#E8CFC5] rounded-xl text-xs text-[#35191C] focus:outline-none focus:ring-2 focus:ring-[#7C1B2A]/40 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#35191C] mb-1">
                    Special Notes / Gift Instructions <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ring size 14, Gift wrap requested"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8CFC5] rounded-xl text-xs text-[#35191C] focus:outline-none focus:ring-2 focus:ring-[#7C1B2A]/40"
                  />
                </div>
              </div>

              {/* Submit / Pay Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#7C1B2A] hover:bg-[#5C131F] disabled:opacity-50 text-[#FFF8F0] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Processing Gateway...</span>
                    </>
                  ) : (
                    <>
                      <span>🔒 Pay ₹{totalAmount.toLocaleString("en-IN")} via Razorpay</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-[#6F4A4A] text-center italic">
                🔒 Secured by 256-Bit Razorpay Payment Gateway (UPI, Cards, NetBanking, Wallets)
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
