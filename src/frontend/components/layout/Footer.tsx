import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#5E121F] text-[#FFF8F0] border-t border-[rgba(212,175,55,0.35)] pt-8 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] relative overflow-hidden">
      {/* Subtle background ambient gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-[#D4AF37]/10 blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-6">
          
          {/* Column 1: Brand & BIS Badge */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-old.png"
                alt="Keshar Jewellers Logo"
                width={150}
                height={45}
                className="h-9 w-auto object-contain filter drop-shadow-[0_2px_6px_rgba(212,175,55,0.3)]"
              />
            </Link>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#E6C766] font-semibold">
              Keshar Jewellers • Est. 2003
            </p>
            <p className="text-xs text-[#FFE2D8]/80 font-light leading-relaxed">
              Authentic BIS Hallmark Gold &amp; Silver Showroom owned by <span className="text-[#E6C766]">Amit Kumar Soni</span> in Sarafa Bazar, Sehore.
            </p>

            {/* Compact BIS Badge */}
            <div className="px-3 py-1.5 bg-[#7C1B2A] rounded-md border border-[#D4AF37]/35 inline-flex items-center gap-2">
              <span className="text-xs">🛡️</span>
              <span className="text-[10px] text-[#FFF8F0] font-mono">
                BIS Reg: <strong className="text-[#E6C766]">HM/C-8290497727</strong>
              </span>
            </div>
          </div>

          {/* Column 2: Specialties */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#E6C766] font-semibold mb-3 border-l-2 border-[#D4AF37] pl-2.5">
              Specialties
            </h3>
            <ul className="space-y-1.5 text-xs text-[#FFE2D8]/80 font-light">
              <li className="flex items-center gap-1.5"><span className="text-[#D4AF37]">✦</span> BIS 91.6 Hallmark Gold</li>
              <li className="flex items-center gap-1.5"><span className="text-[#D4AF37]">✦</span> Pure 92.5% Silver Ornaments</li>
              <li className="flex items-center gap-1.5"><span className="text-[#D4AF37]">✦</span> Certified Natural Navratna</li>
              <li className="flex items-center gap-1.5"><span className="text-[#D4AF37]">✦</span> Custom Bridal &amp; Temple Ornaments</li>
              <li className="flex items-center gap-1.5"><span className="text-[#E6C766] font-medium">✦ Making Charges from 6%</span></li>
            </ul>
          </div>

          {/* Column 3: Store Location */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#E6C766] font-semibold mb-3 border-l-2 border-[#D4AF37] pl-2.5">
              Store Location
            </h3>
            <div className="space-y-2 text-xs text-[#FFE2D8]/80 font-light">
              <p className="font-medium text-[#FFF8F0]">Charkha Line, Sarafa Bazar</p>
              <p>Sehore, Madhya Pradesh – 466001</p>
              <a
                href="https://maps.google.com/?q=Charkha+Line+Sarafa+Bazar+Sehore+Madhya+Pradesh+466001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[10px] uppercase tracking-widest text-[#D4AF37] hover:text-[#E6C766] transition-colors border-b border-[#D4AF37]/40 pb-0.5 pt-1"
              >
                <span>View On Google Maps →</span>
              </a>
            </div>
          </div>

          {/* Column 4: Contact & WhatsApp */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#E6C766] font-semibold mb-3 border-l-2 border-[#D4AF37] pl-2.5">
              Direct Contact
            </h3>
            <div className="space-y-2 text-xs text-[#FFE2D8]/80 font-light">
              <p className="text-[#FFF8F0]">Owner: <strong className="text-[#E6C766] font-normal">Amit Kumar Soni</strong></p>
              <a href="tel:+919827415111" className="hover:text-[#D4AF37] transition-colors font-sans text-sm text-[#FFF8F0] font-medium block">
                📞 +91 98274 15111
              </a>
              <div className="pt-1">
                <a
                  href="https://wa.me/919827415111?text=Hello%20Keshar%20Jewellers,%20I%20would%20like%20to%20enquire%20about%20your%20jewellery%20collection."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#25D366]/20 border border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366] hover:text-black rounded text-[11px] font-semibold uppercase tracking-wider transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="border-t border-[rgba(212,175,55,0.2)] pt-3 mt-4 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#FFE2D8]/70 font-light gap-2">
          <p>© {new Date().getFullYear()} Keshar Jewellers. All Rights Reserved.</p>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#E6C766]/90">
            <Link href="/info" className="hover:text-[#FFF8F0] transition-colors font-medium">Store Info</Link>
            <span>•</span>
            <Link href="/policies#hallmark" className="hover:text-[#FFF8F0] transition-colors">BIS Hallmark</Link>
            <span>•</span>
            <Link href="/policies#exchange" className="hover:text-[#FFF8F0] transition-colors">Lifetime Exchange</Link>
            <span>•</span>
            <Link href="/policies#shipping" className="hover:text-[#FFF8F0] transition-colors">Shipping Policy</Link>
            <span>•</span>
            <Link href="/policies#returns" className="hover:text-[#FFF8F0] transition-colors">7-Day Returns</Link>
            <span>•</span>
            <Link href="/policies#privacy" className="hover:text-[#FFF8F0] transition-colors">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

