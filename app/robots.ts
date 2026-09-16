import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.raqmanadz.com';

  return {
    rules: [
      {
        // 1. محركات البحث الرئيسية (فهرسة كاملة وسماح لجميع المحتويات والخدمات)
        userAgent: ['Googlebot', 'Bingbot', 'msnbot'],
        allow: ['/'],
        disallow: ['/api/', '/private/', '/_next/static/media/', '/OneSignalSDKWorker.js', '/OneSignalSDKUpdaterWorker.js'],
      },
      {
        // 2. روبوتات مراجعة إعلانات Google AdSense (تركيز الزحف حصراً على المقالات والمحتوى التحريري وتجنب صفحات القوالب السريعة)
        userAgent: ['AdsBot-Google', 'Mediapartners-Google'],
        allow: ['/articles/', '/document-guide/', '/categories/', '/about', '/contact', '/privacy-policy', '/terms-of-service'],
        disallow: ['/services/', '/api/', '/private/', '/_next/static/media/'],
      },
      {
        // 2. حظر روبوتات جمع البيانات الشرهة والذكاء الاصطناعي لحماية باقة Vercel
        userAgent: [
          'Bytespider',
          'PetalBot',
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'anthropic-ai',
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'CCBot',
          'DotBot',
          'SeekportBot',
          'DataForSeoBot',
        ],
        disallow: ['/'],
      },
      {
        // 3. القاعدة العامة لبقية محركات البحث
        userAgent: '*',
        allow: ['/'],
        disallow: ['/api/', '/private/', '/_next/static/media/', '/OneSignalSDKWorker.js', '/OneSignalSDKUpdaterWorker.js'],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/article-sitemap.xml`,
      `${baseUrl}/news-sitemap.xml`,
    ],
  };
}
