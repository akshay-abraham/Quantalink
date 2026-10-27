import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.220.35'],

  async rewrites() {
    return [
      {
        source: '/team',
        destination: '/arts/team.pdf',
      },
      {
        source: '/team.pdf',
        destination: '/arts/team.pdf',
      },
      {
        source: '/Arts/team.pdf',
        destination: '/arts/team.pdf',
      },
    ];
  },

  turbopack: {
    root: process.cwd(),
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
