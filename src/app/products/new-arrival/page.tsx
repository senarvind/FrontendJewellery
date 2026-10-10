import type { Metadata } from "next";
import { getAllProducts } from "@/lib/api";
import ProductListing from "@/frontend/components/products/ProductListing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "New Arrivals – Latest Silver & Gold Designs",
  description: "The newest 92.5 silver and hallmarked gold jewellery designs at Keshar Jewellers, Sarafa Market, Sehore.",
  alternates: { canonical: "/products/new-arrival" },
};

export default async function NewArrivalPage() {
  const products = [...(await getAllProducts())]
    .sort((a, b) => (Date.parse(b.createdAt ?? "") || 0) - (Date.parse(a.createdAt ?? "") || 0))
    .slice(0, 48);

  return (
    <ProductListing
      title="New Arrivals"
      intro="Our latest handcrafted designs in 92.5 sterling silver and BIS hallmarked gold – freshly added to the Keshar Jewellers collection."
      products={products}
    />
  );
}
