/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  trailingSlash: false,
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
