/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  basePath:
    process.env.GITHUB_REPOSITORY?.split('/')[1]
      ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}`
      : '',
};

export default nextConfig;
