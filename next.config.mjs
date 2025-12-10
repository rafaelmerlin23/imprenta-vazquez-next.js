/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  output: 'export',

  images: {
    unoptimized: true,
  },

  basePath: '',
};

export default nextConfig;
