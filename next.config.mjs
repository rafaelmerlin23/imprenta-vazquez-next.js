/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/app',
  
  output: 'standalone', 
  
  images: { 
      unoptimized: true 
  },
  
  trailingSlash: false,
  reactStrictMode: true,
};

export default nextConfig;