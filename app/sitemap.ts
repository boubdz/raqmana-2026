import { MetadataRoute } from 'next';
import { serviceCategories } from '@/lib/services-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://raqmana.vercel.app';
  // تحديث التاريخ لإجبار Google على إعادة الزحف فوراً
  const lastModified = new Date('2026-06-10');

  // 1. الصفحات الرئيسية
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/document-assistant`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sitemap`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/document-guide`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/feedback`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // 2. صفحات الخدمات (من serviceCategories) — فهرسة كل صفحة مستقلة
  const categoryRoutes = serviceCategories.map((category) => ({
    url: `${baseUrl}/categories/${category.id}`,
    lastModified,
    changeFrequency: 'daily' as const,  // تغيير لـ daily لإجبار إعادة الزحف
    priority: 0.9,  // رفع الأولوية لـ 0.9
  }));

  return [...routes, ...categoryRoutes];
}
