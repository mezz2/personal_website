import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {};

const withMDX = createMDX({
  options: {
    // Plugins are passed by name so they work under Turbopack.
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
