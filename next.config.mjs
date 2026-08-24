import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Clean up public/categories directory to prevent shadowing Next.js App Router paths
const publicCategoriesPath = path.join(__dirname, 'public', 'categories');
if (fs.existsSync(publicCategoriesPath)) {
  try {
    fs.rmSync(publicCategoriesPath, { recursive: true, force: true });
    console.log('🧹 Automatically removed public/categories to prevent page shadowing.');
  } catch (error) {
    console.error('❌ Failed to remove public/categories:', error);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['date-fns'],

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
      { source: '/categories/orientation', destination: '/categories/university', permanent: true },
      { source: '/categories/:slug.html', destination: '/categories/:slug', permanent: true },
      // ✅ 301 Redirects for duplicate article/category routes to resolve Google Search Console Duplicate Canonical issue
      { source: '/articles/youth', destination: '/categories/youth', permanent: true },
      { source: '/articles/banking', destination: '/categories/banking', permanent: true },
      { source: '/articles/justice', destination: '/categories/justice', permanent: true },
      { source: '/articles/eVisa', destination: '/categories/foreignAffairs', permanent: true },
      { source: '/articles/dzds', destination: '/categories/dzds', permanent: true },
      { source: '/articles/startups', destination: '/categories/commerce', permanent: true },
      { source: '/articles/insurance', destination: '/categories/insurance', permanent: true },
      { source: '/articles/agricultureWater', destination: '/categories/agriculture', permanent: true },
      { source: '/articles/cnrc', destination: '/categories/cnrc', permanent: true },
      // ✅ 301 Permanent Redirects (Link Juice Transfer) from all deleted auto-articles to Homepage (/) & primary hubs
      { source: '/articles/shahadat-mt64ojuy', destination: '/categories/education', permanent: true },
      { source: '/articles/awliyaa-fadaa-tarbiya-mt64p71e', destination: '/categories/education', permanent: true },
      { source: '/articles/raqmiya-musabaqa-natayij-mt64qa7b', destination: '/jobs', permanent: true },
      { source: '/articles/madrasi-dokhoul-awliyaa-mt6b1g5g', destination: '/categories/education', permanent: true },
      { source: '/articles/awliyaa-fadaa-raqmiya-mt6b2e3w', destination: '/categories/education', permanent: true },
      { source: '/articles/iiwaa-iqamat-jamiiya-mt6p3bap', destination: '/categories/university', permanent: true },
      { source: '/articles/jamiiya-ilmi-nukhab-mt6v745e', destination: '/categories/university', permanent: true },
      { source: '/articles/jamiiya-nukhab-ibtikaria-mt6v7lxs', destination: '/categories/university', permanent: true },
      { source: '/articles/jaysh-madaris-mt4x9d9a', destination: '/jobs', permanent: true },
      { source: '/articles/tanmiya-mahaliya-shakawy-mt69gkcy', destination: '/categories/interior', permanent: true },
      { source: '/articles/shiraka-bahth-ilmi-mt6p2ohk', destination: '/categories/university', permanent: true },
      { source: '/articles/auto-dlyl-:slug*', destination: '/', permanent: true },
      { source: '/articles/trend-:slug*', destination: '/', permanent: true },
      { source: '/articles/auto-aldlyl-:slug*', destination: '/', permanent: true },
      { source: '/articles/auto-:slug*', destination: '/', permanent: true },
      { source: '/articles/trend-aldlyl-:slug*', destination: '/', permanent: true },
      { source: '/articles/undefined', destination: '/', permanent: true },
      // ✅ Direct 1-Hop 301 Redirects for long legacy auto-generated slugs
      { source: '/articles/trend-aldlyl-alshaml-lltjnyd-fy-mdars-wmwssat-aljysh-alw-mt4x9d9a', destination: '/jobs', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-lltsdyq-ala-alshhadat-wkshwf-alnqat-mt64ojuy', destination: '/categories/education', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-l-almnsa-alrqmya-lwzara-altrbya-alw-mt64p71e', destination: '/categories/education', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-llatlaa-ala-alntayj-alnhayya-wastkm-mt64qa7b', destination: '/jobs', permanent: true },
      { source: '/articles/trend-aldlyl-alshaml-ltqdym-shkawa-altnmya-almhlya-wmtab-mt69gkcy', destination: '/categories/interior', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-lkhdmat-aldkhwl-almdrsy-abr-fdaa-al-mt6b1g5g', destination: '/categories/education', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-lltrtybat-albydaghwjya-walkhdmat-al-mt6b2e3w', destination: '/categories/education', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-lbrnamj-alshraka-walbhth-alalmy-wal-mt6p2ohk', destination: '/categories/university', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-lkhdmat-aliywaa-waliqamat-aljamaya--mt6p3bap', destination: '/categories/university', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-lmrafqa-wdam-alnkhb-aljamaya-walmsh-mt6v745e', destination: '/categories/university', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-lbrnamj-dam-wtkrym-almsharya-alabtk-mt6v7lxs', destination: '/categories/university', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-lkhdma-altsdyq-ala-alshhadat-walwth-mt6p1zam', destination: '/categories/education', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-l-mnsa-wzara-altrbya-alwtnya-wastkh-mt6ii8ij', destination: '/categories/education', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-llatlaa-ala-ntayj-msabqa-altwdhyf-a-mt6b0mck', destination: '/jobs', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-l-rznama-aldkhwl-almdrsy-wajraaat-a-mt6ihjb6', destination: '/categories/education', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-l-mnsa-fdaa-alawlyaa-waltrtybat-alb-mt6iiy9m', destination: '/categories/education', permanent: true },
      { source: '/articles/auto-aldlyl-alshaml-lkhdmat-aliywaa-alitaam-walnql-alja-mt6v6n08', destination: '/categories/university', permanent: true },
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
