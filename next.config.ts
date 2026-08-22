import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "abdyz9ppcabedpf3.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
