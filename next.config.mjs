/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/gtwm-ai',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
};

export default nextConfig;
