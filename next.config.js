/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel configuration - server-side rendering enabled
  // Remove static export for Vercel deployment
  // output: 'export', // Disabled for Vercel
  // distDir: 'dist', // Use default .next for Vercel
  trailingSlash: false, // Vercel prefers no trailing slash
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Enable image optimization for Vercel
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kauerobifkgjvddyrkuz.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Optimize bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Reduce bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
  // Disable static optimization for dynamic routes
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
