"use client";

import React from "react";
import Image from "next/image";

export default function KesharBrandPosterBanner() {
  const features = [
    {
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#9B1B30]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V5l-9-4zm-1 16l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/>
        </svg>
      ),
      mainText: "BIS 916 Hallmark Gold",
      subText: "BIS Reg: ***HM/C-8290497727**",
    },
    {
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#9B1B30]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/>
        </svg>
      ),
      mainText: "Pure 92.5% Silver Ornaments",
      subText: null,
    },
    {
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#9B1B30]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ),
      mainText: "Certified Natural Navratna",
      subText: null,
    },
    {
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#9B1B30]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
        </svg>
      ),
      mainText: "Custom Bridal & Temple Ornaments",
      subText: null,
    },
    {
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#9B1B30]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      ),
      mainText: "Making Charges from 6%",
      subText: null,
    },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#F6D4D2] flex flex-col justify-between p-3 sm:p-6 lg:p-8">
      {/* Soft subtle gradient overlay matching #F6D4D2 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAECEB]/70 via-[#F6D4D2] to-[#EFC3C0]/90 pointer-events-none" />

      {/* Decorative ambient gold glow */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#7C1B2A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* MAIN BANNER CONTAINER */}
      <div className="relative z-10 w-full max-w-[1350px] mx-auto flex-1 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6 md:gap-8">
        
        {/* LEFT COLUMN: EXACT USER BRAND LOGO IMAGE */}
        <div className="flex-1 flex flex-col items-center text-center justify-center py-2 md:py-4">
          <div className="relative w-48 sm:w-72 md:w-80 lg:w-[380px] aspect-[4/3] flex items-center justify-center filter drop-shadow-[0_6px_20px_rgba(124,27,42,0.15)]">
            <Image
              src="/images/keshar-brand-logo-poster.png"
              alt="KESHAR by Amityamini - SINCE 2003 Logo"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 640px) 200px, (max-width: 1024px) 320px, 380px"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: 5 BRAND HIGHLIGHT FEATURES */}
        <div className="flex-1 w-full max-w-lg flex flex-col justify-center gap-1.5 sm:gap-3 md:gap-3.5 px-2 sm:px-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 sm:gap-4 bg-white/70 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-[#D4AF37]/30 shadow-[0_2px_10px_rgba(124,27,42,0.05)] hover:bg-white/90 transition-all"
            >
              {/* Gold Circular Icon Container */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#FFF8F0] to-[#FFE2D8] border border-[#D4AF37] flex items-center justify-center flex-shrink-0 shadow-xs">
                {item.icon}
              </div>

              {/* Feature Text */}
              <div className="flex-1 text-left min-w-0">
                <h4 className="font-serif font-bold text-xs sm:text-base text-[#5E121F] leading-tight truncate">
                  {item.mainText}
                </h4>
                {item.subText && (
                  <p className="text-[9px] sm:text-xs text-[#7C1B2A]/80 font-medium truncate mt-0.5">
                    {item.subText}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* BOTTOM TAGLINE DIVIDER */}
      <div className="relative z-10 w-full pt-2 sm:pt-3 border-t border-[#D4AF37]/40 text-center">
        <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#7C1B2A] tracking-wider flex items-center justify-center gap-2 sm:gap-4">
          <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <span>Timeless Jewellery</span>
          <span className="text-[#D4AF37] text-xs">✦</span>
          <span>Eternal Elegance</span>
          <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </p>
      </div>
    </div>
  );
}
