import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.raqmanadz.com';

  return {
    rules: [
      {
        // 1. روبوتات محركات البحث المعتمدة ومراجعي Google AdSense (سماح كامل)
        userAgent: [
          'Googlebot',
          'Mediapartners-Google',
          'AdsBot-Google',
          'Bingbot',
          'msnbot',
        ],
        allow: ['/'],
        disallow: ['/api/', '/private/', '/_next/static/media/', '/OneSignalSDKWorker.js', '/OneSignalSDKUpdaterWorker.js'],
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
