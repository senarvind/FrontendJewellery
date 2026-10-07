import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import BottomNav from "@/frontend/components/layout/BottomNav";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import GlobalErrorBoundary from "@/components/common/GlobalErrorBoundary";
import SplashScreen from "@/frontend/components/layout/SplashScreen";

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
  metadataBase: new URL("https://www.kesharjewellers.com/"),
  title: "Keshar Jewellers | Gold & Diamond Jewellery",
  description: "Explore premium gold, diamond and jewellery collections at Keshar Jewellers.",
  icons: {
    icon: "/logo-old.png",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    title: "Keshar Jewellers | Gold & Diamond Jewellery",
    description: "Explore premium gold, diamond and jewellery collections at Keshar Jewellers.",
    url: "https://www.kesharjewellers.com/",
    type: "website",
    images: [
      {
        url: "https://www.kesharjewellers.com/og-image.jpg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to asset and API domains for lightning fast loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://jewellery-backend-1ycr.onrender.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://jewellery-backend-1ycr.onrender.com" />
      </head>
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${lato.variable} antialiased min-h-screen flex flex-col justify-between`}
      >
        <GlobalErrorBoundary>
          <SplashScreen />
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <div className="pb-16 md:pb-0">
                  <Navbar />
                  <main>{children}</main>
                </div>
                <Footer />
                <BottomNav />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
