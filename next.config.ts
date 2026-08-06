import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudinary already serves optimized, CDN-cached images. Running
    // them through Next's server-side optimizer again adds a fragile
    // extra network hop that was timing out intermittently (the
    // "upstream image response timed out" errors). Since every remote
    // image on this site comes from Cloudinary already, there's
    // nothing to gain from re-optimizing — the browser just fetches
    // the URL directly instead.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
