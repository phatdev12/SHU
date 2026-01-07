import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/app/:path*',
        destination: 'http://localhost:3001/:path*',
      },
      {
        source: '/app-assets/:path*',
        destination: 'http://localhost:3001/app-assets/:path*',
      },
    ]
  }
};

export default nextConfig;
