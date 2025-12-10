/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/app',
  output: 'standalone',
  images: { unoptimized: true },
  trailingSlash: false,
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return [
      {
        source: '/app',
        destination: '/app/',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
