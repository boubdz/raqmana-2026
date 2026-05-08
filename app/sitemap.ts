import { MetadataRoute } from 'next';
import { serviceCategories } from '@/lib/services-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://raqmana.vercel.app'; // ⚠️ استبدل هذا لاحقاً برابطك النهائي

  // 1. الصفحة الرئيسية
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/document-assistant`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sitemap`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // 2. صفحات الخدمات (من serviceCategories) - أكثر من 30 صفحة
  const categoryRoutes = serviceCategories.map((category) => ({
    url: `${baseUrl}/categories/${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...categoryRoutes];
}