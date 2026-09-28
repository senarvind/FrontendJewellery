"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const policySections = [
    {
      id: "hallmark",
      icon: "🛡️",
      title: "100% BIS Hallmark & Authenticity Policy",
      subtitle: "Government Certified Pure Gold & Silver Jewellery",
      badge: "BIS Reg: HM/C-8290497727",
      content: [
        {
          heading: "100% BIS Hallmarked Purity Guarantee",
          text: "Every piece of gold jewellery sold at Keshar Jewellers is 100% BIS Hallmarked (91.6 / 22K Gold and 75.0 / 18K Gold), adhering strictly to the Bureau of Indian Standards (BIS) regulations.",
        },
        {
          heading: "6-Digit Laser-Etched HUID Code",
          text: "Our gold ornaments feature a unique 6-digit HUID (Hallmark Unique Identification) code stamped by government-approved hallmarking centers, ensuring complete traceability and genuine gold purity.",
        },
        {
          heading: "Pure 92.5 Sterling Silver Stamp",
          text: "All silver ornaments, utensils, and gift articles carry an official 92.5 / 925 sterling silver purity stamp for guaranteed material authenticity and long-lasting shine.",
        },
        {
          heading: "Authenticity & Gemstone Certificate",
          text: "Every purchase includes an official Keshar Jewellers Authenticity Tax Invoice. Precious & semi-precious stones (Diamonds, Navratna, Rubies) come with certified lab test reports.",
        },
      ],
      highlights: [
        "Official BIS Registration Number: HM/C-8290497727",
        "Unique 6-digit HUID laser code on all gold items",
        "100% transparent purity testing on digital Karatometer",
      ],
    },
    {
      id: "exchange",
      icon: "🔄",
      title: "Lifetime Exchange & Buyback Policy",
      subtitle: "100% Transparent Metal Value & Maximum Worth Guarantee",
      badge: "Lifetime Guarantee",
      content: [
        {
          heading: "Lifetime Exchange (100% Net Weight Gold Value)",
          text: "Exchange your Keshar gold ornaments anytime for new designs. You receive 100% value of net gold weight based on the prevailing benchmark gold rate on the day of exchange.",
        },
        {
          heading: "Lifetime Buyback Option",
          text: "We offer lifetime cash/bank buyback at 95% of current market gold value and 90% of current silver value upon purity verification.",
        },
        {
          heading: "Valuation & Making Charges Terms",
          text: "Making charges, GST (3%), and stone weights are non-refundable during exchange or buyback, as per standard Indian jewellery industry guidelines.",
        },
        {
          heading: "Lab Purity & HUID Code Verification",
          text: "Returned or exchanged items undergo instant digital Karatometer purity testing and HUID code verification at our showroom to ensure authentic evaluation.",
        },
      ],
      highlights: [
        "100% net gold weight credit for Keshar Jewellery exchange",
        "95% Gold & 90% Silver Buyback cash value",
        "Hassle-free upgrade to latest festival and bridal designs",
      ],
    },
    {
      id: "shipping",
      icon: "📦",
      title: "100% Insured Shipping & OTP Delivery Policy",
      subtitle: "Fully Insured Transit & Secure OTP Verification at Doorstep",
      badge: "100% Insured Shipping",
      content: [
        {
          heading: "100% Insured Transit Protection",
          text: "Every parcel shipped by Keshar Jewellers is fully insured against damage, loss, or theft during transit. You have zero risk while your package is in transit.",
        },
        {
          heading: "Tamper-Evident Security Packaging",
          text: "Orders are shipped in double-sealed tamper-evident security boxes. If the outer barcode seal appears broken or tampered with, please refuse delivery immediately.",
        },
        {
          heading: "Mandatory OTP Verified Handover",
          text: "For your safety, the courier delivery agent will only hand over the parcel after verifying the One-Time Password (OTP) sent to your registered mobile number.",
        },
        {
          heading: "Delivery Timelines & Store Pickup",
          text: "Orders are dispatched within 24-48 hours. Delivery takes 3 to 7 business days across India. Customers can also choose free store pickup at Sarafa Bazar, Sehore (M.P.).",
        },
      ],
      highlights: [
        "100% transit insurance coverage on all parcels",
        "Mandatory OTP verification required from customer phone",
        "Tamper-evident double-sealed security box",
      ],
    },
    {
      id: "returns",
      icon: "🔁",
      title: "15-Day Return & Fraud-Proof Refund Policy",
      subtitle: "Fair, Transparent & Fraud-Protected Return Guidelines",
      badge: "15 Days Easy Returns",
      content: [
        {
          heading: "15-Day Return Eligibility",
          text: "Unused items in original condition with intact security tags, invoice, and BIS certificates can be returned or exchanged within 15 days of delivery.",
        },
        {
          heading: "Mandatory 360° Uncut Unboxing Video",
          text: "To protect against fraudulent damage or missing item claims, a continuous uncut 360° unboxing video (starting before opening the sealed parcel box) is mandatory for any claim.",
        },
        {
          heading: "Non-Returnable Items",
          text: "Custom-made jewellery, engraved pieces, and Nose Pins (for hygiene reasons) are non-returnable, but remain eligible under our Lifetime Exchange policy.",
        },
        {
          heading: "Non-Removable Security Seal Tag",
          text: "Items feature a non-removable security tag. Returns or exchanges are strictly rejected if the security tag is broken, removed, or tampered with.",
        },
      ],
      highlights: [
        "15-day return window for original unused jewellery",
        "Mandatory 360° uncut unboxing video for transit claims",
        "100% refund processed within 5-7 days after quality check",
      ],
    },
    {
      id: "cod",
      icon: "💵",
      title: "Cash on Delivery (COD) Security Policy",
      subtitle: "Advance Verification to Prevent Fake & Unverified Orders",
      badge: "Secure COD Terms",
      content: [
        {
          heading: "Maximum COD Limit",
          text: "Cash on Delivery (COD) is available for orders up to ₹20,000. Orders above ₹20,000 require 100% prepaid payment or partial advance deposit.",
        },
        {
          heading: "Advance Token Deposit for COD Dispatch",
          text: "To prevent fake/unverified orders and logistics wastage, COD orders require a nominal ₹500 or 10% advance deposit via UPI/card before dispatch.",
        },
        {
          heading: "Phone OTP Order Verification",
          text: "Our team will verify COD orders via phone call and SMS OTP before shipping to ensure valid customer identity and address details.",
        },
      ],
      highlights: [
        "COD available up to ₹20,000 limit across India",
        "₹500 advance deposit required for COD order confirmation",
        "Phone OTP verification prior to dispatch",
      ],
    },
    {
      id: "privacy",
      icon: "🔒",
      title: "Privacy & Data Security Policy",
      subtitle: "256-Bit SSL Encrypted Transactions & Complete Confidentiality",
      badge: "SSL Encrypted",
      content: [
        {
          heading: "Data Privacy & Confidentiality",
          text: "We collect customer details (Name, Address, Phone, Email) strictly for billing, delivery updates, and customer support. We never sell or share your data.",
        },
        {
          heading: "PCI-DSS Compliant Payment Gateway",
          text: "All online payments (Razorpay, UPI, Cards, NetBanking) use 256-bit SSL encryption. Card numbers and UPI PINs are never stored on our servers.",
        },
        {
          heading: "No Third-Party Sharing",
          text: "Your purchase history and contact records remain 100% confidential between you and Keshar Jewellers.",
        },
      ],
      highlights: [
        "256-Bit Bank-Grade SSL Encryption",
        "PCI-DSS Compliant Payment Gateways",
        "100% confidential customer data protection",
      ],
    },
    {
      id: "terms",
      icon: "📜",
      title: "Terms & Transparent Pricing Guidelines",
      subtitle: "Real-Time Gold Rate Lock, Transparent Making Charges & GST Invoice",
      badge: "Store Guidelines",
      content: [
        {
          heading: "Real-Time Bullion Rate Lock",
          text: "Gold & Silver rates are updated daily based on national bullion market prices. Prices are locked at the moment your payment is confirmed.",
        },
        {
          heading: "Transparent Making Charges from 6%",
          text: "Making charges start from as low as 6% on select items. Every bill clearly itemizes gross weight, net metal weight, metal rate, making charges, and 3% GST.",
        },
        {
          heading: "Legal Jurisdiction",
          text: "Keshar Jewellers operates under the ownership of Amit Kumar Soni in Sarafa Bazar, Sehore (M.P.). All disputes are subject to Sehore, Madhya Pradesh jurisdiction.",
        },
      ],
      highlights: [
        "Transparent making charges itemized from 6%",
        "Real-time gold rate locking upon order placement",
        "Official GST Tax Invoice provided with every order",
      ],
    },
  ];

  const filteredSections = useMemo(() => {
    return policySections.filter((section) => {
      if (activeTab !== "all" && section.id !== activeTab) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = section.title.toLowerCase().includes(q);
      const matchSub = section.subtitle.toLowerCase().includes(q);
      const matchBadge = section.badge.toLowerCase().includes(q);
      const matchContent = section.content.some(
        (c) => c.heading.toLowerCase().includes(q) || c.text.toLowerCase().includes(q)
      );
      return matchTitle || matchSub || matchBadge || matchContent;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="bg-[#FFF8F0] min-h-screen text-[#35191C] font-sans pb-16">
      {/* Top Banner Hero */}
      <section className="relative bg-[#5E121F] text-[#FFF8F0] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D4AF37]/15 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C1B2A] border border-[#D4AF37]/40 text-[#E6C766] text-xs font-semibold uppercase tracking-[0.2em] shadow-sm">
            <span>✨</span>
            <span>Trust • Security • Purity</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#FFF8F0]">
            Keshar Jewellers <span className="text-[#E6C766] italic font-serif">Store Policies</span>
          </h1>

          <p className="text-sm sm:text-base text-[#FFE2D8]/80 max-w-2xl mx-auto font-light leading-relaxed">
            Our commitment to 100% BIS Hallmarked Purity, Lifetime Exchange Guarantee, 100% Insured Shipping, OTP Delivery, and Transparent Pricing since 2003.
          </p>

          <div className="pt-2 flex flex-wrap justify-center items-center gap-3 text-xs">
            <span className="px-3 py-1 bg-[#7C1B2A]/80 border border-[#D4AF37]/30 rounded-md text-[#E6C766] font-mono">
              🛡️ BIS Reg: HM/C-8290497727
            </span>
            <span className="px-3 py-1 bg-[#7C1B2A]/80 border border-[#D4AF37]/30 rounded-md text-[#FFF8F0]">
              📍 Sarafa Bazar, Sehore (M.P.)
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Search & Navigation Bar */}
        <div className="bg-[#FFF0EA] border border-[#E8CFC5] rounded-2xl p-4 sm:p-6 mb-8 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search policy (e.g., hallmark, exchange, return, COD)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#E8CFC5] bg-[#FFFDFC] text-sm text-[#35191C] placeholder-[#6F4A4A]/60 focus:outline-none focus:border-[#B82E44] focus:ring-1 focus:ring-[#B82E44] shadow-inner"
              />
              <svg
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B82E44]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F4A4A] hover:text-[#B82E44] text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <p className="text-xs text-[#6F4A4A] font-medium">
              Showing <span className="text-[#B82E44] font-bold">{filteredSections.length}</span> policy category sections
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-[#E8CFC5]/60 pt-3">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-[#7C1B2A] text-[#FFF8F0] shadow-sm border border-[#7C1B2A]"
                  : "bg-[#FFF8F0] text-[#35191C] hover:bg-[#FFE2D8] border border-[#E8CFC5]"
              }`}
            >
              All Policies
            </button>
            {policySections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === sec.id
                    ? "bg-[#7C1B2A] text-[#FFF8F0] shadow-sm border border-[#7C1B2A]"
                    : "bg-[#FFF8F0] text-[#35191C] hover:bg-[#FFE2D8] border border-[#E8CFC5]"
                }`}
              >
                <span>{sec.icon}</span>
                <span>{sec.title.split(" ")[1] || sec.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Policy Sections Grid */}
        {filteredSections.length > 0 ? (
          <div className="space-y-8">
            {filteredSections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(72,12,20,0.04)] scroll-mt-24 transition-all hover:border-[#D4AF37]/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E8CFC5]/60 gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="text-3xl bg-[#FFE2D8] p-2.5 rounded-2xl border border-[#E8CFC5]">
                      {section.icon}
                    </span>
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#7C1B2A]">
                        {section.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#6F4A4A] font-light">
                        {section.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="self-start sm:self-center px-3 py-1 bg-[#FFF0EA] border border-[#D4AF37]/40 text-[#9B1B30] text-xs font-semibold rounded-full uppercase tracking-wider">
                    {section.badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  {section.content.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FFF8F0] p-4 sm:p-5 rounded-2xl border border-[#E8CFC5]/80 space-y-2 hover:bg-[#FFF0EA] transition-colors"
                    >
                      <h3 className="font-semibold text-sm text-[#35191C] flex items-center gap-2">
                        <span className="text-[#D4AF37]">✦</span>
                        <span>{item.heading}</span>
                      </h3>
                      <p className="text-xs text-[#6F4A4A] leading-relaxed font-light">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-[#7C1B2A]/5 border border-[#D4AF37]/30 rounded-2xl">
                  <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#7C1B2A] mb-2 flex items-center gap-1.5">
                    <span>✨ Key Highlights</span>
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#35191C] font-medium">
                    {section.highlights.map((hl, i) => (
                      <span key={i} className="flex items-center gap-1.5">
                        <span className="text-[#B82E44]">✔</span> {hl}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-12 text-center space-y-3">
            <span className="text-4xl block">🔍</span>
            <h3 className="font-serif text-lg font-bold text-[#7C1B2A]">
              No policy matching "{searchQuery}"
            </h3>
            <p className="text-xs text-[#6F4A4A]">
              Try clearing your search or selecting "All Policies" tab above.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="mt-2 px-4 py-2 bg-[#7C1B2A] text-[#FFF8F0] text-xs font-semibold rounded-xl hover:bg-[#5E121F] transition-colors"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        )}

        {/* Customer Support CTA Card */}
        <div className="mt-12 bg-gradient-to-r from-[#5E121F] via-[#7C1B2A] to-[#5E121F] text-[#FFF8F0] rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-xs uppercase tracking-[0.2em] text-[#E6C766] font-semibold">
              Have Questions About Our Store Policies?
            </span>
            <h3 className="font-serif text-2xl font-bold">
              We Are Here To Help You
            </h3>
            <p className="text-xs text-[#FFE2D8]/80 font-light max-w-lg">
              Visit our showroom in Sarafa Bazar, Sehore, or connect directly with owner Amit Kumar Soni for personalized assistance.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 z-10">
            <a
              href="tel:+919827415111"
              className="px-4 py-2.5 bg-[#E6C766] hover:bg-[#FFF8F0] text-[#5E121F] font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>📞 Call +91 98274 15111</span>
            </a>
            <a
              href="https://wa.me/919827415111?text=Hello%20Keshar%20Jewellers,%20I%20have%20a%20query%20regarding%20your%20store%20policies."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>💬 WhatsApp Us</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
