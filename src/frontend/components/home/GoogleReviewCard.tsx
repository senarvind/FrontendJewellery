import { BUSINESS } from "@/lib/seo";

/** Prominent "rate us on Google" card (reviews help local ranking in Sehore). */
export default function GoogleReviewCard() {
  return (
    <section className="px-4 py-8 sm:py-12 bg-[#FFF8F0]" aria-labelledby="google-review-heading">
      <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#7C1B2A] to-[#5E121F] border border-[#D4AF37]/50 rounded-3xl px-5 py-7 sm:px-10 sm:py-9 text-center shadow-xl">
        <div className="text-3xl sm:text-4xl tracking-widest text-[#E6C766]" aria-hidden="true">★★★★★</div>
        <h2 id="google-review-heading" className="font-serif text-xl sm:text-3xl font-bold text-[#FFF8F0] mt-2">
          Happy with Keshar Jewellers?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#FFE2D8]/90 max-w-xl mx-auto">
          Your Google review helps other families in Sehore find us. It takes just 30 seconds – thank you!
        </p>
        <a
          href={BUSINESS.googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#E6C766] hover:bg-white text-[#5E121F] font-bold text-sm sm:text-base shadow-lg active:scale-95 transition-all"
        >
          <span aria-hidden="true">⭐</span>
          <span>Rate us on Google</span>
        </a>
      </div>
    </section>
  );
}
