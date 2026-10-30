import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/privacy",
        destination: "/legal/privacy",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/legal/terms",
        permanent: true,
      },
      {
        source: "/cookies",
        destination: "/legal/cookies",
        permanent: true,
      },
      {
        source: "/product",
        destination: "/features",
        permanent: true,
      },
      {
        source: "/resources",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/about/data",
        destination: "/intelligence",
        permanent: true,
      },
      {
        source: "/help",
        destination: "/help-center",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/signup",
        permanent: true,
      },
      {
        source: "/guides",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
