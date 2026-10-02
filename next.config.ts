import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the tracing root to this project. Without it, Next walks up and finds
  // an unrelated lockfile in the home directory, which breaks build tracing.
  outputFileTracingRoot: path.resolve(process.cwd()),

  // Trim response overhead and stop advertising the framework.
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  compiler: {
    styledComponents: true, // Enables styled-components support via SWC
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint checks during builds
  },

  // Serve modern, smaller image formats and cache the optimizer output hard so
  // repeat visits to the party menu don't re-encode 68 photos.
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [360, 480, 640, 768, 1024, 1200, 1600, 1920],
    imageSizes: [64, 84, 128, 256, 384],
  },

  experimental: {
    // Opt-in low-memory mode for constrained machines / CI:
    // `NEXT_LOW_MEMORY=1 npm run build`. Caps build workers so Next's
    // parallel workers don't get OOM-killed mid-build.
    ...(process.env.NEXT_LOW_MEMORY === "1"
      ? { cpus: 1, workerThreads: false }
      : {}),
    // Tree-shake icon barrels and date helpers instead of bundling the whole set.
    optimizePackageImports: [
      "@fortawesome/free-solid-svg-icons",
      "react-icons",
      "date-fns",
    ],
  },
};

export default nextConfig;
