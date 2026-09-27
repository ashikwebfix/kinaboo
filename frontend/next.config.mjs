/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['http://192.168.1.232:6711', '192.168.1.232:6711', '192.168.1.232'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:6710/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://127.0.0.1:6710/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
