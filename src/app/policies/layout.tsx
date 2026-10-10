import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store Policies – Shipping, Returns, Exchange & Hallmark",
  description:
    "Shipping, return, exchange, payment and BIS hallmark policies of Keshar Jewellers, Sarafa Market, Sehore (GSTIN 23APOPS3397D1ZK).",
  alternates: { canonical: "/policies" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
