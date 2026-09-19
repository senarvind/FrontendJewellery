import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#7C1B2A",
};

export const metadata: Metadata = {
  title: "Keshar Jewellers | Best Jewellery Showroom in Sehore (Since 2003)",
  description: "Keshar Jewellers - Charkha Line, Sarafa Bazar, Sehore. BIS Hallmarking Reg: HM/C-8290497727. Authentic Hallmark Certified Gold, Silver, and Natural Navratna Gemstones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${lato.variable} antialiased min-h-screen flex flex-col justify-between`}
      >
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div>
                <Navbar />
                <main>{children}</main>
              </div>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
