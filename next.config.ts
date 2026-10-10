import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [55, 65, 70, 75, 82, 88],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "abdyz9ppcabedpf3.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
