"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type ViewMode = "login" | "forgot_email" | "forgot_otp" | "success";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, forgotPassword, resetPassword } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/";
  const noticeMsg = searchParams.get("msg");

  // Login form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot password flow states
  const [viewMode, setViewMode] = useState<ViewMode>("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push(redirectUrl);
    } else {
      setError(res.error || "Invalid credentials. Please try again.");
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccessMsg(null);

    if (!forgotEmail.trim()) {
      setForgotError("Please enter your email address.");
      return;
    }

    setForgotLoading(true);
    const res = await forgotPassword(forgotEmail);
    setForgotLoading(false);

    if (res.success) {
      setForgotSuccessMsg(res.message || "OTP code has been sent to your email!");
      setViewMode("forgot_otp");
    } else {
      setForgotError(res.error || "Failed to send reset code. Please check your email.");
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccessMsg(null);

    if (!otp.trim()) {
      setForgotError("Please enter the 6-digit OTP code sent to your email.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setForgotError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match.");
      return;
    }

    setForgotLoading(true);
    const res = await resetPassword(forgotEmail, otp, newPassword);
    setForgotLoading(false);

    if (res.success) {
      setForgotSuccessMsg(res.message || "Password reset successfully! You can now log in.");
      setViewMode("success");
    } else {
      setForgotError(res.error || "Failed to reset password. Invalid or expired OTP.");
    }
  };

  const signupLinkWithRedirect = `/signup?redirect=${encodeURIComponent(redirectUrl)}${noticeMsg ? `&msg=${encodeURIComponent(noticeMsg)}` : ""}`;

  return (
    <div className="min-h-[85vh] bg-[#FFF8F0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_rgba(124,27,42,0.08)] border border-[#E8CFC5]">
        
        {/* Header Branding */}
        <div className="text-center">
          <span className="text-[#D4AF37] text-2xl font-serif">✦ 💎 ✦</span>
          <h2 className="mt-3 text-3xl font-serif font-bold text-[#7C1B2A] tracking-wide">
            {viewMode === "login" && "Welcome Back"}
            {viewMode === "forgot_email" && "Forgot Password?"}
            {viewMode === "forgot_otp" && "Verify OTP & Reset"}
            {viewMode === "success" && "Password Reset Complete!"}
          </h2>
          <p className="mt-2 text-sm text-[#6F4A4A]">
            {viewMode === "login" && "Sign in to access your saved jewellery, wishlist & orders"}
            {viewMode === "forgot_email" && "Enter your registered email to receive a 6-digit verification code"}
            {viewMode === "forgot_otp" && `Enter the 6-digit code sent to ${forgotEmail}`}
            {viewMode === "success" && "Your password has been successfully updated. You can now log in!"}
          </p>
        </div>

        {/* Notice Message Banner */}
        {noticeMsg && viewMode === "login" && (
          <div className="bg-[#FFF0EA] border border-[#D4AF37]/50 text-[#7C1B2A] px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-xs animate-fadeIn">
            <span className="text-lg">🔒</span>
            <span>{noticeMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && viewMode === "login" && (
          <div className="bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C] px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0 text-[#C81E1E]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Forgot Password Error Alert */}
        {forgotError && viewMode !== "login" && (
          <div className="bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C] px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0 text-[#C81E1E]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{forgotError}</span>
          </div>
        )}

        {/* Forgot Password Success Info Alert */}
        {forgotSuccessMsg && viewMode !== "login" && (
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <span className="text-lg">✉️</span>
            <span>{forgotSuccessMsg}</span>
          </div>
        )}

        {/* --- VIEW 1: NORMAL LOGIN FORM --- */}
        {viewMode === "login" && (
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input suppressHydrationWarning
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] placeholder-[#6F4A4A]/50 focus:outline-none focus:border-[#7C1B2A] focus:ring-1 focus:ring-[#7C1B2A] transition-all"
                />
                <span className="absolute right-3.5 top-3.5 text-[#D4AF37]">✉️</span>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C]">
                  Password
                </label>
                <button suppressHydrationWarning
                  type="button"
                  onClick={() => {
                    setForgotError(null);
                    setForgotSuccessMsg(null);
                    setForgotEmail(email); // Autofill from email field if typed
                    setViewMode("forgot_email");
                  }}
                  className="text-xs font-semibold text-[#7C1B2A] hover:text-[#D4AF37] hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input suppressHydrationWarning
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] placeholder-[#6F4A4A]/50 focus:outline-none focus:border-[#7C1B2A] focus:ring-1 focus:ring-[#7C1B2A] transition-all pr-12"
                />
                <button suppressHydrationWarning
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-xs font-medium text-[#7C1B2A] hover:underline focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button suppressHydrationWarning
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] font-semibold text-sm rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <span>Sign In to Your Account</span>
                  <span className="text-[#D4AF37]">→</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* --- VIEW 2: FORGOT PASSWORD - STEP 1 (ENTER EMAIL) --- */}
        {viewMode === "forgot_email" && (
          <form className="mt-6 space-y-5" onSubmit={handleSendOtp}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <input suppressHydrationWarning
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] placeholder-[#6F4A4A]/50 focus:outline-none focus:border-[#7C1B2A] focus:ring-1 focus:ring-[#7C1B2A] transition-all"
                />
                <span className="absolute right-3.5 top-3.5 text-[#D4AF37]">✉️</span>
              </div>
            </div>

            <button suppressHydrationWarning
              type="submit"
              disabled={forgotLoading}
              className="w-full py-3.5 px-4 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] font-semibold text-sm rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {forgotLoading ? (
                <span>Sending OTP Code...</span>
              ) : (
                <>
                  <span>Send OTP Code via Email</span>
                  <span className="text-[#D4AF37]">✉️</span>
                </>
              )}
            </button>

            <button suppressHydrationWarning
              type="button"
              onClick={() => setViewMode("login")}
              className="w-full text-center text-xs font-semibold text-[#6F4A4A] hover:text-[#7C1B2A] transition-colors py-1"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* --- VIEW 3: FORGOT PASSWORD - STEP 2 (ENTER OTP & NEW PASSWORD) --- */}
        {viewMode === "forgot_otp" && (
          <form className="mt-6 space-y-5" onSubmit={handleResetPasswordSubmit}>
            {/* OTP Code Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1.5">
                6-Digit Verification Code (OTP)
              </label>
              <input suppressHydrationWarning
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full px-4 py-3 text-center tracking-[8px] text-lg font-bold rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-[#7C1B2A] placeholder-[#6F4A4A]/30 focus:outline-none focus:border-[#7C1B2A] focus:ring-1 focus:ring-[#7C1B2A] transition-all"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input suppressHydrationWarning
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] placeholder-[#6F4A4A]/50 focus:outline-none focus:border-[#7C1B2A] focus:ring-1 focus:ring-[#7C1B2A] transition-all pr-12"
                />
                <button suppressHydrationWarning
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-3 text-xs font-medium text-[#7C1B2A] hover:underline focus:outline-none"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1.5">
                Confirm New Password
              </label>
              <input suppressHydrationWarning
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-3 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] placeholder-[#6F4A4A]/50 focus:outline-none focus:border-[#7C1B2A] focus:ring-1 focus:ring-[#7C1B2A] transition-all"
              />
            </div>

            <button suppressHydrationWarning
              type="submit"
              disabled={forgotLoading}
              className="w-full py-3.5 px-4 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] font-semibold text-sm rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {forgotLoading ? (
                <span>Resetting Password...</span>
              ) : (
                <>
                  <span>Reset Password</span>
                  <span className="text-[#D4AF37]">✨</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2 text-xs font-semibold">
              <button suppressHydrationWarning
                type="button"
                onClick={() => setViewMode("forgot_email")}
                className="text-[#6F4A4A] hover:text-[#7C1B2A] transition-colors"
              >
                ← Change Email
              </button>
              <button suppressHydrationWarning
                type="button"
                onClick={handleSendOtp}
                disabled={forgotLoading}
                className="text-[#7C1B2A] hover:text-[#D4AF37] hover:underline transition-colors"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* --- VIEW 4: SUCCESS CONFIRMATION --- */}
        {viewMode === "success" && (
          <div className="mt-6 space-y-6 text-center">
            <div className="w-16 h-16 bg-[#FFF0EA] border-2 border-[#D4AF37] rounded-full flex items-center justify-center mx-auto text-2xl text-[#7C1B2A]">
              ✓
            </div>
            <p className="text-sm text-[#35191C] font-medium">
              Your password has been changed successfully. You can now log in with your new credentials.
            </p>

            <button suppressHydrationWarning
              type="button"
              onClick={() => {
                setEmail(forgotEmail);
                setPassword("");
                setViewMode("login");
              }}
              className="w-full py-3.5 px-4 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] font-semibold text-sm rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Back to Sign In</span>
              <span className="text-[#D4AF37]">→</span>
            </button>
          </div>
        )}

        {/* Footer Link to Signup */}
        {viewMode === "login" && (
          <div className="text-center pt-4 border-t border-[#E8CFC5]/60">
            <p className="text-sm text-[#6F4A4A]">
              Don&apos;t have an account yet?{" "}
              <Link
                href={signupLinkWithRedirect}
                className="font-bold text-[#7C1B2A] hover:text-[#D4AF37] transition-colors"
              >
                Create New Account
              </Link>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] bg-[#FFF8F0] flex items-center justify-center">
        <div className="animate-spin text-[#7C1B2A] text-2xl">💎</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
