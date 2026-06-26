import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["mcbyrnecreative.com", "www.mcbyrnecreative.com"],
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
