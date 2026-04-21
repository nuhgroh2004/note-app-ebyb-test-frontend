import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Railway's internal network requests during dev
  allowedDevOrigins: ["172.24.64.1"],

  // Expose the backend URL to Next.js server-side via env
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL ?? "",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
