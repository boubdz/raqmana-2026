import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.raqmanadz.com';

  return {
    rules: [
      {
        // السماح لجميع محركات البحث بالزحف الكامل للصفحات واستثناء الملفات البرمجية الداخلية
        userAgent: '*',
        allow: ['/'],
        disallow: ['/api/', '/private/', '/_next/static/media/'],
      },
      {
        // ضمان وصول Googlebot لكل الصفحات واستثناء مسارات الصور المزدوجة
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/api/', '/private/', '/_next/static/media/'],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/jobs-sitemap.xml`,
      `${baseUrl}/article-sitemap.xml`,
      `${baseUrl}/news-sitemap.xml`,
    ],
  };
}
