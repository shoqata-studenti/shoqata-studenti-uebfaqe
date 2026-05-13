import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
    experimental: {
      serverActions: {
        /** Must exceed largest post cover upload (video ~40 MB in `lib/post-image-upload.ts`) + multipart overhead. */
        bodySizeLimit: "48mb",
      },
    },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
