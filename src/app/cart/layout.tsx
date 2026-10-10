import type { Metadata } from "next";

// Private / account page: keep it out of Google results but let links be followed.
export const metadata: Metadata = {
  title: "Shopping Bag",
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
