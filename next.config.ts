import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.220.35'],

  async redirects() {
    return [
      {
        source: '/profile.webp',
        destination: '/akshay-abraham-aiboomi-portrait.webp',
        permanent: true,
      },
      {
        source: '/og-image.png',
        destination: '/akshay-abraham-portfolio.png',
        permanent: true,
      },
      {
        source: '/events/first-presentation.webp',
        destination: '/events/akshay-abraham-first-presentation.webp',
        permanent: true,
      },
      {
        source: '/events/hack4future-2025.webp',
        destination: '/events/akshay-abraham-hack4future-2025.webp',
        permanent: true,
      },
      {
        source: '/events/hackfinity-2025.webp',
        destination: '/events/akshay-abraham-hackfinity-2025.webp',
        permanent: true,
      },
      {
        source: '/events/sameeksha-2026.webp',
        destination: '/events/akshay-abraham-sameeksha-2026.webp',
        permanent: true,
      },
      {
        source: '/events/arts-captain.webp',
        destination: '/events/akshay-abraham-arts-captain.webp',
        permanent: true,
      },
      {
        source: '/events/yc-startup-school.webp',
        destination: '/events/akshay-abraham-yc-startup-school-india.webp',
        permanent: true,
      },
      {
        source: '/events/aiboomi-kochi.webp',
        destination: '/events/akshay-abraham-aiboomi-kochi.webp',
        permanent: true,
      },
    ];
  },

  experimental: {
    useTypeScriptCli: false,
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
