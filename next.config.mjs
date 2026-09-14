/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@resvg/resvg-js", "archiver"],
  },
};

export default nextConfig;
