import type { NextConfig } from "next";

// Static export, deployed from out/. trailingSlash keeps every page at /path/ so the
// canonical and the file on disk agree (without it Netlify redirects /about -> /about/).
// CONTEXT is Netlify's build context ("production", "deploy-preview", "branch-deploy");
// it is baked in here because it does not exist at runtime in a static site.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  env: { BUILD_CONTEXT: process.env.CONTEXT ?? "" },
};

export default nextConfig;
