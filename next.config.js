/** @type {import('next').NextConfig} */
const nextConfig = {
  // PWA configuration will be added here
  reactStrictMode: true,
  
  // Ensure proper headers for PWA
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
