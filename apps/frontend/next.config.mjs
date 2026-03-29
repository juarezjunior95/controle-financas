/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  experimental: {
    outputFileTracingRoot: process.env.NEXT_PRIVATE_STANDALONE_WORKSPACE_ROOT || undefined,
  }
};

export default nextConfig;
