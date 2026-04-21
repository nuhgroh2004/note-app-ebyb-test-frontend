import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Railway's internal network requests during dev
  allowedDevOrigins: ["172.24.64.1"],

  env: {
    // Other env variables can go here
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
