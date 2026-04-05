// app/sitemap.ts
import { MetadataRoute } from 'next';
import { serviceCategories } from '@/lib/services-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://raqmana.vercel.app'; // استبدل برابط موقعك

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  const categoryRoutes = serviceCategories.map((category) => ({
    url: `${baseUrl}/categories/${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const extraRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/document-assistant`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/feedback`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  return [...routes, ...categoryRoutes, ...extraRoutes];
}