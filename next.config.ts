import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "is1-ssl.mzstatic.com" },
      { protocol: "https", hostname: "mosaic.scdn.co" },
      { protocol: "https", hostname: "cdn-images.dzcdn.net" },
      { protocol: "https", hostname: "**.spotifycdn.com" },
    ],
  },
};

export default nextConfig;
