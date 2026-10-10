import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductsByCategory } from "@/lib/api";
import { STORE_CATEGORIES } from "@/frontend/types/product";
import { CATEGORY_SEO } from "@/frontend/data/categorySeo";
import ProductCard from "@/frontend/components/products/ProductCard";
import { breadcrumbLd, jsonLdHtml } from "@/lib/seo";

export const revalidate = 300;

// Empty list = nothing built at deploy time; each category is built on its
// first visit and then cached (ISR), so a backend outage keeps the last good page.
export async function generateStaticParams() {
  return [];
}

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

function findCategory(slug: string) {
  return STORE_CATEGORIES.find((c) => c.slug === slug.toLowerCase());
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const catMeta = findCategory(category);
  if (!catMeta) return {};
  const seo = CATEGORY_SEO[catMeta.slug];
  const products = await getProductsByCategory(catMeta.slug);
  const path = `/products/${catMeta.slug}`;
  return {
    title: seo?.title ?? catMeta.name,
    description: seo?.description,
    alternates: { canonical: path },
    openGraph: { url: path, title: seo?.title ?? catMeta.name, description: seo?.description },
    // Keep empty categories out of Google until they have stock.
    ...(products.length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const catMeta = findCategory(category);
  if (!catMeta) notFound();

  const products = await getProductsByCategory(catMeta.slug);
  const seo = CATEGORY_SEO[catMeta.slug];
  const categoryTitle = catMeta.name;
  const hallmark = catMeta.hallmarkText || "✦ BIS 91.6 & 92.5 STERLING HALLMARK CERTIFIED ✦";

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#35191C] px-2.5 sm:px-8 lg:px-12 py-3 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Jewellery", path: "/products" },
            { name: categoryTitle, path: `/products/${catMeta.slug}` },
          ])
        )}
      />
      <div className="max-w-7xl mx-auto">
        {/* Back Navigation Bar */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3 bg-[#FFF0EA] border border-[#E8CFC5] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#9B1B30] hover:bg-[#7C1B2A] text-[#FFF8F0] transition-all text-xs font-bold shadow-xs active:scale-95 flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-[#6F4A4A] overflow-hidden">
            <Link href="/" className="hover:text-[#9B1B30] font-medium hover:underline">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#9B1B30] font-medium hover:underline">Jewellery</Link>
            <span>/</span>
            <span className="text-[#9B1B30] font-bold truncate max-w-[140px] sm:max-w-none">{categoryTitle}</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 px-1">
          <span className="text-[#965238] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-xs font-bold block mb-1.5 sm:mb-2">
            {hallmark}
          </span>
          <h1 className="font-serif text-2xl sm:text-5xl lg:text-6xl text-[#9B1B30] tracking-tight mb-2 sm:mb-3">
            {seo?.h1 ?? categoryTitle}
          </h1>
          <div className="flex items-center justify-center gap-3 my-2 sm:my-3 text-[#D4AF37]/60 w-36 sm:w-48 mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
            <span className="text-xs font-serif text-[#A77C18]">❖</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent flex-1" />
          </div>
          <p className="font-light text-[#6F4A4A] text-xs sm:text-base leading-relaxed">
            {seo?.intro ??
              `Handcrafted, hallmarked ${categoryTitle.toLowerCase()} from Keshar Jewellers, Sarafa Market, Sehore.`}
          </p>
        </div>

        {/* Products Grid (2 columns on Mobile, 3-4 on Desktop) */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6 lg:gap-8">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-3xl p-6 sm:p-16 text-center max-w-2xl mx-auto shadow-sm my-6 sm:my-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-[#FFF0EA] border border-[#D4AF37]/40 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
              💎
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#9B1B30] mb-2">
              New Designs Launching Soon
            </h2>
            <p className="text-xs sm:text-sm text-[#6F4A4A] mb-6 leading-relaxed">
              We are curating exquisite new handcrafted pieces for our {categoryTitle} collection. Custom orders and instant catalog previews are available directly on WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`https://wa.me/919827415111?text=Hello%20Keshar%20Jewellers,%20please%20share%20the%20latest%20designs%20for%20${encodeURIComponent(categoryTitle)}.`}
                target="_blank"
                className="px-5 py-2 sm:px-6 sm:py-2.5 bg-[#B82E44] hover:bg-[#7C1B2A] text-[#FFF8F0] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
              >
                Enquire for {categoryTitle} on WhatsApp
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
