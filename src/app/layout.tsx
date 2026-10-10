import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import BottomNav from "@/frontend/components/layout/BottomNav";
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

const SITE_TITLE = "Keshar Jewellers Sehore | 92.5 Silver & Hallmark Gold Jewellery";
const SITE_DESCRIPTION =
  "Jewellers in Sehore since 2003 – Keshar Jewellers, Sarafa Market. 92.5 sterling silver payal, rings, chains, pooja articles & BIS hallmark 22K gold jewellery. Call +91 98274 15111.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kesharjewellers.com/"),
  title: {
    default: SITE_TITLE,
    template: "%s | Keshar Jewellers Sehore",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Keshar Jewellers",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: "website",
    siteName: "Keshar Jewellers",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* Browser-side API calls (login, cart) go straight to the backend */}
        <link rel="preconnect" href="https://jewellery-backend-1ycr.onrender.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://jewellery-backend-1ycr.onrender.com" />
      </head>
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${lato.variable} antialiased min-h-screen flex flex-col justify-between`}
      >
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="pb-16 md:pb-0">
                <Navbar />
                {/* min-height keeps the footer below the fold while a page streams in (prevents layout shift) */}
                <main id="main-content" className="min-h-[100svh]">{children}</main>
              </div>
              <Footer />
              <BottomNav />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
