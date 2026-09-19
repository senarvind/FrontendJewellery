"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { searchOrdersApi } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, logout, isLoading } = useAuth();

  // Personal Info Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [infoMessage, setInfoMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [updatingInfo, setUpdatingInfo] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // User Orders State
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");

      // Fetch user orders by email or phone
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const query = user.email || user.phone || user.name;
          let orders = await searchOrdersApi(query);

          // Merge with local storage orders
          try {
            const local = localStorage.getItem("kj_user_orders");
            if (local) {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed)) {
                const map = new Map();
                [...orders, ...parsed].forEach((o) => map.set(o.id, o));
                orders = Array.from(map.values());
              }
            }
          } catch (e) {
            // ignore parse error
          }

          setUserOrders(orders);
        } catch (e) {
          console.warn("Could not fetch user orders", e);
        } finally {
          setLoadingOrders(false);
        }
      };

      fetchOrders();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-[#7C1B2A] rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-serif text-[#7C1B2A]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[75vh] bg-[#FFF8F0] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border border-[#E8CFC5] shadow-lg space-y-6">
          <div className="text-4xl">👑</div>
          <h2 className="text-2xl font-serif font-bold text-[#7C1B2A]">Access Restricted</h2>
          <p className="text-sm text-[#6F4A4A]">
            Please sign in to your Keshar Jewellers account to view and manage your profile.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] text-sm font-semibold rounded-xl transition-all shadow-md"
            >
              Sign In Now
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 bg-[#FFF0EA] hover:bg-[#FFE2D8] text-[#7C1B2A] text-sm font-semibold rounded-xl transition-all border border-[#E8CFC5]"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMessage(null);

    if (!name.trim()) {
      setInfoMessage({ type: "error", text: "Full Name cannot be empty." });
      return;
    }

    setUpdatingInfo(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();
      if (data.success) {
        setInfoMessage({ type: "success", text: "Profile information updated successfully! ✨" });
        window.location.reload(); // Refresh session to reflect changes
      } else {
        setInfoMessage({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch {
      setInfoMessage({ type: "error", text: "Something went wrong while updating profile." });
    } finally {
      setUpdatingInfo(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordMessage({ type: "error", text: "Please fill in all password fields." });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setPasswordMessage({ type: "success", text: "Password changed successfully! 🔐" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setPasswordMessage({ type: "error", text: data.error || "Failed to change password." });
      }
    } catch {
      setPasswordMessage({ type: "error", text: "Something went wrong while updating password." });
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Profile Banner / Welcome Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8CFC5] shadow-[0_15px_40px_rgba(124,27,42,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDE8E9] rounded-full blur-2xl -z-0 opacity-60"></div>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar Badge */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#7C1B2A] to-[#B82E44] text-[#FFF8F0] text-3xl font-serif font-bold flex items-center justify-center border-4 border-[#FFF8F0] shadow-md flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#7C1B2A]">
                  {user.name}
                </h1>
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider self-center sm:self-auto ${
                  user.role === "admin"
                    ? "bg-[#7C1B2A] text-[#E6C766]"
                    : "bg-[#FFF0EA] text-[#7C1B2A] border border-[#E8CFC5]"
                }`}>
                  {user.role === "admin" ? "👑 Store Admin" : "✦ Customer"}
                </span>
              </div>
              <p className="text-sm text-[#6F4A4A] flex items-center justify-center sm:justify-start gap-1.5">
                <span>✉️</span> <span>{user.email}</span>
              </p>
              {user.phone && (
                <p className="text-sm text-[#6F4A4A] flex items-center justify-center sm:justify-start gap-1.5">
                  <span>📞</span> <span>{user.phone}</span>
                </p>
              )}
            </div>

            {/* Admin Action shortcut */}
            {user.role === "admin" && (
              <a
                href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>👑 Open Admin Panel ↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Orders Shortcut Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8CFC5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0EA] border border-[#E8CFC5] flex items-center justify-center text-2xl flex-shrink-0">
              📦
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#7C1B2A]">
                My Orders & Live Tracking
              </h2>
              <p className="text-xs text-[#6F4A4A]">
                Track current jewellery orders, view delivery progress, or cancel within 3 hours
              </p>
            </div>
          </div>
          <Link
            href="/orders"
            className="px-6 py-3 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 flex-shrink-0"
          >
            <span>View All Orders →</span>
          </Link>
        </div>

        {/* Two Column Section: Info Edit & Password Change */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Edit Personal Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8CFC5] shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E8CFC5]/60">
              <span className="text-[#D4AF37] text-xl">👤</span>
              <h2 className="text-xl font-serif font-bold text-[#7C1B2A]">
                Personal Information
              </h2>
            </div>

            {infoMessage && (
              <div className={`p-3 rounded-xl text-xs font-medium ${
                infoMessage.type === "success"
                  ? "bg-[#EDFDF5] text-[#065F46] border border-[#A7F3D0]"
                  : "bg-[#FDF2F2] text-[#9B1C1C] border border-[#F8B4B4]"
              }`}>
                {infoMessage.text}
              </div>
            )}

            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] focus:outline-none focus:border-[#7C1B2A] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1">
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8CFC5]/60 bg-[#F7F4F0] text-sm text-[#6F4A4A] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] focus:outline-none focus:border-[#7C1B2A] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={updatingInfo}
                className="w-full py-3 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] font-semibold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                {updatingInfo ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </form>
          </div>

          {/* Card 2: Security & Password */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8CFC5] shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E8CFC5]/60">
              <span className="text-[#D4AF37] text-xl">🔐</span>
              <h2 className="text-xl font-serif font-bold text-[#7C1B2A]">
                Security & Password
              </h2>
            </div>

            {passwordMessage && (
              <div className={`p-3 rounded-xl text-xs font-medium ${
                passwordMessage.type === "success"
                  ? "bg-[#EDFDF5] text-[#065F46] border border-[#A7F3D0]"
                  : "bg-[#FDF2F2] text-[#9B1C1C] border border-[#F8B4B4]"
              }`}>
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] focus:outline-none focus:border-[#7C1B2A] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1">
                  New Password (Min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] focus:outline-none focus:border-[#7C1B2A] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] focus:outline-none focus:border-[#7C1B2A] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="w-full py-3 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] font-semibold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                {updatingPassword ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </div>

        </div>

        {/* Section: My Orders & Shipment Tracking */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8CFC5] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8CFC5]/60">
            <div className="flex items-center gap-2">
              <span className="text-[#D4AF37] text-2xl">🚚</span>
              <div>
                <h2 className="text-xl font-serif font-bold text-[#7C1B2A]">
                  My Orders & Live Tracking
                </h2>
                <p className="text-xs text-[#6F4A4A]">View recent purchases and live courier status</p>
              </div>
            </div>

            <Link
              href="/orders"
              className="px-4 py-2 bg-[#FFF0EA] hover:bg-[#FFE2D8] text-[#7C1B2A] border border-[#E8CFC5] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <span>🔍 Track by Order ID</span>
              <span>→</span>
            </Link>
          </div>

          {loadingOrders ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-[#7C1B2A] rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-[#6F4A4A]">Loading your orders...</p>
            </div>
          ) : userOrders.length > 0 ? (
            <div className="divide-y divide-[#E8CFC5]/50">
              {userOrders.map((order) => (
                <div key={order.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-[#7C1B2A]">
                        Order #{order.id.substring(0, 10)}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === "delivered"
                          ? "bg-[#E8F5E9] text-[#2E7D32]"
                          : order.status === "shipped"
                          ? "bg-[#EBF5FF] text-[#1E40AF]"
                          : "bg-[#FFF0EA] text-[#7C1B2A]"
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#6F4A4A]">
                      {order.items?.length || 1} {order.items?.length === 1 ? "Item" : "Items"} • Total: <strong className="text-[#35191C]">₹{order.totalAmount?.toLocaleString("en-IN")}</strong>
                    </p>
                    <p className="text-[11px] text-[#6F4A4A]/80">
                      Date: {new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="px-4 py-2 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] text-xs font-bold rounded-xl transition-all shadow-sm text-center self-start sm:self-auto flex items-center gap-1.5"
                  >
                    <span>Track Status</span>
                    <span>→</span>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-3 bg-[#FFFBF7] rounded-2xl border border-[#E8CFC5]/60 p-6">
              <span className="text-3xl block">🛍️</span>
              <p className="text-xs text-[#6F4A4A] font-semibold">No recent orders found for {user.name}.</p>
              <p className="text-[11px] text-[#6F4A4A]/80 max-w-xs mx-auto">
                Once you purchase jewellery items, your orders and live shipment status will appear here.
              </p>
              <div className="pt-1">
                <Link
                  href="/products/all"
                  className="inline-block px-4 py-2 bg-[#7C1B2A] text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Start Shopping Now
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Footer Actions */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8CFC5] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-semibold text-[#7C1B2A] hover:underline flex items-center gap-1"
            >
              <span>← Back to Home</span>
            </Link>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="px-5 py-2.5 bg-[#FDF2F2] hover:bg-[#FCE8E8] text-[#9B1C1C] text-xs font-bold rounded-xl border border-[#F8B4B4] transition-all"
          >
            🚪 Sign Out of Account
          </button>
        </div>

      </div>
    </div>
  );
}
