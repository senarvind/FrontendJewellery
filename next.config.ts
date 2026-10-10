import type { NextConfig } from "next";

const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "https://jewellery-backend-1ycr.onrender.com").trim().replace(/\/+$/, "");

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "jewellery-backend-1ycr.onrender.com",
      },
      {
        protocol: "https",
        hostname: "jewellery-gfwd.onrender.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  // Old / duplicate URLs → one canonical page each (308 = permanent, keeps Google ranking).
  async redirects() {
    return [
      { source: "/about", destination: "/info", permanent: true },
      { source: "/policy", destination: "/policies", permanent: true },
      { source: "/track-order", destination: "/orders", permanent: true },
      { source: "/products/all", destination: "/products", permanent: true },
      { source: "/products/religious-gift-items", destination: "/products/pooja-articles", permanent: true },
      { source: "/products/price/under-1000", destination: "/products/price/under-999", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
      {
        source: "/images/products/:path*",
        destination: `${backendUrl}/images/products/:path*`,
      },
    ];
  },
};

export default nextConfig;
