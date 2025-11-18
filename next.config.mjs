/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],

  images: {
    unoptimized: true,
  },

  basePath:
    process.env.GITHUB_REPOSITORY?.split('/')[1]
      ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}`
      : '',
};

export default nextConfig;
