"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Metadata } from "next";

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
          heading: "Authenticity Guarantee",
          text: "Every piece of gold jewellery sold at Keshar Jewellers is certified 100% BIS Hallmarked (91.6 / 22K Gold and 75.0 / 18K Gold). We strictly adhere to the standards prescribed by the Bureau of Indian Standards (BIS).",
        },
        {
          heading: "HUID (Hallmark Unique Identification)",
          text: "Our gold ornaments feature a unique 6-digit HUID code stamped by government-approved hallmarking centers, guaranteeing metal purity, origin, and complete traceability.",
        },
        {
          heading: "Pure 92.5 Sterling Silver Certification",
          text: "All silver ornaments and gift items carry a 92.5 / 925 sterling silver purity stamp to ensure long-lasting luster and absolute material integrity.",
        },
        {
          heading: "Natural Gemstone Certificate",
          text: "All precious & semi-precious stones (Navratna, Diamonds, Rubies, Emeralds) are accompanied by authentic laboratory test certificates upon request.",
        },
      ],
      highlights: [
        "Official BIS Registration Number: HM/C-8290497727",
        "Laser-etched HUID code on every gold item",
        "Zero-tolerance on purity compromise",
      ],
    },
    {
      id: "exchange",
      icon: "🔄",
      title: "Lifetime Exchange & Buyback Policy",
      subtitle: "Transparent Valuation & Maximum Value for Your Precious Metals",
      badge: "Lifetime Guarantee",
      content: [
        {
          heading: "Gold Exchange & Buyback",
          text: "We offer lifetime exchange and buyback for all gold ornaments purchased from Keshar Jewellers. Exchange value will be calculated based on the prevailing benchmark gold rate on the day of exchange.",
        },
        {
          heading: "Valuation & Deduction Terms",
          text: "For gold items purchased from us with valid original invoice, 100% value of net gold weight will be credited at current gold market rate. Making charges, taxes, and stone weights are non-refundable during exchange.",
        },
        {
          heading: "Silver Exchange",
          text: "Silver ornaments purchased from Keshar Jewellers can be exchanged or sold back based on net silver weight purity tests at current market bullion rates.",
        },
        {
          heading: "Old Gold Exchange (Non-Keshar Jewellery)",
          text: "We accept old gold from other jewellers subject to purity verification using accurate karatometer testing in our showroom.",
        },
      ],
      highlights: [
        "100% net weight value on Keshar Gold ornaments",
        "Instant digital karatometer purity testing",
        "Hassle-free upgrade to modern designs",
      ],
    },
    {
      id: "shipping",
      icon: "📦",
      title: "Shipping & Delivery Policy",
      subtitle: "100% Insured Nationwide Transit & Safe Delivery",
      badge: "Free Nationwide Shipping",
      content: [
        {
          heading: "Fully Insured Transit",
          text: "Every parcel shipped by Keshar Jewellers is 100% insured against loss, theft, or damage during transit until it reaches your doorstep.",
        },
        {
          heading: "Delivery Timelines",
          text: "Standard orders are processed and dispatched within 24 to 48 hours. Estimated delivery time across India is 3 to 7 business days depending on pincode serviceability.",
        },
        {
          heading: "Secure Delivery & OTP Verification",
          text: "High-value shipments require mandatory recipient signature and OTP verification upon delivery. Packages are delivered in tamper-evident sealed security packaging.",
        },
        {
          heading: "In-Store Pickup Option",
          text: "Customers in Sehore and surrounding regions can opt for free store pickup at our main showroom: Charkha Line, Sarafa Bazar, Sehore (M.P.).",
        },
      ],
      highlights: [
        "Zero transit risk for customers",
        "Tamper-proof tamper-evident packaging",
        "Real-time SMS & WhatsApp tracking updates",
      ],
    },
    {
      id: "returns",
      icon: "🔁",
      title: "7-Day Return & Refund Policy",
      subtitle: "Simple, Transparent & Customer-First Return Rights",
      badge: "7 Days Easy Returns",
      content: [
        {
          heading: "Return Eligibility",
          text: "Online purchases can be returned or exchanged within 7 days of delivery, provided the item is unworn, undamaged, in original condition with original tags, invoice, and authenticity certificates intact.",
        },
        {
          heading: "Custom & Altered Items",
          text: "Custom-made jewellery, engraved items, or custom resized rings are not eligible for standard 7-day returns, but remain eligible under our Lifetime Exchange policy.",
        },
        {
          heading: "Refund Process",
          text: "Once the returned item passes quality inspection at our head office, refunds are processed within 5 to 7 business days to the original payment mode or bank account.",
        },
        {
          heading: "Damaged or Wrong Products Received",
          text: "If you receive a package that is visibly damaged or tampered with, please record an unboxing video and contact us within 24 hours at +91 98274 15111 for immediate replacement.",
        },
      ],
      highlights: [
        "7-day hassle-free return window for online orders",
        "Free pickup arranged for approved return requests",
        "100% refund to original payment source upon verification",
      ],
    },
    {
      id: "privacy",
      icon: "🔒",
      title: "Privacy & Data Security Policy",
      subtitle: "Your Confidentiality & Payment Security Are Our Priority",
      badge: "SSL Encrypted",
      content: [
        {
          heading: "Data Protection Guarantee",
          text: "Keshar Jewellers respects your privacy. We collect personal details (Name, Address, Phone, Email) solely for order fulfillment, billing, shipping updates, and customer support.",
        },
        {
          heading: "Secure Transactions",
          text: "All payment transactions are processed using industry-standard SSL encryption and PCI-DSS compliant secure payment gateways. We never store credit card or debit card numbers on our servers.",
        },
        {
          heading: "No Data Sharing",
          text: "We do not sell, rent, or trade your personal information to third-party advertisers or external marketing organizations under any circumstances.",
        },
      ],
      highlights: [
        "256-Bit SSL Secured Platform",
        "PCI-DSS Compliant Payment Gateways",
        "Strict confidentiality of purchase records",
      ],
    },
    {
      id: "terms",
      icon: "📜",
      title: "Terms & Store Guidelines",
      subtitle: "Transparent Pricing, Making Charges & Rate Lock Rules",
      badge: "Store Guidelines",
      content: [
        {
          heading: "Daily Bullion Rates",
          text: "Gold and Silver prices are updated daily in accordance with international and national market rates. Orders are locked at the rate active at the moment of payment confirmation.",
        },
        {
          heading: "Transparent Making Charges",
          text: "Our making charges start from as low as 6% on select gold and silver items. Every bill clearly breaks down metal weight, karat rate, making charges, GST (3%), and stone values.",
        },
        {
          heading: "Custom Orders & Advance Payment",
          text: "Custom jewellery designs require a minimum 25% advance booking amount. Final weight variance (+/- 5%) will be adjusted in the final bill upon completion.",
        },
        {
          heading: "Jurisdiction & Legal Notice",
          text: "Keshar Jewellers operates under the ownership of Amit Kumar Soni in Sarafa Bazar, Sehore. All disputes are subject to Sehore, Madhya Pradesh jurisdiction.",
        },
      ],
      highlights: [
        "Making charges transparently itemized from 6%",
        "Real-time gold rate locking upon order placement",
        "Full GST tax invoice issued with every purchase",
      ],
    },
  ];

  // Filter sections based on search or active tab
  const filteredSections = useMemo(() => {
    return policySections.filter((section) => {
      // Tab filter
      if (activeTab !== "all" && section.id !== activeTab) {
        return false;
      }
      // Search query filter
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
        {/* Glow Effects */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D4AF37]/15 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C1B2A] border border-[#D4AF37]/40 text-[#E6C766] text-xs font-semibold uppercase tracking-[0.2em] shadow-sm">
            <span>✨</span>
            <span>Trust • Transparency • Purity</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#FFF8F0]">
            Keshar Jewellers <span className="text-[#E6C766] italic font-serif">Store Policies</span>
          </h1>

          <p className="text-sm sm:text-base text-[#FFE2D8]/80 max-w-2xl mx-auto font-light leading-relaxed">
            Our commitment to 100% BIS Hallmarked Purity, Lifetime Exchange Guarantee, Insured Shipping, and Transparent Pricing since 2003.
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
            {/* Live Policy Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search policy (e.g., hallmark, exchange, return)..."
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

            {/* Quick Status / Item count */}
            <p className="text-xs text-[#6F4A4A] font-medium">
              Showing <span className="text-[#B82E44] font-bold">{filteredSections.length}</span> policy category sections
            </p>
          </div>

          {/* Policy Category Filter Tabs */}
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
                {/* Header of Section */}
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

                {/* Body Content Blocks */}
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

                {/* Highlights / Key Takeaways Box */}
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
