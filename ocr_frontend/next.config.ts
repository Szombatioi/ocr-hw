import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3001';
    const notificationUrl = process.env.NOTIFICATION_URL ?? 'http://localhost:3003';
    return [
      { source: '/api/:path*', destination: `${backendUrl}/:path*` },
      { source: '/notify/:path*', destination: `${notificationUrl}/:path*` },
    ];
  },
};

export default nextConfig;
