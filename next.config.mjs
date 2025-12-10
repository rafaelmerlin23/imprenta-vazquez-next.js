/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/app',
  output: 'standalone',
  images: { 
    unoptimized: true 
  },
  trailingSlash: true,
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;