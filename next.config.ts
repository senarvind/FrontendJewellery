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
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];

const nextConfig: NextConfig = {
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
