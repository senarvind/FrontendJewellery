import { heroSlides } from "@/frontend/data/heroSlides";
import HeroCarousel from "./HeroCarousel";

interface HeroSectionProps {
  tagline?: string;
}

export default function HeroSection({
  tagline = "Manifested by You. Crafted by Us."
}: HeroSectionProps) {
  return (
    <section className="w-full bg-white pt-2 sm:pt-4 pb-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
        <HeroCarousel slides={heroSlides} />

        <div className="text-center mt-2 sm:mt-3 mb-1 select-none">
          <p className="font-serif italic text-base sm:text-lg md:text-xl text-[#5c1a2d] tracking-wider font-light">
            {tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
