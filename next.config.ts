import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "abdyz9ppcabedpf3.public.blob.vercel-storage.com",
      },
    ],

    qualities: [55, 65, 70, 75, 82, 88],
  },
};

export default nextConfig;
