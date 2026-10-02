import type { NextConfig } from "next";

/**
 * Static export so the site can be hosted on GitHub Pages.
 * BASE_PATH is injected by the deploy workflow (e.g. "/itzfizz-hero")
 * because project pages live under https://<user>.github.io/<repo>/.
 */
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
