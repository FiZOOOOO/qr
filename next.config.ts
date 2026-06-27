import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/qr",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["www.fizoapps.com"],
    },
  },
};

export default nextConfig;
