/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/app',
  output: 'standalone',
  images: { unoptimized: true },
  trailingSlash: false, // Esto prefiere /app sobre /app/
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;