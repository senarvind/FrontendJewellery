import { heroSlides } from "@/frontend/data/heroSlides";
import HeroCarousel from "./HeroCarousel";

export default function HeroSection() {
  return (
    <section className="w-full bg-[#FFF8F0] pt-1.5 sm:pt-4 pb-1 sm:pb-2 px-2 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
        <HeroCarousel slides={heroSlides} />

        {/* Page H1 for Google and screen readers (visually hidden by design) */}
        <h1 className="sr-only">
          Keshar Jewellers, Sehore – 92.5 Sterling Silver &amp; BIS Hallmark Gold Jewellery
        </h1>
      </div>
    </section>
  );
}
