import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/en/home", destination: "/en", permanent: true },
      { source: "/ja/home", destination: "/ja", permanent: true },
      { source: "/studio", destination: "/studio/structure", permanent: false },
    ];
  },
};

export default nextConfig;
