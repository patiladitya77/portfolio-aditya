import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "do6gp1uxl3luu.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
