// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash (ya lo tenías)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // ImageKit dominio por defecto
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
};

export default nextConfig;
