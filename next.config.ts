import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compiler: {
        styledComponents: true, // Enables styled-components support via SWC
      },
      eslint: {
        ignoreDuringBuilds: true, // Disables ESLint checks during builds
      },
    };
  /* config options here */


export default nextConfig;
