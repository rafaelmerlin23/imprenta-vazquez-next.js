/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  trailingSlash: false,
  basePath: '/app',
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
