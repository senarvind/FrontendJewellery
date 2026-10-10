import Link from "next/link";
import { PRICE_TIERS } from "@/frontend/data/priceTiers";

export default function ShopByPrice() {
  return (
    <section className="w-full bg-[#FFF8F0] py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center">

        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 select-none">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#965238] font-bold block mb-1">
            CURATED SELECTION
          </span>
          <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl font-normal text-[#B82E44] tracking-tight">
            Shop by Price &amp; Collections
          </h2>
          <div className="flex items-center justify-center gap-3 my-2 text-[#D4AF37]/60 w-32 sm:w-40 mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
            <span className="text-[10px] sm:text-xs font-serif text-[#A77C18]">❖</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
          </div>
        </div>

        {/* 4 Price / Collection Cards Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PRICE_TIERS.map((tier) => (
            <Link
              key={tier.id}
              href={tier.href}
              className="group relative flex flex-col justify-between h-[320px] sm:h-[360px] md:h-[390px] rounded-2xl p-5 sm:p-6 overflow-hidden transition-all duration-500 shadow-md hover:shadow-2xl hover:-translate-y-1.5 border border-[#E8CFC5] bg-[#FFE2D8]"
            >
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#E8A58A]/30 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Badge with #B82E44 background and white text */}
              <div className="flex justify-end relative z-10">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-[#B82E44] text-[#FFF8F0] shadow-sm">
                  {tier.badge}
                </span>
              </div>

              {/* Center: Icon & Description */}
              <div className="flex-1 flex flex-col items-center justify-center text-center my-3 relative z-10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/80 backdrop-blur-md border border-[#E8A58A] flex items-center justify-center text-3xl sm:text-4xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {tier.icon}
                </div>
                <p className="font-sans text-xs text-[#6F4A4A] font-medium mt-3 px-2 leading-relaxed">
                  {tier.itemsDescription}
                </p>
              </div>

              {/* Bottom: Price Label & CTA Button */}
              <div className="text-center relative z-10 pt-3 border-t border-[#E8CFC5] flex flex-col items-center gap-1.5">
                <span className="font-serif italic text-lg sm:text-xl text-[#B82E44] font-semibold group-hover:text-[#7C1B2A] transition-colors">
                  {tier.priceLabel}
                </span>
                <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#B82E44] text-[#FFF8F0] group-hover:bg-[#7C1B2A] transition-colors shadow-sm mt-1">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
