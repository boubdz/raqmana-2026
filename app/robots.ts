import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://raqmana.vercel.app';

  return {
    rules: [
      {
        // السماح لجميع محركات البحث بالزحف الكامل
        userAgent: '*',
        allow: ['/'],
        disallow: ['/api/', '/private/'],
      },
      {
        // ضمان وصول Googlebot لكل الصفحات
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: [],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
  };
}
