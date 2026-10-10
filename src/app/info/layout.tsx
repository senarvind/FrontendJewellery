import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us – Jewellery Shop in Sarafa Market, Sehore since 2003",
  description:
    "Keshar Jewellers, Charkha Line, Sarafa Market, Sehore – family jewellers since 2003, owned by Amit Kumar Soni. BIS hallmark reg. HM/C-8290497727. 92.5 silver and 22K hallmarked gold.",
  alternates: { canonical: "/info" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
