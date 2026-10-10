import type { Metadata } from "next";
import { getAllProducts } from "@/lib/api";
import ProductListing from "@/frontend/components/products/ProductListing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Bestsellers – Most Loved Silver & Gold Jewellery",
  description: "Our customers' favourite 92.5 silver and hallmarked gold jewellery at Keshar Jewellers, Sarafa Market, Sehore.",
  alternates: { canonical: "/products/bestsellers" },
};

export default async function BestsellersPage() {
  const products = [...(await getAllProducts())]
    .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
    .slice(0, 48);

  return (
    <ProductListing
      title="Bestsellers"
      intro="The most loved pieces from Keshar Jewellers – customer favourites in 92.5 sterling silver and BIS hallmarked gold."
      products={products}
    />
  );
}
