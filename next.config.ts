import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://my-jewellery-backend.onrender.com";

const nextConfig: NextConfig = {
  images: {
<<<<<<< HEAD
=======
    formats: ["image/avif", "image/webp"],
>>>>>>> 7fec2451a8e278a0263f2c87cb1e75d688ca4e95
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
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
