/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Image optimization: AVIF first (50% smaller), fallback WebP
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // ✅ Gzip/Brotli compression on all responses
  compress: true,

  // ✅ Security headers (improves Best Practices score)
  async redirects() {
    return [
      { source: '/categories/algerie-telecom.html', destination: '/categories/telecom', permanent: true },
      { source: '/categories/anem.html', destination: '/categories/employment', permanent: true },
      { source: '/categories/bill-payment.html', destination: '/categories/bills', permanent: true },
      { source: '/categories/cnas.html', destination: '/categories/socialSecurity', permanent: true },
      { source: '/categories/foreign-affairs.html', destination: '/categories/foreignAffairs', permanent: true },
      { source: '/categories/local-administration.html', destination: '/categories/interior', permanent: true },
      { source: '/categories/pilgrimage.html', destination: '/categories/hajj', permanent: true },
      { source: '/categories/real-estate.html', destination: '/categories/realEstate', permanent: true },
      { source: '/categories/self-entrepreneur.html', destination: '/categories/autoEntrepreneur', permanent: true },
      { source: '/categories/taxes.html', destination: '/categories/tax', permanent: true },
      { source: '/categories/transport-travel.html', destination: '/categories/transport', permanent: true },
      { source: '/categories/university-services.html', destination: '/categories/university', permanent: true },
      { source: '/categories/vehicle-inspection.html', destination: '/categories/vehicles', permanent: true },
      { source: '/categories/vocational-training.html', destination: '/categories/vocational', permanent: true },
      { source: '/categories/appeal.html', destination: '/document-assistant', permanent: true },
      { source: '/categories/authorization.html', destination: '/document-assistant', permanent: true },
      { source: '/categories/certificate.html', destination: '/document-assistant', permanent: true },
      { source: '/categories/complaint.html', destination: '/document-assistant', permanent: true },
      { source: '/categories/request.html', destination: '/document-assistant', permanent: true },
      { source: '/categories/resignation.html', destination: '/document-assistant', permanent: true },
      { source: '/categories/:slug.html', destination: '/categories/:slug', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // ✅ Cache static assets aggressively
      {
        source: '/(.*)\\.(woff2|ico|png|svg|jpg|jpeg|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  experimental: {
    // ✅ Tree-shake large icon/component libraries — major bundle win
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'recharts',
      'react-icons',
    ],
  },
}

export default nextConfig
