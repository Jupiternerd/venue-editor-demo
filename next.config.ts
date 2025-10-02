import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: false,
  },
  images: {
    remotePatterns: [new URL(process.env.IMAGE_PATTERN || "https://x206voqq87.ufs.sh/f/**")],
  }
};

export default nextConfig;
