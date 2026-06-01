/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['s3.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*s3.us-east-1.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;
