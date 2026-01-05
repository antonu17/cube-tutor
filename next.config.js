/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization where possible
  output: 'standalone',
  
  // Optimize images (when we add them in V1)
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Reduce bundle size
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

// Bundle analyzer (run with ANALYZE=true bun run build)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
