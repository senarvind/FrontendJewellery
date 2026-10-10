import type { Metadata } from "next";
import HeroSection from "@/frontend/components/hero/HeroSection";
import CategoryCarousel from "@/frontend/components/categories/CategoryCarousel";
import FeaturedJewelleryCarousel from "@/frontend/components/categories/FeaturedJewelleryCarousel";
import SpecialCollectionCarousel from "@/frontend/components/categories/SpecialCollectionCarousel";
import CategoryProductsShowcase from "@/frontend/components/home/CategoryProductsShowcase";
import ShopByPrice from "@/frontend/components/pricing/ShopByPrice";
import TrustSection from "@/frontend/components/home/TrustSection";
import GoogleReviewCard from "@/frontend/components/home/GoogleReviewCard";
import WhatsAppButton from "@/frontend/components/layout/WhatsAppButton";
import { CATEGORIES } from "@/frontend/data/categories";
import { getAllProducts } from "@/lib/api";
import { BUSINESS, SITE_URL, jsonLdHtml } from "@/lib/seo";

// Cached page (ISR): rebuilt in the background at most every 5 minutes.
// If the backend is down during a rebuild, the last good page keeps being served.
export const revalidate = 300;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const storeLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "JewelryStore",
      "@id": `${SITE_URL}/#store`,
      name: BUSINESS.name,
      legalName: BUSINESS.legalName,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/images/logo.png`,
      image: `${SITE_URL}/opengraph-image`,
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      foundingDate: BUSINESS.foundingYear,
      founder: { "@type": "Person", name: BUSINESS.owner },
      taxID: BUSINESS.gstin,
      priceRange: "₹₹",
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.streetAddress,
        addressLocality: BUSINESS.locality,
        addressRegion: BUSINESS.region,
        postalCode: BUSINESS.postalCode,
        addressCountry: BUSINESS.country,
      },
      openingHoursSpecification: BUSINESS.hours.map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days,
        opens: h.opens,
        closes: h.closes,
      })),
      hasMap: BUSINESS.googleBusinessUrl,
      sameAs: [BUSINESS.instagram, BUSINESS.facebook, BUSINESS.googleBusinessUrl],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: BUSINESS.name,
      alternateName: "Keshar Jewellers Sehore",
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE_URL}/#store` },
    },
  ],
};

export default async function Home() {
  // Home shows only the newest pieces; the full catalogue lives on /products.
  const latestProducts = [...(await getAllProducts().catch(() => []))]
    .sort((a, b) => (Date.parse(b.createdAt ?? "") || 0) - (Date.parse(a.createdAt ?? "") || 0))
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(storeLd)} />

      {/* 1. Hero Slider Banner (contains the page H1) */}
      <HeroSection />

      {/* 2. Shop by Category */}
      <CategoryCarousel categories={CATEGORIES} />

      {/* 3. Featured Jewellery Carousel (Mangalsutra, Chains, Pendants, Bridal, Necklaces) */}
      <FeaturedJewelleryCarousel categories={CATEGORIES} />

      {/* 4. Divine Articles, Gifts & Lifestyle */}
      <SpecialCollectionCarousel />

      {/* 5. Latest Products (newest 12) */}
      <CategoryProductsShowcase initialProducts={latestProducts} />

      {/* 6. Shop by Price Section */}
      <ShopByPrice />

      {/* 7. Trust & USP Section */}
      <TrustSection />

      {/* 8. Ask happy customers for a Google review */}
      <GoogleReviewCard />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
