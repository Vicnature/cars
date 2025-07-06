/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // React 19
  },
  images: {
    domains: ['cdn.imagin.studio'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/studio/:path*',
        destination: '/studio/[[...index]]',
      },
    ]
  },
}

export default nextConfig
