"use client";

import { useState } from "react";
import Link from "next/link";

export default function InfoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "Where is Keshar Jewellers located in Sehore?",
      answer:
        "Our flagship showroom is located in Charkha Line, Sarafa Bazar, Sehore, Madhya Pradesh – 466001. We are situated in the heart of Sarafa Bazar, easily accessible with dedicated customer assistance.",
    },
    {
      question: "Are all gold ornaments certified with BIS Hallmark?",
      answer:
        "Yes! 100% of our gold jewellery is BIS Hallmarked (22K / 916 Gold and 18K / 750 Gold) carrying official HUID laser stamps as mandated by government norms. BIS Registration: HM/C-8290497727.",
    },
    {
      question: "What are the store operating hours?",
      answer:
        "Our showroom is open Monday through Saturday from 10:30 AM to 8:30 PM. On Sundays, we are open from 11:00 AM to 7:00 PM.",
    },
    {
      question: "Can I order customized bridal or temple jewellery?",
      answer:
        "Absolulely! We specialize in custom hand-crafted gold & silver bridal sets, traditional temple ornaments, and personalized gemstone rings. You can bring your design ideas or choose from our extensive catalogue.",
    },
    {
      question: "What are your making charges?",
      answer:
        "Our transparent making charges start from as low as 6% on select gold and silver items. Every bill provides a complete breakdown of metal weight, rate, making charge, and GST.",
    },
    {
      question: "Do you offer purity testing for old gold?",
      answer:
        "Yes, we provide instant, accurate computer karatometer testing for old gold items in our showroom with 100% transparent valuation.",
    },
  ];

  return (
    <div className="bg-[#FFF8F0] min-h-screen text-[#35191C] font-sans pb-16">
      {/* Top Banner Hero */}
      <section className="relative bg-[#5E121F] text-[#FFF8F0] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D4AF37]/15 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C1B2A] border border-[#D4AF37]/40 text-[#E6C766] text-xs font-semibold uppercase tracking-[0.2em] shadow-sm">
            <span>🏛️</span>
            <span>Serving Sehore Since 2003</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#FFF8F0]">
            About <span className="text-[#E6C766] italic font-serif">Keshar Jewellers</span>
          </h1>

          <p className="text-sm sm:text-base text-[#FFE2D8]/80 max-w-2xl mx-auto font-light leading-relaxed">
            Discover our heritage of pure gold &amp; silver craftsmanship, hallmarking standards, custom jewellery orders, and store information.
          </p>

          <div className="pt-2 flex flex-wrap justify-center items-center gap-3 text-xs">
            <span className="px-3 py-1 bg-[#7C1B2A]/80 border border-[#D4AF37]/30 rounded-md text-[#E6C766] font-mono">
              Owner: Amit Kumar Soni
            </span>
            <span className="px-3 py-1 bg-[#7C1B2A]/80 border border-[#D4AF37]/30 rounded-md text-[#FFF8F0]">
              🛡️ BIS Reg: HM/C-8290497727
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Section 1: Store Story & Heritage */}
        <section id="story" className="scroll-mt-24 bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-6 sm:p-10 shadow-[0_4px_20px_rgba(72,12,20,0.04)] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C77D62] font-bold">
              ✦ Our Heritage &amp; Legacy ✦
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7C1B2A] leading-tight">
              Two Decades of Unmatched Pure Gold &amp; Silver Trust
            </h2>
            <p className="text-sm text-[#6F4A4A] leading-relaxed font-light">
              Founded in 2003 by <strong className="text-[#7C1B2A] font-semibold">Amit Kumar Soni</strong>, Keshar Jewellers has grown to become Sehore&apos;s most trusted showroom for certified hallmarked gold, pure silver ornaments, and natural Navratna gemstones.
            </p>
            <p className="text-sm text-[#6F4A4A] leading-relaxed font-light">
              Located in the iconic Charkha Line of Sarafa Bazar, we combine ancestral Indian goldsmith artistry with modern purity standards (HUID Hallmark) and transparent customer policies.
            </p>

            {/* USPs Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#FFF0EA] border border-[#E8CFC5] rounded-xl text-xs font-semibold text-[#7C1B2A] flex items-center gap-2">
                <span>✨</span> 100% BIS Hallmarked
              </div>
              <div className="p-3 bg-[#FFF0EA] border border-[#E8CFC5] rounded-xl text-xs font-semibold text-[#7C1B2A] flex items-center gap-2">
                <span>🔄</span> Lifetime Exchange
              </div>
              <div className="p-3 bg-[#FFF0EA] border border-[#E8CFC5] rounded-xl text-xs font-semibold text-[#7C1B2A] flex items-center gap-2">
                <span>💎</span> Certified Gemstones
              </div>
              <div className="p-3 bg-[#FFF0EA] border border-[#E8CFC5] rounded-xl text-xs font-semibold text-[#7C1B2A] flex items-center gap-2">
                <span>🏷️</span> Making From 6%
              </div>
            </div>
          </div>

          {/* Showroom Info Box */}
          <div className="bg-gradient-to-br from-[#7C1B2A] to-[#5E121F] text-[#FFF8F0] p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/40 shadow-xl space-y-6">
            <div className="border-b border-[#D4AF37]/30 pb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#E6C766] font-bold">Showroom Contact</p>
                <h3 className="font-serif text-xl font-bold text-[#FFF8F0]">Keshar Jewellers</h3>
              </div>
              <span className="text-3xl">🏛️</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-light text-[#FFE2D8]/90">
              <div className="flex items-start gap-2.5">
                <span className="text-[#E6C766] text-base">📍</span>
                <div>
                  <p className="font-semibold text-[#FFF8F0]">Address:</p>
                  <p>Charkha Line, Sarafa Bazar, Sehore, Madhya Pradesh – 466001</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#E6C766] text-base">🕒</span>
                <div>
                  <p className="font-semibold text-[#FFF8F0]">Operating Hours:</p>
                  <p>Mon – Sat: 10:30 AM – 8:30 PM</p>
                  <p>Sunday: 11:00 AM – 7:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#E6C766] text-base">📞</span>
                <div>
                  <p className="font-semibold text-[#FFF8F0]">Direct Phone / WhatsApp:</p>
                  <p className="text-[#E6C766] font-mono text-sm font-medium">+91 98274 15111</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://maps.google.com/?q=Charkha+Line+Sarafa+Bazar+Sehore+Madhya+Pradesh+466001"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] text-center px-4 py-2.5 bg-[#E6C766] hover:bg-[#FFF8F0] text-[#5E121F] font-bold text-xs rounded-xl transition-all shadow-md"
              >
                🗺️ Open In Google Maps
              </a>
              <a
                href="tel:+919827415111"
                className="flex-1 min-w-[140px] text-center px-4 py-2.5 bg-[#7C1B2A] hover:bg-[#9B1B30] text-[#FFF8F0] border border-[#D4AF37]/50 font-bold text-xs rounded-xl transition-all shadow-md"
              >
                📞 Call Showroom
              </a>
            </div>
          </div>
        </section>

        {/* Section 2: Purity & Hallmarking Guide */}
        <section id="purity" className="scroll-mt-24 bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(72,12,20,0.04)] space-y-6">
          <div className="border-b border-[#E8CFC5]/60 pb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C77D62] font-bold">
              ✦ Gold &amp; Silver Purity Standards ✦
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#7C1B2A]">
              Understanding BIS Hallmark &amp; Karat Purity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FFF8F0] border border-[#E8CFC5] p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-serif font-bold text-[#7C1B2A]">22 Karat (916 Gold)</span>
                <span className="px-2 py-0.5 bg-[#FFE2D8] text-[#9B1B30] text-[10px] font-bold rounded">91.6% Purity</span>
              </div>
              <p className="text-xs text-[#6F4A4A] leading-relaxed font-light">
                Standard purity used for traditional Indian bridal jewellery, bangles, chains, and necklaces. Soft yet durable for detailed hand engraving.
              </p>
            </div>

            <div className="bg-[#FFF8F0] border border-[#E8CFC5] p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-serif font-bold text-[#7C1B2A]">18 Karat (750 Gold)</span>
                <span className="px-2 py-0.5 bg-[#FFE2D8] text-[#9B1B30] text-[10px] font-bold rounded">75.0% Purity</span>
              </div>
              <p className="text-xs text-[#6F4A4A] leading-relaxed font-light">
                Ideal for gemstone setting, diamond rings, and contemporary lightweight daily-wear ornaments requiring structural strength.
              </p>
            </div>

            <div className="bg-[#FFF8F0] border border-[#E8CFC5] p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-serif font-bold text-[#7C1B2A]">925 Sterling Silver</span>
                <span className="px-2 py-0.5 bg-[#FFE2D8] text-[#9B1B30] text-[10px] font-bold rounded">92.5% Purity</span>
              </div>
              <p className="text-xs text-[#6F4A4A] leading-relaxed font-light">
                Premium grade silver standard used for payal (anklets), bichhiya (toe rings), silver coins, and pooja utensils.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Custom Jewellery Order Process */}
        <section id="custom" className="scroll-mt-24 bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(72,12,20,0.04)] space-y-6">
          <div className="border-b border-[#E8CFC5]/60 pb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C77D62] font-bold">
              ✦ Bespoke Craftsmanship ✦
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#7C1B2A]">
              How Custom Jewellery Orders Work
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FFF8F0] border border-[#E8CFC5] p-4 rounded-2xl text-center space-y-2">
              <span className="w-8 h-8 rounded-full bg-[#7C1B2A] text-[#FFF8F0] font-bold text-xs flex items-center justify-center mx-auto">1</span>
              <h4 className="font-bold text-xs text-[#35191C]">Design Consultation</h4>
              <p className="text-[11px] text-[#6F4A4A]">Share reference photos or select patterns in showroom.</p>
            </div>

            <div className="bg-[#FFF8F0] border border-[#E8CFC5] p-4 rounded-2xl text-center space-y-2">
              <span className="w-8 h-8 rounded-full bg-[#7C1B2A] text-[#FFF8F0] font-bold text-xs flex items-center justify-center mx-auto">2</span>
              <h4 className="font-bold text-xs text-[#35191C]">Weight &amp; Rate Estimation</h4>
              <p className="text-[11px] text-[#6F4A4A]">Get clear breakdown of gold weight, karat, and making charges.</p>
            </div>

            <div className="bg-[#FFF8F0] border border-[#E8CFC5] p-4 rounded-2xl text-center space-y-2">
              <span className="w-8 h-8 rounded-full bg-[#7C1B2A] text-[#FFF8F0] font-bold text-xs flex items-center justify-center mx-auto">3</span>
              <h4 className="font-bold text-xs text-[#35191C]">Master Crafting</h4>
              <p className="text-[11px] text-[#6F4A4A]">Experienced artisans handcraft your piece with precision.</p>
            </div>

            <div className="bg-[#FFF8F0] border border-[#E8CFC5] p-4 rounded-2xl text-center space-y-2">
              <span className="w-8 h-8 rounded-full bg-[#7C1B2A] text-[#FFF8F0] font-bold text-xs flex items-center justify-center mx-auto">4</span>
              <h4 className="font-bold text-xs text-[#35191C]">BIS Hallmarking &amp; Delivery</h4>
              <p className="text-[11px] text-[#6F4A4A]">Final HUID certification stamp &amp; safe showroom pickup/delivery.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Interactive FAQs */}
        <section id="faq" className="scroll-mt-24 bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(72,12,20,0.04)] space-y-6">
          <div className="border-b border-[#E8CFC5]/60 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C77D62] font-bold">
                ✦ Frequently Asked Questions ✦
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#7C1B2A]">
                Common Store Questions &amp; Answers
              </h2>
            </div>
            <span className="text-2xl">❓</span>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-[#FFF8F0] border border-[#E8CFC5] rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between font-semibold text-xs sm:text-sm text-[#35191C] hover:text-[#B82E44]"
                  >
                    <span>{faq.question}</span>
                    <span className="text-[#B82E44] font-bold text-base font-mono ml-2">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[#6F4A4A] leading-relaxed border-t border-[#E8CFC5]/40 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Links to Policies Card */}
        <div className="bg-[#FFF0EA] border border-[#E8CFC5] rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#7C1B2A]">
            Looking for Store Policies?
          </h3>
          <p className="text-xs text-[#6F4A4A] max-w-xl mx-auto">
            Read details about our 100% BIS Hallmark Certification, Lifetime Exchange Guarantee, Insured Shipping, and 7-Day Returns on our policy page.
          </p>
          <Link
            href="/policies"
            className="inline-block px-5 py-2.5 bg-[#7C1B2A] hover:bg-[#5E121F] text-[#FFF8F0] font-bold text-xs rounded-xl transition-all shadow-md mt-1"
          >
            Read Our Store Policies →
          </Link>
        </div>
      </main>
    </div>
  );
}
