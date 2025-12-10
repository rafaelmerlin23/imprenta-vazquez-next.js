/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],


  images: {
    unoptimized: true,
  },

  basePath:'/app'
    
};

export default nextConfig;