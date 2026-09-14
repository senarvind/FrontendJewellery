import { heroSlides } from "@/data/heroSlides";
import HeroCarousel from "./HeroCarousel";

interface HeroSectionProps {
  tagline?: string;
}

export default function HeroSection({
  tagline = "Manifested by You. Crafted by Us."
}: HeroSectionProps) {
  return (
    <section className="w-full bg-[#FFF8F0] pt-1.5 sm:pt-4 pb-3 sm:pb-4 px-2 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
        <HeroCarousel slides={heroSlides} />

        <div className="text-center mt-2 sm:mt-3 mb-1 select-none">
          <p className="font-serif italic text-xs sm:text-lg md:text-xl text-[#5c1a2d] tracking-wider font-light">
            {tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
