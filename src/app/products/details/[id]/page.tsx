import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, getProductsByCategory } from "@/lib/api";
import ProductCard from "@/frontend/components/products/ProductCard";
import ProductDetailClient from "./ProductDetailClient";
import {
  BUSINESS,
  abs,
  breadcrumbLd,
  categoryName,
  isInStock,
  jsonLdHtml,
  productName,
  productPath,
  visiblePrice,
} from "@/lib/seo";

export const revalidate = 300;

// Built on first visit, then cached (ISR). Required for revalidate to apply.
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return {};

  const name = productName(product);
  const price = visiblePrice(product).toLocaleString("en-IN");
  const description = `${name}${product.weight ? `, ${product.weight}` : ""}, ${product.material}. ₹${price} – BIS hallmarked jewellery from Keshar Jewellers, Sarafa Market, Sehore.`;
  const path = productPath(product);

  return {
    title: `${name} – ₹${price}`,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: name,
      description,
      images: product.frontImage ? [{ url: abs(product.frontImage), alt: name }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const name = productName(product);
  const url = abs(productPath(product));
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name,
    description: product.description || name,
    sku: product.id,
    image: [product.frontImage, product.backImage, product.modelImage].filter(Boolean).map(abs),
    brand: { "@type": "Brand", name: BUSINESS.name },
    category: categoryName(product.category),
    ...(product.material ? { material: product.material } : {}),
    offers: {
      "@type": "Offer",
      url,
      price: visiblePrice(product),
      priceCurrency: "INR",
      availability: isInStock(product) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: BUSINESS.name },
    },
  };

  const related = (await getProductsByCategory(product.category).catch(() => []))
    .filter((p) => p.id !== product.id)
    .slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(productLd)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: categoryName(product.category), path: `/products/${product.category}` },
            { name },
          ])
        )}
      />
      <ProductDetailClient product={product} />
      {related.length > 0 && (
        <section className="bg-[#FFF8F0] px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-xl sm:text-2xl text-[#9B1B30] mb-4">
              More {categoryName(product.category)}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
