import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("http://localhost:4000/**"),
      new URL("https://placehold.co/**"),
    ],
  },
};

export default nextConfig;
