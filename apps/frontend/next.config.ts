import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Watch for changes in the workspace package
  transpilePackages: ["@shadoworg/shadowui"],
};

export default nextConfig;
