"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await signup(name, email, password, phone);
    setLoading(false);

    if (res.success) {
      router.push("/");
    } else {
      setError(res.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FFF8F0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_rgba(124,27,42,0.08)] border border-[#E8CFC5]">
        
        {/* Header Branding */}
        <div className="text-center">
          <span className="text-[#D4AF37] text-2xl font-serif">✦ 👑 ✦</span>
          <h2 className="mt-3 text-3xl font-serif font-bold text-[#7C1B2A] tracking-wide">
            Join Keshar Jewellers
          </h2>
          <p className="mt-2 text-sm text-[#6F4A4A]">
            Create an account to explore hallmark certified gold & silver jewellery
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C] px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0 text-[#C81E1E]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] placeholder-[#6F4A4A]/50 focus:outline-none focus:border-[#7C1B2A] focus:ring-1 focus:ring-[#7C1B2A] transition-all"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] placeholder-[#6F4A4A]/50 focus:outline-none focus:border-[#7C1B2A] focus:ring-1 focus:ring-[#7C1B2A] transition-all"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1">
              Mobile Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] placeholder-[#6F4A4A]/50 focus:outline-none focus:border-[#7C1B2A] focus:ring-1 focus:ring-[#7C1B2A] transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1">
              Password * (Min 6 characters)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] placeholder-[#6F4A4A]/50 focus:outline-none focus:border-[#7C1B2A] focus:ring-1 focus:ring-[#7C1B2A] transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-xs font-medium text-[#7C1B2A] hover:underline focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#35191C] mb-1">
              Confirm Password *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] placeholder-[#6F4A4A]/50 focus:outline-none focus:border-[#7C1B2A] focus:ring-1 focus:ring-[#7C1B2A] transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#7C1B2A] hover:bg-[#5C131F] text-[#FFF8F0] font-semibold text-sm rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create Your Account</span>
                <span className="text-[#D4AF37]">✨</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="text-center pt-4 border-t border-[#E8CFC5]/60">
          <p className="text-sm text-[#6F4A4A]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#7C1B2A] hover:text-[#D4AF37] transition-colors"
            >
              Sign In Here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
