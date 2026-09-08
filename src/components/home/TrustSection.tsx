import React from "react";

export default function TrustSection() {
  const trustItems = [
    {
      icon: "🛡️",
      title: "100% BIS Hallmarked",
      description: "Authentic 91.6 (22K) & 750 (18K) Hallmarked Gold & Pure Silver with Registration HM/C-8290497727.",
    },
    {
      icon: "💎",
      title: "Certified Natural Gemstones",
      description: "100% genuine lab-certified Navratna gemstones with expert astrological consultation.",
    },
    {
      icon: "🔄",
      title: "Lifetime Exchange",
      description: "Transparent buyback policies and lifetime exchange value on all gold & gemstone jewellery.",
    },
    {
      icon: "🏷️",
      title: "Making Charges from 6%",
      description: "Fair and transparent pricing with handcrafted precision starting at minimal making charges.",
    },
    {
      icon: "🚚",
      title: "Insured Free Shipping",
      description: "100% secure, tamper-proof insured delivery right to your doorstep across India.",
    },
  ];

  return (
    <section className="w-full bg-[#7C1B2A] text-[#FFF8F0] py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden my-6">
      {/* Decorative subtle ambient glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#E8A58A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 select-none">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block mb-2">
            THE KESHAR COMMITMENT
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#FFF8F0] tracking-tight">
            Why Discerning Customers Trust Us
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3 text-[#D4AF37]/60 w-48 mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
            <span className="text-xs font-serif">❖</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
          </div>
        </div>

        {/* 5 Grid items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-[#5E121F]/60 border border-[#D4AF37]/25 hover:border-[#D4AF37] hover:bg-[#5E121F] transition-all duration-300 group shadow-md"
            >
              <div className="w-14 h-14 rounded-full bg-[#7C1B2A] border border-[#D4AF37]/40 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:border-[#D4AF37] transition-transform duration-300 shadow-inner">
                {item.icon}
              </div>
              <h3 className="font-serif text-lg font-medium text-[#FFF8F0] mb-2 group-hover:text-[#E6C766] transition-colors">
                {item.title}
              </h3>
              <p className="font-sans text-xs text-[#FFC7B8] font-light leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
